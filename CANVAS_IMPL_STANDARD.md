# Canvas Studio — 画布实现标准 (nnk-24h-live 参考)

> 基于 `nnk-24h-live` 项目逐文件对比，列出现有 canvas-studio 的偏差，以及修复标准。

---

## 1. Transformer 选中框

### 标准（nnk-24h-live）
```tsx
// useEffect deps: [activeUid, state]  ← 包含 state
useEffect(() => {
  const shape = transformRectRef.current
  shape.position(position)
  shape.width(w)
  shape.height(h)
  shape.scale(scale)
  shape.show()
  tNode?.nodes([active, shape])   // ← active + transformRectRef 两个节点
}, [activeUid, state])

// Transformer: rotateEnabled={false}  ← 不开启旋转
// transformRectRef: draggable={true}  ← 有 draggable
```

### canvas-studio 现状（偏差）
- `useEffect` deps 只有 `[activeUid]` ← **偏差**
- `tNode.nodes([active])` 只挂一个节点，没挂 transformRectRef ← **偏差**
- `rotateEnabled={true}` ← **偏差**（参考项目是 false）
- `transformRectRef` 上没有 `draggable` ← **偏差**

### 修复标准
1. `useEffect` deps 改回 `[activeUid, elements]`（等同于 state 变化）
2. `tNode.nodes([active, shape])` 同时挂两个节点
3. `rotateEnabled={false}`（恢复参考项目默认）
4. `transformRectRef` 加 `draggable`

---

## 2. syncPosToState

### 标准（nnk-24h-live）
```ts
// group shapeType 且非 bubbleText → 存 offsetX/offsetY（不是 left/top）
if (shapeType == 'group') {
    if (String(target?.attrs?.name).endsWith('bubbleText')) {
        obj.left = left
        obj.top = top
    } else {
        obj.offsetX = left || 0   // ← 存 offsetX
        obj.offsetY = top || 0    // ← 存 offsetY
    }
}
// rotation 无条件写（不判断 mask）
obj.rotation = rotation < 0 ? 360 + rotation : rotation
```

### canvas-studio 现状（偏差）
```ts
// group → 存的是 updates.left / updates.top ← 偏差
} else if (shapeType === 'group') {
  updates.left = left
  updates.top = top
}
// mask 分支里 rotation 被跳过 ← 偏差
if (!('mask' in updates)) {
  updates.rotation = ...
}
```

### 修复标准
1. group（非 bubbleText）→ 存 `offsetX = left, offsetY = top`
2. rotation 无条件写（mask 分支也要写）

---

## 3. StaticImage

### 标准（nnk-24h-live）
```tsx
// 无 offsetX/offsetY — 直接用 item.left / item.top
x={isBubbleText ? 0 : item.left}
y={isBubbleText ? 0 : item.top}
// 无 anonymous crossOrigin
const [image] = useImage(sourceURL)  // 无 'anonymous'
```

### canvas-studio 现状（偏差）
- 无偏差（x/y 已经是 item.left/top，无 offsetX/offsetY）✅
- `useImage(sourceURL, 'anonymous')` 加了 anonymous ← 可选，不影响功能

### 修复标准
- 无需改动 ✅

---

## 4. initElementPos（element.ts）

### 标准（nnk-24h-live）
```ts
// sticker: 限制初始宽度不超过 150（绝对像素）
el.width = Math.min(el.width, 150)

// bubbleText: 同 150 限制
el.width = Math.min(el.width, 150)

// 无 offsetX/offsetY 初始化（注释掉了）
// el.left += el.width / 2  ← 注释
```

### canvas-studio 现状（偏差）
```ts
// sticker: Math.min(el.originalWidth * containScale, canvasWidth * 0.4)
// ← 用的是 canvasWidth * 0.4 比例，不是固定 150px

// avatar: el.originalWidth * containScale * 0.5
// ← 参考项目里 avatar 走的是默认 contain 分支（无特殊处理）
```

### 修复标准
1. sticker 宽度上限改为 `150`（与参考保持一致）
2. bubbleText 宽度上限同为 `150`，最小高度 `50`
3. avatar 走默认 contain 分支（去掉 `* 0.5`）
4. 保持 `offsetX = 0, offsetY = 0`（不初始化 offset）

---

## 5. RenderElement（元素渲染分支）

### 标准（nnk-24h-live）
```ts
// avatar 走 CanvasImage（=StaticImage），不是独立 AvatarElement
if (/background|avatar|sticker|product|picture|slideshow/.test(item.type)) {
    return <CanvasImage item={item} draggable={draggable} />
}
```

### canvas-studio 现状（偏差）
```ts
if (item.type === 'avatar') return <AvatarElement item={item} />
// ← AvatarElement 有复杂的 mask/clip 实现，参考项目里 avatar 就是普通 StaticImage
```

### 修复标准
- **保留** `AvatarElement`（已实现 mask clip 功能，是 canvas-studio 的扩展）
- 这是**有意扩展**，不需要回退

---

## 6. BubbleText

### 标准（nnk-24h-live）
```tsx
// Group 用 item.left / item.top（非 offsetX/offsetY）
x={item.left}
y={item.top}
// syncPosToState 中 group 存 left/top（因为 name 以 bubbleText 结尾）
```

### canvas-studio 现状
- BubbleText Group 里使用 `x={item.left} y={item.top}` ← ✅
- syncPosToState group bubbleText 分支存 left/top ← ✅

### 修复标准
- 无需改动 ✅

---

## 7. transformRectRef 的 useEffect 同步

### 标准（nnk-24h-live）
```ts
if (active) {
    const shape = transformRectRef.current
    if (w) {
        shape.position(position)   // ← position() 读的是带 offset 的绝对坐标
        shape.width(w)
        shape.height(h)
        shape.scale(scale)
        shape.show()
        tNode?.nodes([active, shape])
    }
}
```

### canvas-studio 现状（偏差）
```ts
// 当前直接 tNode.nodes([active]) 不挂 shape
tNode?.nodes([active])
```

### 修复标准
- `shape.position(position)` 设置为 `active.position()`
- `shape.width/height/scale` 同步
- `shape.show()`
- `tNode.nodes([active, shape])`

---

## 汇总：需要修复的文件和改动

| 文件 | 改动 | 优先级 |
|------|------|--------|
| `Player.tsx` | useEffect deps 加回 elements；nodes 挂 [active, shape]；transformRectRef 加 draggable；rotateEnabled=false | P0 |
| `Player.tsx syncPosToState` | group 非 bubbleText 存 offsetX/offsetY；rotation 无条件写 | P0 |
| `element.ts initElementPos` | sticker/bubbleText 改为 150px 上限；avatar 去掉 0.5 | P1 |
| `StaticImage.tsx` | 无需改动 | — |
| `BubbleText.tsx` | 无需改动 | — |
| `AvatarElement.tsx` | 保留（有意扩展） | — |

---

## 附：元素坐标体系说明

```
item.left / item.top   = 元素左上角在画布中的坐标（所有元素统一语义）
item.offsetX / offsetY = Konva 原点偏移（仅 avatar 的 group drag 时更新）
item.scaleX / scaleY   = 缩放倍数（Transformer 操作后更新）
item.rotation          = 旋转角度 0~360（负数转正）

mask.left / mask.top   = mask circle 的圆心坐标（相对 Group 内坐标系）
mask.scaleX / scaleY   = mask circle 的缩放
mask.width / height    = mask circle 直径（radius*2）
```
