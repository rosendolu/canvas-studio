# Canvas Studio

> 强大的开源 Canvas 编辑器，支持直播间搭建与视频编辑。

[![许可证: 商业](https://img.shields.io/badge/许可证-商业付费-red.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/rosendolu/canvas-studio)](https://github.com/rosendolu/canvas-studio)

**English** | [中文文档](./README.zh-CN.md)

---

## 🌐 在线体验

👉 **[https://impression-cylinder-avatar-lesson.trycloudflare.com](https://impression-cylinder-avatar-lesson.trycloudflare.com)**

---

## ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🖼️ 静态图片元素 | 背景图、贴图、商品图，基于 `react-konva` 渲染 |
| 🎭 数字人蒙版 | 圆形 clip 裁剪，蒙版可拖拽、缩放 |
| 💬 气泡文字 | 双击进入内联编辑，Konva Group + Text 实现 |
| ✨ APNG 动态贴图 | `apng-js` 解析帧，`Konva.Animation` 驱动流畅播放 |
| 🔄 无缝滚动轮播 | Canvas 2D + rAF，支持水平/垂直速度配置 |
| 🎴 幻灯片切换 | 多图轮播，带 easeInOut 滑入过渡动画 |
| 🔧 Transformer 变换 | 8方向拖拽/缩放/旋转，keepRatio 锁比例 |
| 📊 时间轴标尺 | Canvas 2D 绘制，支持帧/秒/分钟单位自动切换 |
| 🌙 主题切换 | Mantine light/dark 双主题，品牌色可配置 |
| 📤 导出图片 | Konva Stage 导出 DataURL 或 Blob |

---

## 🏗️ 技术栈

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
| 包管理 | npm Workspaces（Monorepo） |

---

## 📁 项目结构

```
canvas-studio/
├── apps/
│   ├── web/                        # React 前端
│   │   └── src/
│   │       ├── components/
│   │       │   ├── CanvasPlayer/   # 自适应 Canvas 容器 + Konva Stage
│   │       │   ├── CanvasElements/ # 所有元素类型组件
│   │       │   ├── Timeline/       # 时间轴标尺
│   │       │   ├── ElementMenu/    # 素材面板
│   │       │   └── Layout/         # AppLayout + 主题切换
│   │       ├── pages/
│   │       │   ├── home/           # 首页
│   │       │   ├── editor/         # 视频编辑器（时间轴模式）
│   │       │   └── live/           # 直播间（实时编辑模式）
│   │       └── store/
│   │           ├── editorStore.ts  # 视频编辑器状态
│   │           └── liveStore.ts    # 直播间状态
│   └── server/                     # NestJS 后端
│       └── src/
│           ├── canvas/             # Canvas CRUD API
│           ├── project/            # Project CRUD API
│           └── app.module.ts
└── packages/
    └── canvas-core/                # 共享类型 + 工具函数
        └── src/
            ├── types.ts
            └── utils/
                ├── element.ts      # 位置/缩放/横竖屏工具
                ├── timeline.ts     # 时间轴绘制
                └── canvas.ts       # Konva 导出图片
```

---

## 🚀 快速开始

### 前置条件

- Node.js >= 18
- MongoDB（本地或 Atlas）

### 安装

```bash
git clone https://github.com/rosendolu/canvas-studio.git
cd canvas-studio
npm install
```

### 启动开发服务

```bash
# 同时启动前后端
npm run dev

# 仅前端 — http://localhost:5173
npm run dev:web

# 仅后端 — http://localhost:3000
npm run dev:server
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

## 📡 REST API

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

## 📜 许可证

本软件采用**商业付费许可证**。  
仅允许个人非商业用途免费使用。  
商业使用需购买授权，详见 [LICENSE](./LICENSE)。

---

## 🤝 联系方式

商业授权或合作请通过 GitHub 联系仓库所有者。
