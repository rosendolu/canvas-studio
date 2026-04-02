import mongoose, { Schema } from 'mongoose'

const BrandColorSchema = new Schema(
  { label: { type: String, required: true }, value: { type: String, required: true } },
  { _id: false }
)
const BrandTypographySchema = new Schema(
  {
    fontFamily: { type: String, required: true },
    fontSize: { type: Number, required: true },
    color: { type: String, required: true },
    lineHeight: { type: Number, default: 1.4 },
  },
  { _id: false }
)

const BrandKitSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    palette: { type: [BrandColorSchema], default: [] },
    typography: { type: [BrandTypographySchema], default: [] },
    logoAssetId: { type: String, default: '' },
  },
  { timestamps: true, collection: 'brandkits' }
)

BrandKitSchema.index({ name: 'text' })

export const BrandKitModel = (mongoose.models.BrandKit ?? mongoose.model('BrandKit', BrandKitSchema)) as mongoose.Model<any>
