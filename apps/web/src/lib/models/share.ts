import mongoose, { Schema } from 'mongoose'

const ShareSchema = new Schema(
  {
    shareId: { type: String, required: true, unique: true },
    snapshot: { type: Schema.Types.Mixed, required: true },
    aspectRatio: { type: String, required: true },
    bgColor: { type: String, default: '' },
    expiry: { type: String, enum: ['never', '24h', '7d'], default: 'never' },
    expiresAt: { type: Number, default: null },
    allowFork: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true, collection: 'shares' }
)

ShareSchema.index({ shareId: 1 }, { unique: true })
ShareSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $type: 'number' } } }
)

export const ShareModel = (mongoose.models.Share ?? mongoose.model('Share', ShareSchema)) as mongoose.Model<any>
