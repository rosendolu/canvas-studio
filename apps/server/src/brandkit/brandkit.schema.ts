import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ _id: false })
export class BrandColor {
  @Prop({ required: true }) label: string
  @Prop({ required: true }) value: string  // hex
}

@Schema({ _id: false })
export class BrandTypography {
  @Prop({ required: true }) fontFamily: string
  @Prop({ required: true }) fontSize: number
  @Prop({ required: true }) color: string
  @Prop({ default: 1.4 }) lineHeight: number
}

@Schema({ timestamps: true, collection: 'brandkits' })
export class BrandKit {
  @Prop({ required: true, trim: true }) name: string
  @Prop({ type: [BrandColor], default: [] }) palette: BrandColor[]
  @Prop({ type: [BrandTypography], default: [] }) typography: BrandTypography[]
  @Prop({ default: '' }) logoAssetId: string
}

export type BrandKitDocument = BrandKit & Document
export const BrandKitSchema = SchemaFactory.createForClass(BrandKit)
BrandKitSchema.index({ name: 'text' })
