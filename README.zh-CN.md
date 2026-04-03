# Canvas Studio

> 强大的开源 Canvas 编辑器，支持直播间搭建与视频编辑。

[![许可证: 商业](https://img.shields.io/badge/许可证-商业付费-red.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/rosendolu/canvas-studio)](https://github.com/rosendolu/canvas-studio)

**English** | [中文文档](./README.zh-CN.md)

---

## 🌐 在线体验

👉 **[https://draw.rosendo.fun](https://draw.rosendo.fun)**

---

## ✨ 功能特性

| 功能                | 说明                                             |
| ------------------- | ------------------------------------------------ |
| 🖼️ 静态图片元素     | 背景图、贴图、商品图，基于 `react-konva` 渲染    |
| 🎭 数字人蒙版       | 圆形 clip 裁剪，蒙版可拖拽、缩放                 |
| 💬 气泡文字         | 双击进入内联编辑，Konva Group + Text 实现        |
| ✨ APNG 动态贴图    | `apng-js` 解析帧，`Konva.Animation` 驱动流畅播放 |
| 🔄 无缝滚动轮播     | Canvas 2D + rAF，支持水平/垂直速度配置           |
| 🎴 幻灯片切换       | 多图轮播，带 easeInOut 滑入过渡动画              |
| 🔧 Transformer 变换 | 8方向拖拽/缩放/旋转，keepRatio 锁比例            |
| 📊 时间轴标尺       | Canvas 2D 绘制，支持帧/秒/分钟单位自动切换       |
| 🌙 主题切换         | Mantine light/dark 双主题，品牌色可配置          |
| 📤 导出图片         | Konva Stage 导出 DataURL 或 Blob                 |
| 🌍 国际化           | 支持中文/英文一键切换                            |

---

## 🏗️ 技术栈

| 层          | 技术                                  |
| ----------- | ------------------------------------- |
| 前端框架    | Next.js 16 (App Router) + React 19  |
| UI 组件库   | Mantine 9（支持 light/dark 主题切换）|
| Canvas 渲染 | Konva + react-konva 19               |
| 状态管理    | Zustand + Immer                       |
| 数据请求    | TanStack Query v5                     |
| API 层      | Next.js Route Handlers                |
| 数据库      | MongoDB + Mongoose                    |
| 包管理      | pnpm Workspaces（Monorepo）           |

---

## 📁 项目结构

```
canvas-studio/
├── apps/
│   └── web/                        # Next.js 16 前端
│       └── src/
│           ├── app/               # Next.js App Router 页面
│           │   ├── (main)/        # 路由组: editor, image-editor, live
│           │   ├── preview/       # SSR 预览页面
│           │   └── api/           # Next.js Route Handlers (Canvas, Project, etc.)
│           ├── components/         # CanvasPlayer, CanvasElements, Layout 等
│           ├── lib/               # MongoDB 模型、数据库连接、工具函数
│           ├── hooks/             # TanStack Query 数据请求 hooks
│           ├── store/             # Zustand 状态管理 (editor, live)
│           └── i18n/              # i18next 国际化 (en, zh)
└── packages/
    └── canvas-core/               # 共享类型 + 工具函数
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
- pnpm

### 安装

```bash
git clone https://github.com/rosendolu/canvas-studio.git
cd canvas-studio
pnpm install
```

### 启动开发服务

```bash
pnpm run dev
```

访问 http://localhost:3000

### 环境变量

在 `apps/web/.env.local` 中配置：

```env
MONGODB_URI=mongodb://localhost:27017/canvas-studio
```

---

## 📡 REST API

### Canvas API

| 方法      | 路径                        | 说明               |
| -------- | --------------------------- | ------------------ |
| `POST`   | `/api/canvas`               | 创建画布           |
| `GET`    | `/api/canvas`               | 获取列表           |
| `GET`    | `/api/canvas/:id`           | 获取单个           |
| `PATCH`  | `/api/canvas/:id`           | 更新基本信息       |
| `PUT`    | `/api/canvas/:id/pages`     | 保存直播间完整状态 |
| `PUT`    | `/api/canvas/:id/track`     | 保存编辑器完整轨道 |
| `POST`   | `/api/canvas/:id/duplicate` | 复制画布           |
| `DELETE` | `/api/canvas/:id`           | 删除               |

### Project API

| 方法      | 路径               | 说明     |
| -------- | ------------------ | -------- |
| `POST`   | `/api/project`     | 创建项目 |
| `GET`    | `/api/project`     | 获取列表 |
| `PATCH`  | `/api/project/:id` | 更新     |
| `DELETE` | `/api/project/:id` | 删除     |

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📜 许可证

本软件采用**商业付费许可证**。  
仅允许个人非商业用途免费使用。  
商业使用需购买授权，详见 [LICENSE](./LICENSE)。

---

## 🤝 联系方式

商业授权或合作请通过 GitHub 联系仓库所有者。
