import mongoose, { Schema } from 'mongoose'

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    isPublic: { type: Boolean, default: false },
    themeColor: { type: String, default: '#00c5a7' },
  },
  { timestamps: true, collection: 'projects' }
)

export const ProjectModel = (mongoose.models.Project ?? mongoose.model('Project', ProjectSchema)) as mongoose.Model<any>
