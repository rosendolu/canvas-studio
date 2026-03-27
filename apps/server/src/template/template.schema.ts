import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

// ── Template Payload (stored as raw JSON) ─────────────────────────
@Schema({ _id: false })
export class TemplatePayloadSchema {
  @Prop({ type: Object, required: true }) data: Record<string, any>
}

// ── Template Document ─────────────────────────────────────────────
@Schema({ timestamps: true, collection: 'templates' })
export class Template {
  @Prop({ required: true, trim: true }) name: string
  @Prop({ default: '' }) description: string
  @Prop({ required: true, enum: ['scene', 'overlay'] }) type: string
  @Prop({ type: [String], default: [] }) tags: string[]
  @Prop({ default: '' }) thumbnail: string
  /** Serialized TemplatePayload (SceneTemplatePayload | OverlayTemplatePayload) */
  @Prop({ type: Object, required: true }) payload: Record<string, any>
}

export type TemplateDocument = Template & Document
export const TemplateSchema = SchemaFactory.createForClass(Template)

// text index for name search
TemplateSchema.index({ name: 'text' })
TemplateSchema.index({ type: 1 })
TemplateSchema.index({ tags: 1 })
