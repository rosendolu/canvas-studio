// ================================================================
// Canvas Studio - Core Types
// ================================================================

// ---------------- Element Types ----------------

export type ElementType =
  | 'background'           // 背景图/色块
  | 'background-video'     // 背景视频
  | 'avatar'               // 数字人
  | 'sticker'              // 贴图素材
  | 'bubbleText'           // 气泡文字
  | 'picture-scrolling'    // 图片滚动轮播（Carousel）
  | 'slideshow'            // 幻灯片切换
  | 'apng'                 // APNG 动态贴图
  | 'product'              // 商品图（直播间专用）
  | 'solid-color'          // 纯色背景

// ---------------- Element Mask (Avatar circle clip) ----------------

export interface ElementMask {
  type: 'circle' | ''
  left: number
  top: number
  width: number
  height: number
  scaleX: number
  scaleY: number
  background: string     // mask background color
  offsetX: number
  offsetY: number
}

// ---------------- Slideshow Config ----------------

export interface SlideshowConfig {
  time: number               // total loop duration (ms)
  transitionDuration: number // slide transition (ms)
}

export interface SlideshowImage {
  src: string
  originalWidth: number
  originalHeight: number
}

// ---------------- Base Canvas Element ----------------

export interface CanvasElement {
  uid: string
  type: ElementType
  src: string

  // position & size
  left: number
  top: number
  width: number
  height: number
  originalWidth: number
  originalHeight: number
  scaleX: number
  scaleY: number
  rotation: number
  offsetX: number
  offsetY: number

  // visibility
  visible: boolean

  // opacity (0–1, default 1)
  opacity?: number

  // locked: disables dragging/transform when true
  locked?: boolean

  // appearance
  bgColor?: string
  mask?: ElementMask

  // bubble text fields
  text?: string
  fontSize?: number
  fontFamily?: string
  color?: string

  // carousel/scroll fields
  horizontal?: number
  vertical?: number

  // slideshow
  imageList?: SlideshowImage[]
  config?: SlideshowConfig

  // timeline (video editor only)
  start?: number
  end?: number
  muted?: boolean
  volume?: number

  // product binding (live room only)
  speechItemUid?: string
  faqReplyItemUid?: string
}

// ---------------- Page State ----------------

export interface PageState {
  uid: string
  bgColor: string
  elements: CanvasElement[]
  activeElementsUid: string
  activeSpeechUid?: string
  activeToBind?: any
}

// ---------------- Canvas Studio State ----------------

export interface CanvasStudioState {
  // Canvas render size
  drawWidth: number
  drawHeight: number
  aspectRatio: string          // e.g. "16:9" | "9:16" | "1:1"

  // Video timeline (image-maker only)
  currentFrame: number
  fps: number
  trackScale: number           // zoom level 0..100
  track: TrackLine[]

  // Live room mode (nnk-live only)
  pages: PageState[]

  // Global selection
  chooseDataUid: string
  color: string                // canvas bg color (video mode)
}

// ---------------- Timeline Track ----------------

export interface TrackLine {
  uid: string
  type: string
  muted: boolean
  volume: number
  lineList: CanvasElement[]
}

// ---------------- Canvas Config (Timeline ruler) ----------------

export interface CanvasConfig {
  width: number
  height: number
  bgColor: string
  ratio: number
  textSize: number
  textScale: number
  lineWidth: number
  textBaseline: string
  textAlign: string
  longColor: string
  shortColor: string
  textColor: string
  subTextColor: string
  focusColor: string
  lineColor: string
}

export interface TimelineUserConfig {
  start: number
  step: number
  scale: number
  focusPosition?: {
    start: number
    end: number
    frameCount: number
  }
}

// ---------------- Export / Image ----------------

export interface ExportOptions {
  width: number
  height: number
  type?: 'dataURL' | 'blob'
  elements: CanvasElement[]
}

// ================================================================
// Template System & Asset Library Types
// ================================================================

/** Template type: whole-canvas scene or a group of elements (overlay) */
export type TemplateType = 'scene' | 'overlay'

/** Asset type: maps to canvas element insertion path */
export type AssetType = 'background' | 'sticker' | 'apng' | 'product' | 'bubbleText' | 'other'

// ---------------- Template ----------------

/** Payload stored inside a scene template */
export interface SceneTemplatePayload {
  aspectRatio: string
  bgColor: string
  elements: CanvasElement[]
}

/** Payload stored inside an overlay template */
export interface OverlayTemplatePayload {
  elements: CanvasElement[]
}

export type TemplatePayload = SceneTemplatePayload | OverlayTemplatePayload

export interface CanvasTemplate {
  /** MongoDB _id (string) or local id */
  id: string
  name: string
  description?: string
  tags: string[]
  type: TemplateType
  thumbnail?: string     // URL or data-URI preview
  payload: TemplatePayload
  createdAt: string      // ISO
  updatedAt: string      // ISO
}

