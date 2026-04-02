## Context

Canvas Studio 是一个开源 Canvas 编辑器，采用 monorepo 结构：
- `apps/web`: React 18 + Vite 5 + Mantine 7（SPA 前端）
- `apps/server`: NestJS 10 + MongoDB（独立后端 API）
- `packages/canvas-core`: 共享类型和 Konva 工具函数

当前架构存在三个关键痛点：
1. **SPA 局限性**：Vite SPA 无法 SSR，预览页 `/preview/:shareId` SEO 不友好
2. **技术债累积**：Mantine 7 停止维护，React 18 → 19 升级受阻
3. **部署复杂度**：两个独立服务增加基础设施和 CI/CD 成本

目标是一次性完成全栈迁移到 Next.js 16 + Mantine 9，用 Next.js Route Handlers 替代 NestJS。

## Goals / Non-Goals

**Goals:**
- 完成 React 18 → React 19 的所有依赖升级
- 将前端框架从 Vite + React Router 迁移到 Next.js 16 App Router
- 将 UI 库从 Mantine 7 升级到 Mantine 9，完成所有 breaking changes 适配
- 将后端 API 从 NestJS 迁移到 Next.js Route Handlers
- 保持 Canvas 编辑器的所有现有功能（editor / image-editor / live / preview）
- 保持 Canvas 渲染引擎（Konva + react-konva）的行为完全一致
- 保持 Zustand 状态管理和 TanStack Query 数据获取逻辑

**Non-Goals:**
- 不重构 Canvas 元素的业务逻辑（avatar/apng/carousel/slide 等）
- 不变更 MongoDB 数据模型（保持 schema 兼容）
- 不实现新的 API endpoint（仅迁移现有 endpoint）
- 不升级 MongoDB 版本
- 不做 CSS 变量品牌色全局重设计（仅迁移现有 Mantine theme）
- 不迁移 `packages/canvas-core`（无平台依赖，保持原样）

## Decisions

### Decision 1: Next.js App Router（而非 Pages Router）

**选择**: App Router (`app/` 目录)
**理由**:
- Server Components 是未来方向，Pages Router 是保守过渡方案
- Streaming SSR 提升 Canvas 编辑器初始加载体验
- Route Groups 便于组织布局（`app/(main)/`、`app/(editor)/`）
- Middleware 统一入口，比多个 Provider 更清晰

**替代方案**:
- Pages Router (`pages/`): 更接近当前 Vite SPA 迁移成本，但未来会被废弃

### Decision 2: Mantine 9 直接升级（跳过 v8）

**选择**: Mantine 7 → 9（跳过 v8）
**理由**:
- v9 是当前最新稳定版，v8 处于维护末期（EOL 倒计时）
- React 19 带来的并发特性与 Mantine 9 深度集成
- v8 到 v9 的 breaking changes 同样存在，早迁移早受益

**关键 Breaking Changes（v7→v9）**:
- CSS 变量前缀：`--mantine` 前缀统一（v7 有不一致）
- `useMantineColorScheme` → `useColorScheme` 或 `ColorSchemeProvider` 变更
- `@mantine/notifications`: API 重构（`notifications.show()` 签名变化）
- `@mantine/modals`: 拆分为独立包 `@mantine/modals`，需额外安装
- `AppShell` 布局 API 调整
- `createStyles` 移除，改用 `createStyles` 迁移到 CSS Modules 或 Mantine 内置方案

**替代方案**:
- Mantine 7 → 8 → 9 渐进升级：风险分摊，但多一次迁移成本

### Decision 3: Next.js Route Handlers 替代 NestJS

**选择**: 所有 API endpoint 迁移到 `app/api/` Route Handlers
**理由**:
- 消除独立后端服务，简化部署（一个 `next start` 搞定全栈）
- Route Handlers 支持 Streaming Responses（对 Canvas 导出等大响应有用）
- MongoDB 连接层提取为独立模块复用

