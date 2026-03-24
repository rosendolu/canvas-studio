import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Canvas, CanvasDocument } from './canvas.schema'
import { CreateCanvasDto, UpdateCanvasDto } from './canvas.dto'
import { nanoid } from 'nanoid'

@Injectable()
export class CanvasService {
  constructor(
    @InjectModel(Canvas.name) private canvasModel: Model<CanvasDocument>
  ) {}

  async create(dto: CreateCanvasDto): Promise<CanvasDocument> {
    // Auto-create a default page for live mode
    const defaultPage = {
      uid: nanoid(),
      bgColor: dto.bgColor || '#000000',
      elements: [],
    }
    const doc = new this.canvasModel({
      ...dto,
      pages: dto.mode !== 'editor' ? [defaultPage] : [],
      track: dto.mode === 'editor' ? [] : [],
    })
    return doc.save()
  }

  async findAll(query: { mode?: string; projectId?: string; isPublic?: boolean }) {
    const filter: any = {}
    if (query.mode) filter.mode = query.mode
    if (query.projectId) filter.projectId = query.projectId
    if (query.isPublic !== undefined) filter.isPublic = query.isPublic
    return this.canvasModel.find(filter).select('-pages -track').sort({ createdAt: -1 }).lean()
  }

  async findOne(id: string): Promise<CanvasDocument> {
    const doc = await this.canvasModel.findById(id)
    if (!doc) throw new NotFoundException(`Canvas ${id} not found`)
    return doc
  }

  async update(id: string, dto: UpdateCanvasDto): Promise<CanvasDocument> {
    const doc = await this.canvasModel.findByIdAndUpdate(id, { $set: dto }, { new: true })
    if (!doc) throw new NotFoundException(`Canvas ${id} not found`)
    return doc
  }

  async remove(id: string): Promise<void> {
    const result = await this.canvasModel.findByIdAndDelete(id)
    if (!result) throw new NotFoundException(`Canvas ${id} not found`)
  }

  /** 保存整个 pages 状态（全量覆盖） */
  async savePages(id: string, pages: any[]): Promise<CanvasDocument> {
    return this.update(id, { pages })
  }

  /** 保存整个 track 状态（全量覆盖） */
  async saveTrack(id: string, track: any[]): Promise<CanvasDocument> {
    return this.update(id, { track })
  }

  /** 复制画布 */
  async duplicate(id: string): Promise<CanvasDocument> {
    const source = await this.findOne(id)
    const copy = new this.canvasModel({
      ...source.toObject(),
      _id: undefined,
      name: `${source.name} (副本)`,
      createdAt: undefined,
      updatedAt: undefined,
    })
    return copy.save()
  }
}
