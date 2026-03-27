import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BrandKit, BrandKitDocument } from './brandkit.schema'
import { CreateBrandKitDto, UpdateBrandKitDto } from './brandkit.dto'

@Injectable()
export class BrandKitService {
  constructor(
    @InjectModel(BrandKit.name) private brandKitModel: Model<BrandKitDocument>,
  ) {}

  async list(): Promise<BrandKitDocument[]> {
    return this.brandKitModel.find().sort({ createdAt: -1 }).lean().exec() as any
  }

  async findById(id: string): Promise<BrandKitDocument> {
    const doc = await this.brandKitModel.findById(id).lean().exec()
    if (!doc) throw new NotFoundException(`BrandKit ${id} not found`)
    return doc as any
  }

  async create(dto: CreateBrandKitDto): Promise<BrandKitDocument> {
    const created = await this.brandKitModel.create(dto)
    return created.toObject() as any
  }

  async update(id: string, dto: UpdateBrandKitDto): Promise<BrandKitDocument> {
    const doc = await this.brandKitModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true, lean: true })
      .exec()
    if (!doc) throw new NotFoundException(`BrandKit ${id} not found`)
    return doc as any
  }

  async duplicate(id: string): Promise<BrandKitDocument> {
    const source = await this.findById(id)
    const { _id, createdAt, updatedAt, ...rest } = source as any
    const copy = await this.brandKitModel.create({ ...rest, name: `${rest.name} (copy)` })
    return copy.toObject() as any
  }

  async delete(id: string): Promise<void> {
    const result = await this.brandKitModel.findByIdAndDelete(id).exec()
    if (!result) throw new NotFoundException(`BrandKit ${id} not found`)
  }
}
