import mongoose, { Schema } from 'mongoose'

const TemplateSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['scene', 'overlay'], required: true },
    tags: { type: [String], default: [] },
    thumbnail: { type: String, default: '' },
    payload: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, collection: 'templates' }
)

TemplateSchema.index({ name: 'text' })
TemplateSchema.index({ type: 1 })
TemplateSchema.index({ tags: 1 })

export const TemplateModel = (mongoose.models.Template ?? mongoose.model('Template', TemplateSchema)) as mongoose.Model<any>
