import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true, collection: 'assets' })
export class Asset {
  @Prop({ required: true, trim: true }) name: string
  @Prop({ required: true }) assetType: string   // 'background' | 'sticker' | 'apng' | 'product' | 'bubbleText' | 'other'
  @Prop({ required: true }) mimeType: string
  @Prop({ required: true }) size: number        // bytes
  @Prop({ required: true }) storageKey: string  // path on disk (relative to upload dir)
  @Prop({ required: true }) url: string         // public serve URL
  @Prop({ default: 0 }) width: number
  @Prop({ default: 0 }) height: number
  @Prop({ type: [String], default: [] }) tags: string[]
  @Prop({ default: '' }) checksum: string
}

export type AssetDocument = Asset & Document
export const AssetSchema = SchemaFactory.createForClass(Asset)

AssetSchema.index({ name: 'text' })
AssetSchema.index({ assetType: 1 })
AssetSchema.index({ tags: 1 })
