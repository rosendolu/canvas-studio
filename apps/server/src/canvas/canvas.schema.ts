import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

// ── Element Mask ──────────────────────────────────────────────────
export class ElementMask {
  @Prop({ default: '' }) type: string
  @Prop({ default: 0 }) left: number
  @Prop({ default: 0 }) top: number
  @Prop({ default: 0 }) width: number
  @Prop({ default: 0 }) height: number
  @Prop({ default: 1 }) scaleX: number
  @Prop({ default: 1 }) scaleY: number
  @Prop({ default: '' }) background: string
  @Prop({ default: 0 }) offsetX: number
  @Prop({ default: 0 }) offsetY: number
}

// ── Canvas Element ─────────────────────────────────────────────────
export class CanvasElementSchema {
  @Prop({ required: true }) uid: string
  @Prop({ required: true }) type: string
  @Prop({ default: '' }) src: string

  @Prop({ default: 0 }) left: number
  @Prop({ default: 0 }) top: number
  @Prop({ default: 0 }) width: number
  @Prop({ default: 0 }) height: number
  @Prop({ default: 0 }) originalWidth: number
  @Prop({ default: 0 }) originalHeight: number
  @Prop({ default: 1 }) scaleX: number
  @Prop({ default: 1 }) scaleY: number
  @Prop({ default: 0 }) rotation: number
  @Prop({ default: 0 }) offsetX: number
  @Prop({ default: 0 }) offsetY: number
  @Prop({ default: true }) visible: boolean

  // text
  @Prop() text?: string
  @Prop() fontSize?: number
  @Prop() fontFamily?: string
  @Prop() color?: string

  // carousel / slideshow
  @Prop({ type: Object }) imageList?: any[]
  @Prop({ type: Object }) config?: any

  // scroll
  @Prop() horizontal?: number
  @Prop() vertical?: number

  // mask
  @Prop({ type: Object }) mask?: ElementMask

  // timeline
  @Prop() start?: number
  @Prop() end?: number
}

// ── Page State ─────────────────────────────────────────────────────
export class PageStateSchema {
  @Prop({ required: true }) uid: string
  @Prop({ default: '#000000' }) bgColor: string
  @Prop({ type: [Object], default: [] }) elements: CanvasElementSchema[]
}

// ── Canvas Document ────────────────────────────────────────────────
export type CanvasDocument = Canvas & Document

@Schema({ timestamps: true, collection: 'canvases' })
export class Canvas {
  @Prop({ required: true }) name: string
  @Prop({ default: 'live' }) mode: 'live' | 'editor'  // live room vs video editor
  @Prop({ default: '9:16' }) aspectRatio: string
  @Prop({ default: '#000000' }) bgColor: string

  // Live mode: pages
  @Prop({ type: [Object], default: [] }) pages: PageStateSchema[]

  // Editor mode: track
  @Prop({ type: [Object], default: [] }) track: any[]

  @Prop() projectId?: string
  @Prop({ default: false }) isPublic: boolean
  @Prop() thumbnail?: string

  // theme color override (per canvas)
  @Prop({ default: '' }) themeColor: string
}

export const CanvasMongoSchema = SchemaFactory.createForClass(Canvas)
