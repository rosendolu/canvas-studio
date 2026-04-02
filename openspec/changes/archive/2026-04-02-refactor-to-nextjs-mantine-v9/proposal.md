## Why

Canvas Studio 当前运行在 React 18 + Vite 5 + Mantine 7 的技术栈上，后端为独立 NestJS 服务。这套架构存在三个核心问题：(1) 纯 SPA 架构导致 SEO 差、首次加载慢，无法服务端渲染；(2) Mantine 7 已经停止维护，生态升级受阻；(3) 双服务架构（Vite + NestJS）增加了部署复杂度和基础设施成本。现在是迁移到 Next.js 16 + Mantine 9 的最佳时机——Next.js App Router 提供原生 SSR/SSG，Mantine 9 基于 React 19 带来性能和组件能力提升，而 Next.js Route Handlers 可以完全替代 NestJS 作为后端 API 层。

## What Changes

- **框架升级**：React 18 → React 19，Vite → Next.js 16（Turbopack 构建）
- **UI 库升级**：Mantine 7 → Mantine 9（breaking changes 需要全面适配）
- **后端迁移**：NestJS → Next.js Route Handlers（`app/api/` 目录），废弃 `apps/server`
- **Monorepo 重组**：`apps/web` → `apps/next-app`（或重命名），`apps/server` 废弃
- **路由架构**：React Router v6 → Next.js App Router（文件系统路由）
- **构建工具**：Vite + PostCSS → Next.js 内置 Turbopack + Tailwind-free（Mantine 自带样式方案）

## Capabilities

### New Capabilities

- `nextjs-app-router`: 全新 Next.js 16 App Router 架构，文件路由系统，Server/Client 组件分离
- `nextjs-api-routes`: Next.js Route Handlers 替代 NestJS，提供 Canvas/Project/Template/Asset/BrandKit/Share API 端点
- `mantine-v9-migration`: Mantine 7 → 9 完整迁移，包括 breaking changes 适配、样式系统迁移、组件 API 更新
- `shared-database-layer`: 提取 MongoDB 连接层为独立模块，供 Route Handlers 复用

### Modified Capabilities

- `canvas-editor-core`: Canvas 编辑器核心能力——实现方式从 Zustand SPA store 迁移到 Next.js 环境下的状态管理（保持 Zustand，但需适配 SSR）
- `canvas-renderer`: Konva Canvas 渲染引擎——组件架构调整以适应 Next.js Client Components 边界
- `canvas-export`: 图片/视频导出——API 层变更，从 NestJS service 迁移到 Route Handler
- `i18n-system`: 国际化系统——react-i18next 在 SSR 环境下的加载方式变更
- `api-integration`: TanStack Query 与 SSR hydration 集成

## Impact

**前端架构**：
- `apps/web/` 整体迁移为 Next.js 16 App Router
- 所有 Canvas 组件标记 `"use client"`，Konva Stage 无法在 Server Component 运行
- Zustand store 需包装为 CSR-only（避免 SSR 状态污染）
- React Router `useNavigate` → `useRouter`，`Link` → `next/link`

**后端架构**：
- `apps/server/`（NestJS）完全废弃，端点迁移至 `apps/web/app/api/`
- MongoDB 连接层保留（作为 Next.js 可复用的数据库模块）
- Swagger 文档可选保留（Next.js Route Handlers 配合 Zod + 手动文档）

**依赖变更**：
- 新增：`next@16`、`react@19`、`react-dom@19`、`@mantine/core@9`、`@mantine/hooks@9`
- 移除：`vite`、`@vitejs/plugin-react`、`react-router-dom`、`@nestjs/*`
- 保留：`konva`、`react-konva`、`zustand`、`@tanstack/react-query`

**Monorepo 结构**：
- `package.json` workspaces 调整，`apps/server` 移除
- TypeScript 项目引用路径更新（`@canvas-studio/canvas-core` 保持不变）

**Breaking Changes**：
- Mantine v8→v9：CSS 变量前缀变化（`--mantine-*`），部分组件 API 变更
- Mantine v7→v9：颜色 scheme API 变化，Notification 组件变化，Modal 变化
- Next.js：服务端数据获取方式变化（getServerSideProps → Server Components）
