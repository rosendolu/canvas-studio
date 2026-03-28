import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ShareExpiry = 'never' | '24h' | '7d'

@Schema({ timestamps: true, collection: 'shares' })
export class Share {
  /** Unique short ID used in the public URL */
  @Prop({ required: true, unique: true, index: true }) shareId: string
  /** Serialised canvas state (PageState JSON) */
  @Prop({ type: Object, required: true }) snapshot: Record<string, any>
  @Prop({ required: true }) aspectRatio: string
  @Prop({ default: '' }) bgColor: string
  @Prop({ enum: ['never', '24h', '7d'], default: 'never' }) expiry: ShareExpiry
  /** Unix timestamp (ms) when the share expires; null = never */
  @Prop({ default: null }) expiresAt: number | null
  @Prop({ default: false }) allowFork: boolean
  @Prop({ default: 0 }) viewCount: number
}

export type ShareDocument = Share & Document
export const ShareSchema = SchemaFactory.createForClass(Share)

// TTL index: Mongo auto-deletes when expiresAt is set
ShareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $type: 'number' } } })
