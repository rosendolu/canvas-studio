import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Project, ProjectDocument } from './project.schema'
import { CreateProjectDto, UpdateProjectDto } from './project.dto'

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  create(dto: CreateProjectDto) {
    return new this.projectModel(dto).save()
  }

  findAll() {
    return this.projectModel.find().sort({ createdAt: -1 }).lean()
  }

  async findOne(id: string) {
    const doc = await this.projectModel.findById(id)
    if (!doc) throw new NotFoundException(`Project ${id} not found`)
    return doc
  }

  async update(id: string, dto: UpdateProjectDto) {
    const doc = await this.projectModel.findByIdAndUpdate(id, { $set: dto }, { new: true })
    if (!doc) throw new NotFoundException(`Project ${id} not found`)
    return doc
  }

  async remove(id: string) {
    const doc = await this.projectModel.findByIdAndDelete(id)
    if (!doc) throw new NotFoundException(`Project ${id} not found`)
  }
}
