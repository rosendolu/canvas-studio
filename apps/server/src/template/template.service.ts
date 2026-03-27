import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Template, TemplateDocument } from './template.schema'
import { CreateTemplateDto, UpdateTemplateDto, ListTemplatesDto } from './template.dto'

@Injectable()
export class TemplateService {
  constructor(
    @InjectModel(Template.name) private templateModel: Model<TemplateDocument>,
  ) {}

  async list(query: ListTemplatesDto): Promise<TemplateDocument[]> {
    const filter: Record<string, any> = {}
    if (query.type) filter.type = query.type
    if (query.tags) {
      const tagsArr = Array.isArray(query.tags) ? query.tags : (query.tags as string).split(',').map(t => t.trim()).filter(Boolean)
      if (tagsArr.length) filter.tags = { $in: tagsArr }
    }
    if (query.q) filter.$text = { $search: query.q }
    return this.templateModel.find(filter).sort({ createdAt: -1 }).lean().exec() as any
  }

  async findById(id: string): Promise<TemplateDocument> {
    const doc = await this.templateModel.findById(id).lean().exec()
    if (!doc) throw new NotFoundException(`Template ${id} not found`)
    return doc as any
  }

  async create(dto: CreateTemplateDto): Promise<TemplateDocument> {
    const created = await this.templateModel.create(dto)
    return created.toObject() as any
  }

  async update(id: string, dto: UpdateTemplateDto): Promise<TemplateDocument> {
    const doc = await this.templateModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true, lean: true })
      .exec()
    if (!doc) throw new NotFoundException(`Template ${id} not found`)
    return doc as any
  }

  async duplicate(id: string): Promise<TemplateDocument> {
    const source = await this.findById(id)
    const { _id, createdAt, updatedAt, ...rest } = source as any
    const copy = await this.templateModel.create({ ...rest, name: `${rest.name} (copy)` })
    return copy.toObject() as any
  }

  async delete(id: string): Promise<void> {
    const result = await this.templateModel.findByIdAndDelete(id).exec()
    if (!result) throw new NotFoundException(`Template ${id} not found`)
  }
}