export interface CreateTemplateDto {
  name: string
  description?: string
  tags?: string[]
  type: TemplateType
  thumbnail?: string
  payload: TemplatePayload
}

export interface UpdateTemplateDto {
  name?: string
  description?: string
  tags?: string[]
  thumbnail?: string
  payload?: TemplatePayload
}

// ---------------- Asset Library ----------------

export interface LibraryAsset {
  /** MongoDB _id (string) */
  id: string
  name: string
  assetType: AssetType
  mimeType: string
  size: number           // bytes
  url: string            // serve URL
  width?: number
  height?: number
  tags: string[]
  checksum?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAssetDto {
  name: string
  assetType: AssetType
  tags?: string[]
}

export interface UpdateAssetDto {
  name?: string
  assetType?: AssetType
  tags?: string[]
}

// ---------------- Brand Kit ----------------

export interface BrandColor {
  label: string
  value: string   // hex
}

export interface BrandTypography {
  fontFamily: string
  fontSize: number
  color: string
  lineHeight?: number
}

export interface BrandKit {
  id: string
  name: string
  palette: BrandColor[]
  typography: BrandTypography[]
  logoAssetId?: string   // reference to LibraryAsset.id
  createdAt: string
  updatedAt: string
}

export interface CreateBrandKitDto {
  name: string
  palette?: BrandColor[]
  typography?: BrandTypography[]
  logoAssetId?: string
}

export interface UpdateBrandKitDto {
  name?: string
  palette?: BrandColor[]
  typography?: BrandTypography[]
  logoAssetId?: string
}

// ---------------- ID Remapping Utility ----------------

/**
 * Remaps all element UIDs in a payload to fresh IDs.
 * Returns the new elements array and a mapping of old → new IDs.
 */
export interface RemapResult {
  elements: CanvasElement[]
  idMap: Record<string, string>
}

// ---------------- Element Mask (Avatar circle clip) ----------------

export interface ElementMask {
  type: 'circle' | ''
  left: number
  top: number
  width: number
  height: number
  scaleX: number
  scaleY: number
  background: string     // mask background color
  offsetX: number
  offsetY: number
}

// ---------------- Slideshow Config ----------------

export interface SlideshowConfig {
  time: number               // total loop duration (ms)
  transitionDuration: number // slide transition (ms)
}

export interface SlideshowImage {
  src: string
  originalWidth: number
  originalHeight: number
}

// ---------------- Base Canvas Element ----------------

export interface CanvasElement {
  uid: string
  type: ElementType
  src: string

  // position & size
  left: number
  top: number
  width: number
  height: number
  originalWidth: number
  originalHeight: number
  scaleX: number
  scaleY: number
  rotation: number
  offsetX: number
  offsetY: number

  // visibility
  visible: boolean

  // opacity (0–1, default 1)
  opacity?: number

  // locked: disables dragging/transform when true
  locked?: boolean

  // appearance
  bgColor?: string
  mask?: ElementMask

  // bubble text fields
  text?: string
  fontSize?: number
  fontFamily?: string
  color?: string

  // carousel/scroll fields
  horizontal?: number
  vertical?: number

  // slideshow
  imageList?: SlideshowImage[]
  config?: SlideshowConfig

  // timeline (video editor only)
  start?: number
  end?: number
  muted?: boolean
  volume?: number

  // product binding (live room only)
  speechItemUid?: string
  faqReplyItemUid?: string
}

// ---------------- Page State ----------------

export interface PageState {
  uid: string
  bgColor: string
  elements: CanvasElement[]
  activeElementsUid: string
  activeSpeechUid?: string
  activeToBind?: any
}

// ---------------- Canvas Studio State ----------------

export interface CanvasStudioState {
  // Canvas render size
  drawWidth: number
  drawHeight: number
  aspectRatio: string          // e.g. "16:9" | "9:16" | "1:1"

  // Video timeline (image-maker only)
  currentFrame: number
  fps: number
  trackScale: number           // zoom level 0..100
  track: TrackLine[]

  // Live room mode (nnk-live only)
  pages: PageState[]

  // Global selection
  chooseDataUid: string
  color: string                // canvas bg color (video mode)
}

// ---------------- Timeline Track ----------------

export interface TrackLine {
  uid: string
  type: string
  muted: boolean
  volume: number
  lineList: CanvasElement[]
}

// ---------------- Canvas Config (Timeline ruler) ----------------

export interface CanvasConfig {
  width: number
  height: number
  bgColor: string
  ratio: number
  textSize: number
  textScale: number
  lineWidth: number
  textBaseline: string
  textAlign: string
  longColor: string
  shortColor: string
  textColor: string
  subTextColor: string
  focusColor: string
  lineColor: string
}

export interface TimelineUserConfig {
  start: number
  step: number
  scale: number
  focusPosition?: {
    start: number
    end: number
    frameCount: number
  }
}

// ---------------- Export / Image ----------------

export interface ExportOptions {
  width: number
  height: number
  type?: 'dataURL' | 'blob'
  elements: CanvasElement[]
}
