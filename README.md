# Canvas Studio

> A powerful open-source canvas editor for building live streaming rooms and video editing experiences.

[![License: Commercial](https://img.shields.io/badge/License-Commercial-red.svg)](./LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/rosendolu/canvas-studio)](https://github.com/rosendolu/canvas-studio)

**[中文文档](./README.zh-CN.md)** | English

---

## 🌐 Live Demo

👉 **[https://draw.rosendo.fun](https://draw.rosendo.fun)**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖼️ Static Image Elements | Background, sticker, and product image rendering via `react-konva` |
| 🎭 Avatar with Mask | Digital human elements with circular clip mask, draggable & resizable |
| 💬 Bubble Text | Inline double-click editing with Konva Group + Text overlay |
| ✨ APNG Animation | Frame-by-frame APNG playback using `apng-js` + `Konva.Animation` |
| 🔄 Seamless Carousel | Canvas 2D + requestAnimationFrame infinite scroll (H/V configurable) |
| 🎴 Slideshow | Multi-image switching with easeInOut slide transition |
| 🔧 Transformer Controls | 8-anchor drag / scale / rotate with keepRatio |
| 📊 Timeline Ruler | Canvas 2D ruler with frame/second/minute unit auto-switching |
| 🌙 Theme Toggle | Mantine light/dark theme with custom brand color |
| 📤 Image Export | Export canvas as DataURL or Blob via Konva Stage |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| UI Component Library | Mantine 7 (light/dark theme support) |
| Canvas Rendering | Konva + react-konva |
| State Management | Zustand + Immer |
| Data Fetching | TanStack Query v5 |
| Backend Framework | NestJS 10 |
| Database | MongoDB + Mongoose |
| API Documentation | Swagger (`/api/docs`) |
| Package Manager | npm Workspaces (Monorepo) |

---

## 📁 Project Structure

```
canvas-studio/
├── apps/
│   ├── web/                        # React frontend
│   │   └── src/
│   │       ├── components/
│   │       │   ├── CanvasPlayer/   # Adaptive canvas container + Konva Stage
│   │       │   ├── CanvasElements/ # All element type components
│   │       │   ├── Timeline/       # Timeline ruler
│   │       │   ├── ElementMenu/    # Asset panel
│   │       │   └── Layout/         # AppLayout + theme toggle
│   │       ├── pages/
│   │       │   ├── home/           # Homepage
│   │       │   ├── editor/         # Video editor (timeline mode)
│   │       │   └── live/           # Live room (real-time editing)
│   │       └── store/
│   │           ├── editorStore.ts  # Video editor state
│   │           └── liveStore.ts    # Live room state
│   └── server/                     # NestJS backend
│       └── src/
│           ├── canvas/             # Canvas CRUD API
│           ├── project/            # Project CRUD API
│           └── app.module.ts
└── packages/
    └── canvas-core/                # Shared types + utilities
        └── src/
            ├── types.ts
            └── utils/
                ├── element.ts      # Position / scale / orientation utils
                ├── timeline.ts     # Timeline ruler drawing
                └── canvas.ts       # Konva image export
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

### Install

```bash
git clone https://github.com/rosendolu/canvas-studio.git
cd canvas-studio
npm install
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Frontend only — http://localhost:5173
npm run dev:web

# Backend only — http://localhost:3000
npm run dev:server
```

### Environment Variables

Create `apps/server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/canvas-studio
PORT=3000
```

### API Documentation

Once the server is running, visit: `http://localhost:3000/api/docs`

---

## 📡 REST API

### Canvas API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/canvas` | Create canvas |
| `GET` | `/api/canvas` | List canvases |
| `GET` | `/api/canvas/:id` | Get single canvas |
| `PATCH` | `/api/canvas/:id` | Update canvas info |
| `PUT` | `/api/canvas/:id/pages` | Save live room state |
| `PUT` | `/api/canvas/:id/track` | Save editor track state |
| `POST` | `/api/canvas/:id/duplicate` | Duplicate canvas |
| `DELETE` | `/api/canvas/:id` | Delete canvas |

### Project API

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/project` | Create project |
| `GET` | `/api/project` | List projects |
| `PATCH` | `/api/project/:id` | Update project |
| `DELETE` | `/api/project/:id` | Delete project |

---

## 📜 License

This software is licensed under a **Commercial License**.  
Free for personal and non-commercial use only.  
Commercial use requires a paid license. See [LICENSE](./LICENSE) for details.

---

## 🤝 Contact

For licensing inquiries or commercial use, please contact the repository owner via GitHub.
