// Default assets for each category
export const DEFAULT_BACKGROUNDS = [
  {
    label: 'Mountain Lake',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
    originalWidth: 1920, originalHeight: 1080,
  },
  {
    label: 'City Night',
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&h=1080&fit=crop',
    originalWidth: 1920, originalHeight: 1080,
  },
  {
    label: 'Abstract Purple',
    src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&h=1080&fit=crop',
    originalWidth: 1920, originalHeight: 1080,
  },
  {
    label: 'Ocean Sunset',
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop',
    originalWidth: 1920, originalHeight: 1080,
  },
]

export const DEFAULT_STICKERS = [
  {
    label: 'Forest',
    src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=400&fit=crop',
    originalWidth: 400, originalHeight: 400,
  },
  {
    label: 'Cat',
    src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop',
    originalWidth: 300, originalHeight: 300,
  },
  {
    label: 'Coffee',
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
    originalWidth: 300, originalHeight: 300,
  },
  {
    label: 'Flower',
    src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
    originalWidth: 300, originalHeight: 300,
  },
]

export const DEFAULT_MASKS = [
  {
    label: 'Portrait',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face',
    originalWidth: 400, originalHeight: 600,
  },
  {
    label: 'Profile',
    src: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop&crop=face',
    originalWidth: 400, originalHeight: 600,
  },
  {
    label: 'Landscape Crop',
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&h=400&fit=crop',
    originalWidth: 600, originalHeight: 400,
  },
]

