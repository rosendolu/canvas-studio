# Canvas Studio

> 开源 Canvas 编辑器 — React + Vite + Mantine + NestJS + MongoDB

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 功能列表

来源于 [image-maker](https://github.com/rosendolu/image-maker) 和 [nnk-24h-live](https://github.com/rosendolu/nnk-24h-live) 两个项目中所有 Canvas 功能的统一实现：

| 功能 | 说明 |
|------|------|
| 🖼️ 静态图片元素 | 背景图、贴图、商品图，基于 `react-konva Image` |
| 🎭 数字人（Avatar） | 支持圆形蒙版裁剪（`clipFunc`），蒙版可拖拽缩放 |
| 💬 气泡文字 | Konva Group + Text，双击进入内联 textarea 编辑 |
| ✨ APNG 动态贴图 | `apng-js` 解析帧，`Konva.Animation` 驱动刷新 |
| 🔄 无缝滚动轮播 | Canvas 2D + rAF，支持水平/垂直速度配置 |
| 🎴 幻灯片切换 | Canvas 2D 多图轮播，带 easeInOut 滑入过渡 |
| 🔧 Transformer 变换 | 拖拽、缩放、旋转，8 方向 anchor |
| ⌨️ 键盘微调 | 方向键每次移动 1px |
| 📐 横竖屏切换 | 自动重算元素位置和比例 |
| 📏 Canvas 自适应缩放 | ResizeObserver 驱动等比缩放 |
| 📊 时间轴标尺 | Canvas 2D 绘制刻度线、帧/秒/分钟单位自动切换 |
| 🎯 时间轴区间高亮 | 选中元素在标尺对应位置高亮 |
| 📤 导出图片 | Konva Stage → DataURL / Blob |
| 🌙 主题切换 | Mantine light/dark 主题，主题色可配置 |

---

## Tech Stack

| 层 | 技术 |
|----|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite 5 |
| UI 组件库 | Mantine 7（支持 light/dark 主题切换） |
| Canvas 渲染 | Konva + react-konva |
| 状态管理 | Zustand + Immer |
| 数据请求 | TanStack Query v5 |
| 后端框架 | NestJS 10 |
| 数据库 | MongoDB + Mongoose |
| API 文档 | Swagger（`/api/docs`） |
| Monorepo | npm workspaces |

---

## 项目结构

```
canvas-studio/
├── apps/
│   ├── web/                  # React 前端
│   │   └── src/
│   │       ├── components/
│   │       │   ├── CanvasPlayer/     # 自适应 Canvas 容器 + Konva Stage
│   │       │   ├── CanvasElements/   # 所有元素类型组件
│   │       │   ├── Timeline/         # 时间轴标尺
│   │       │   ├── ElementMenu/      # 素材面板
│   │       │   └── Layout/           # AppLayout + 主题切换
│   │       ├── pages/
│   │       │   ├── home/             # 首页
│   │       │   ├── editor/           # 视频编辑器（时间轴模式）
│   │       │   └── live/             # 直播间（实时编辑模式）
│   │       └── store/
│   │           ├── editorStore.ts    # 视频编辑器状态
│   │           └── liveStore.ts      # 直播间状态
│   └── server/               # NestJS 后端
│       └── src/
│           ├── canvas/       # Canvas CRUD API
│           ├── project/      # Project CRUD API
│           └── app.module.ts
└── packages/
    └── canvas-core/          # 共享类型 + 工具函数
        └── src/
            ├── types.ts
            └── utils/
                ├── element.ts    # 位置/缩放/自适应
                ├── timeline.ts   # 时间轴绘制
                └── canvas.ts     # Konva 导出图片
```

---

## 快速开始

### 前置条件

- Node.js >= 18
- MongoDB（本地或 Atlas）

### 安装依赖

```bash
npm install
```

### 启动开发服务

```bash
# 同时启动前端和后端
npm run dev

# 仅启动前端
npm run dev:web        # http://localhost:5173

# 仅启动后端
npm run dev:server     # http://localhost:3000
```

### 环境变量

在 `apps/server/.env` 中配置：

```env
MONGODB_URI=mongodb://localhost:27017/canvas-studio
PORT=3000
```

### API 文档

启动后端后访问：`http://localhost:3000/api/docs`

---

## API 接口

### Canvas API

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/canvas` | 创建画布 |
| `GET` | `/api/canvas` | 获取列表 |
| `GET` | `/api/canvas/:id` | 获取单个 |
| `PATCH` | `/api/canvas/:id` | 更新基本信息 |
| `PUT` | `/api/canvas/:id/pages` | 保存直播间完整状态 |
| `PUT` | `/api/canvas/:id/track` | 保存编辑器完整轨道 |
| `POST` | `/api/canvas/:id/duplicate` | 复制画布 |
| `DELETE` | `/api/canvas/:id` | 删除 |

### Project API

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/project` | 创建项目 |
| `GET` | `/api/project` | 获取列表 |
| `PATCH` | `/api/project/:id` | 更新 |
| `DELETE` | `/api/project/:id` | 删除 |

---

## License

MIT