**Route Handlers 文件布局**:
```
app/api/
├── canvas/route.ts          GET, POST
├── canvas/[id]/route.ts     GET, PATCH, DELETE
├── canvas/[id]/pages/route.ts
├── canvas/[id]/track/route.ts
├── canvas/[id]/duplicate/route.ts
├── project/route.ts
├── project/[id]/route.ts
├── template/route.ts
├── template/[id]/route.ts
├── asset/route.ts
├── asset/[id]/route.ts
├── brandkit/route.ts
├── brandkit/[id]/route.ts
├── share/route.ts
└── share/[id]/route.ts
```

**替代方案**:
- 保留 NestJS 作为独立服务（只迁移前端）：放弃了简化的初衷
- tRPC + Next.js API Routes：引入 tRPC 增加复杂度，不适合当前规模

### Decision 4: MongoDB 连接层提取为独立模块

**选择**: `lib/db.ts` 独立模块 + `lib/mongodb.ts` 连接池
**理由**:
- Next.js Route Handlers 和 Server Components 都可能需要数据库访问
- 单例模式避免开发模式下连接泄漏
- 与 NestJS 的 `MongooseModule` 粒度对齐但更轻量

**实现**:
```typescript
// lib/mongodb.ts
import mongoose from 'mongoose'
const MONGODB_URI = process.env.MONGODB_URI!
let cached = global.mongoose || { conn: null, promise: null }
export async function connectDB() {
  if (cached.conn) return cached.conn
  cached.conn = await mongoose.connect(MONGODB_URI)
  return cached.conn
}
```

### Decision 5: Zustand Store 的 SSR 安全包装

**选择**: 创建一个 `lib/store-provider.tsx` Client Component 包裹
**理由**:
- Zustand 在 SSR 时需要避免 hydration mismatch
- Server Components 不能直接调用 `useEditorStore()`
- 所有 store 必须在 Client Component 树内使用

**架构**:
```
app/
├── layout.tsx          (Server Component, 返回 HTML shell)
├── providers.tsx       (Client Component, 包含 MantineProvider + QueryClientProvider)
├── editor/
│   └── page.tsx        (Server Component, 加载初始数据)
│       └── EditorClient.tsx (Client Component, 使用 store)
```

### Decision 6: CanvasPlayer / Konva 全局 Client Component

**选择**: 所有 Canvas 相关组件顶层标记 `"use client"`
**理由**:
- Konva 完全依赖浏览器 DOM 和 Canvas API
- react-konva 的 `Stage`/`Layer`/`Group` 只能在 Client 环境运行
- 不可能将任何 Konva 渲染逻辑放在 Server Component

**后果**:
- `app/editor/page.tsx`（Server Component）→ 渲染 `<EditorClient />`
- `EditorClient.tsx`（Client Component）→ 渲染 `<CanvasPlayer />`

### Decision 7: TanStack Query 的 SSR 集成

**选择**: QueryClientProvider 放在客户端，通过 `nuqs` 或 React Context 传递初始数据
**理由**:
- Next.js App Router 的 Server Components 适合做数据预取（通过 fetch）
- 预取的数据通过 `dehydrate`/`HydrationBoundary` 传给客户端 QueryClient
- 避免 double-fetching

**架构**:
```
app/editor/[id]/page.tsx (Server Component)
  → 读取 canvas 数据
  → 返回 <HydrationBoundary state={dehydrate(queryClient)}>
      → <EditorClient initialData={canvasData} />
```

### Decision 8: i18n 迁移到 Next.js 环境

**选择**: 保留 react-i18next，迁移 `i18n.ts` 初始化到 Next.js 插件 `@innext/i18next`
**理由**:
- i18n 配置需在 Server 和 Client 都可用
- 资源文件（en.ts / zh.ts）作为 Next.js 翻译源文件加载
- Middleware 处理 locale 检测

