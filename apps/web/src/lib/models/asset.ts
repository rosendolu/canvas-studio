import mongoose, { Schema } from 'mongoose'

const AssetSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    assetType: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    storageKey: { type: String, required: true },
    url: { type: String, required: true },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    checksum: { type: String, default: '' },
  },
  { timestamps: true, collection: 'assets' }
)

AssetSchema.index({ name: 'text' })
AssetSchema.index({ assetType: 1 })
AssetSchema.index({ tags: 1 })

export const AssetModel = (mongoose.models.Asset ?? mongoose.model('Asset', AssetSchema)) as mongoose.Model<any>