export const DEFAULT_CAROUSEL_SETS = [
  {
    label: 'Nature Series',
    images: [
      { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop', originalWidth: 800, originalHeight: 450 },
      { src: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&h=450&fit=crop', originalWidth: 800, originalHeight: 450 },
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop', originalWidth: 800, originalHeight: 450 },
    ],
  },
  {
    label: 'Urban Series',
    images: [
      { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=450&fit=crop', originalWidth: 800, originalHeight: 450 },
      { src: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=800&h=450&fit=crop', originalWidth: 800, originalHeight: 450 },
      { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=450&fit=crop', originalWidth: 800, originalHeight: 450 },
    ],
  },
]

export const DEFAULT_BUBBLE_TEXTS = [
  { text: '🎉 精彩内容', color: 'auto', fontSize: 18 },
  { text: '💡 创意无限', color: '#ffd700', fontSize: 18 },
  { text: '🚀 立即开始', color: '#00e5ff', fontSize: 18 },
  { text: 'Hello 👋', color: 'auto', fontSize: 16 },
]

// ─── Templates ────────────────────────────────────────────────────────────────
// Each template defines a starting canvas: aspect ratio + a set of pre-positioned
// elements (width/height/left/top are relative to a 960×540 canvas and will be
// scaled by initElementPos when added to the real canvas).

export interface TemplateElement {
  type: string
  src: string
  originalWidth: number
  originalHeight: number
  left: number
  top: number
  width: number
  height: number
  scaleX: number
  scaleY: number
  rotation: number
  offsetX: number
  offsetY: number
  visible: boolean
  opacity: number
  text?: string
  color?: string
  fontSize?: number
}

export interface CanvasTemplate {
  id: string
  name: string
  nameZh: string
  thumbnail: string
  aspectRatio: string
  elements: TemplateElement[]
}

export const DEFAULT_TEMPLATES: CanvasTemplate[] = [
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    nameZh: 'YouTube 封面',
    thumbnail: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=320&h=180&fit=crop',
    aspectRatio: '16:9',
    elements: [
      {
        type: 'background',
        src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&h=1080&fit=crop',
        originalWidth: 1920, originalHeight: 1080,
        left: 0, top: 0, width: 0, height: 0,
        scaleX: 1, scaleY: 1, rotation: 0, offsetX: 0, offsetY: 0,
        visible: true, opacity: 1,
      },
      {
        type: 'sticker',
        src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop',
        originalWidth: 300, originalHeight: 300,
        left: 0, top: 0, width: 0, height: 0,
        scaleX: 1, scaleY: 1, rotation: -5, offsetX: 0, offsetY: 0,
        visible: true, opacity: 1,
      },
      {
        type: 'bubbleText',
        src: '',
        originalWidth: 0, originalHeight: 0,
        left: 0, top: 0, width: 280, height: 60,
        scaleX: 1, scaleY: 1, rotation: 0, offsetX: 0, offsetY: 0,
        visible: true, opacity: 1,
        text: '🚀 Watch This!', color: '#ffd700', fontSize: 28,
      },
    ],
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    nameZh: 'Instagram 故事',
    thumbnail: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=180&h=320&fit=crop',
    aspectRatio: '9:16',
    elements: [
      {
        type: 'background',
        src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1080&h=1920&fit=crop',
        originalWidth: 1080, originalHeight: 1920,
        left: 0, top: 0, width: 0, height: 0,
        scaleX: 1, scaleY: 1, rotation: 0, offsetX: 0, offsetY: 0,
        visible: true, opacity: 1,
      },
      {
        type: 'sticker',
        src: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&h=300&fit=crop',
        originalWidth: 300, originalHeight: 300,
        left: 0, top: 0, width: 0, height: 0,
        scaleX: 1, scaleY: 1, rotation: 12, offsetX: 0, offsetY: 0,
        visible: true, opacity: 0.9,
      },
      {
        type: 'bubbleText',
        src: '',
        originalWidth: 0, originalHeight: 0,
        left: 0, top: 0, width: 240, height: 56,
        scaleX: 1, scaleY: 1, rotation: 0, offsetX: 0, offsetY: 0,
        visible: true, opacity: 1,
        text: '✨ Today\'s Vibe', color: '#ffffff', fontSize: 24,
      },
    ],
  },
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    nameZh: '产品展示',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=320&h=320&fit=crop',
    aspectRatio: '1:1',
    elements: [
      {
        type: 'background',
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1080&fit=crop',
        originalWidth: 1080, originalHeight: 1080,
        left: 0, top: 0, width: 0, height: 0,
        scaleX: 1, scaleY: 1, rotation: 0, offsetX: 0, offsetY: 0,
        visible: true, opacity: 1,
      },
      {
        type: 'sticker',
        src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
        originalWidth: 300, originalHeight: 300,
        left: 0, top: 0, width: 0, height: 0,
        scaleX: 1, scaleY: 1, rotation: 0, offsetX: 0, offsetY: 0,
        visible: true, opacity: 1,
      },
      {
        type: 'bubbleText',
        src: '',
        originalWidth: 0, originalHeight: 0,
        left: 0, top: 0, width: 220, height: 52,
        scaleX: 1, scaleY: 1, rotation: 0, offsetX: 0, offsetY: 0,
        visible: true, opacity: 1,
        text: '☕ New Arrival', color: '#00e5ff', fontSize: 22,
      },
    ],
  },
  {
    id: 'minimal-quote',
    name: 'Minimal Quote',
    nameZh: '极简引言',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=320&h=180&fit=crop',
    aspectRatio: '16:9',
    elements: [
      {
        type: 'background',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop',
        originalWidth: 1920, originalHeight: 1080,
        left: 0, top: 0, width: 0, height: 0,
        scaleX: 1, scaleY: 1, rotation: 0, offsetX: 0, offsetY: 0,
        visible: true, opacity: 0.8,
      },
      {
        type: 'bubbleText',
        src: '',
        originalWidth: 0, originalHeight: 0,
        left: 0, top: 0, width: 320, height: 80,
        scaleX: 1, scaleY: 1, rotation: 0, offsetX: 0, offsetY: 0,
        visible: true, opacity: 1,
        text: '💡 创意源于生活', color: '#ffffff', fontSize: 32,
      },
    ],
  },
]