## Risks / Trade-offs

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| Mantine v9 breaking changes 导致 UI 组件大量报错 | 高：影响所有页面 | Phase 1 优先完成依赖安装，单独跑 build 看全部 TS 错误 |
| Zustand SSR hydration mismatch | 高：编辑状态丢失 | Provider 模式隔离，所有 store 在 Client Component 内 |
| Konva + Next.js 懒加载冲突 | 中：Canvas 首屏渲染慢 | 使用 `next/dynamic` + `{ ssr: false }` 懒加载 CanvasPlayer |
| Route Handlers 不支持 WebSocket（实时编辑） | 中：Live 页面功能受损 | 保留 WebSocket Server（如有实时需求）或降级为 polling |
| NestJS guards/interceptors 无法迁移 | 低：部分 API 逻辑丢失 | 在 Route Handler 内手动实现或提取为共享函数 |
| next/image 与 react-konva 图片加载冲突 | 低：某些素材预览异常 | 使用 `use-image` hook 或自定义 Konva Image loader |
| Monorepo TypeScript 路径别名冲突 | 中：build 失败 | Next.js `baseUrl` + `paths` 配置与 workspace 协同 |

**[Migration Risk] Big Bang vs Incremental** → 选择 Big Bang（一次完成）
- 理由：跨框架迁移（Vite→Next.js）增量改动的收益低，冲突会持续存在于两个版本之间
- 缓解：充分的 git 分支管理和每晚自动化 build 测试

## Migration Plan

### Phase 1: 环境准备（1-2天）
1. 创建 `apps/next-app/` Next.js 16 项目（`create-next-app --latest`）
2. 安装依赖：`react@19`、`@mantine/core@9`、所有 Mantine v9 生态包
3. 迁移 `packages/canvas-core` 引用（保持 workspace 依赖）
4. 跑通基础 build 和 dev server

### Phase 2: 路由迁移（2-3天）
1. 迁移 `App.tsx` 路由 → `app/` 文件系统路由
2. 迁移所有页面（`/`、`/editor/`、`/image-editor/`、`/live/`、`/preview/`）
3. 迁移 `AppLayout.tsx` → `app/layout.tsx`
4. 迁移 `MantineProvider`/`QueryClientProvider` → `app/providers.tsx`

### Phase 3: Canvas 组件迁移（2-3天）
1. 迁移 `CanvasPlayer` → `EditorClient.tsx` 包裹
2. 迁移所有 Canvas 元素组件（`AvatarElement`、`BubbleText`、`Carousel` 等）
3. 适配 Zustand store SSR 边界

### Phase 4: API 层迁移（3-5天）
1. 提取 MongoDB 连接 → `lib/mongodb.ts`
2. 迁移 Canvas API → `app/api/canvas/route.ts` 等
3. 迁移 Project/Template/Asset/BrandKit/Share API
4. 逐个 endpoint 测试验证

### Phase 5: Mantine v9 适配（2-3天）
1. 修复 CSS 变量前缀问题
2. 适配 `@mantine/notifications` API 变更
3. 修复 `AppShell`/`Modal` 等组件 breaking changes
4. 全局样式审查（深色/浅色主题切换）

### Phase 6: 收尾与验证（2-3天）
1. 端到端测试（editor/live/preview/image-editor）
2. 删除 `apps/web/`（Vite）、`apps/server/`（NestJS）
3. 更新根 `package.json` workspaces
4. 更新 README 和部署文档

**总工期**: 约 2-3 周

## Open Questions

1. **WebSocket 实时编辑**：Live 页面的实时功能（如果有）是否需要 WebSocket Server？是否迁移到第三方服务（Pusher/Ably）？
2. **Swagger 文档**：NestJS 自带 Swagger。迁移后是否需要手动维护 API 文档（用 Postman/Insomnia）还是接入 Next.js 友好的方案？
3. **环境变量命名**：`.env` 中 MongoDB URI 是否保持 `MONGODB_URI` 还是改为 `DATABASE_URL`？
4. **SSR vs SSG**：Canvas 编辑器页面是否需要 SSR（SEO）？如果不需要可标记为 `'use client'` 全局
5. **部署平台**：当前部署在哪里（Vercel/自托管/Docker）？Next.js 16 兼容性如何？
6. **缓存策略**：NestJS 的 cache interceptor（如果有）迁移后如何实现？Next.js `unstable_cache` 还是 Redis？
