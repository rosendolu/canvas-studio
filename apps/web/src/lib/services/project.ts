import { ProjectModel } from '../models/project'
import type { TCreateProject, TUpdateProject } from '../schemas/project'

export async function createProject(dto: TCreateProject) {
  return new ProjectModel(dto).save()
}

export async function listProjects() {
  return ProjectModel.find().sort({ createdAt: -1 }).lean()
}

export async function getProject(id: string) {
  const doc = await ProjectModel.findById(id)
  if (!doc) throw new Error('not_found')
  return doc
}

export async function updateProject(id: string, dto: Partial<TUpdateProject>) {
  const doc = await ProjectModel.findByIdAndUpdate(id, { $set: dto }, { new: true })
  if (!doc) throw new Error('not_found')
  return doc
}

export async function deleteProject(id: string) {
  const doc = await ProjectModel.findByIdAndDelete(id)
  if (!doc) throw new Error('not_found')
}
