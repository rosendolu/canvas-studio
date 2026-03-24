import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ProjectDocument = Project & Document

@Schema({ timestamps: true, collection: 'projects' })
export class Project {
  @Prop({ required: true }) name: string
  @Prop({ default: '' }) description: string
  @Prop({ default: '' }) thumbnail: string
  @Prop({ default: false }) isPublic: boolean
  // theme color – applies to all canvases in this project by default
  @Prop({ default: '#00c5a7' }) themeColor: string
}

export const ProjectMongoSchema = SchemaFactory.createForClass(Project)
