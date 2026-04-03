import { TemplateModel } from '../models/template'
import type { TCreateTemplate, TUpdateTemplate, TListTemplates } from '../schemas/template'

export async function listTemplates(query: {
  type?: string
  q?: string
  tags?: string | string[]
}) {
  const filter: Record<string, unknown> = {}
  if (query.type) filter.type = query.type
  if (query.tags) {
    const tagsArr = Array.isArray(query.tags)
      ? query.tags
      : (query.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
    if (tagsArr.length) filter.tags = { $in: tagsArr }
  }
  if (query.q) filter.$text = { $search: query.q }
  return TemplateModel.find(filter as any).sort({ createdAt: -1 }).lean()
}

export async function getTemplate(id: string) {
  const doc = await TemplateModel.findById(id).lean()
  if (!doc) throw new Error('not_found')
  return doc
}

export async function createTemplate(dto: TCreateTemplate) {
  const created = await TemplateModel.create(dto)
  return created.toObject()
}

export async function updateTemplate(id: string, dto: Partial<TUpdateTemplate>) {
  const doc = await TemplateModel.findByIdAndUpdate(id, { $set: dto }, { new: true, lean: true })
  if (!doc) throw new Error('not_found')
  return doc
}

export async function duplicateTemplate(id: string) {
  const source = await getTemplate(id)
  const { _id, createdAt, updatedAt, ...rest } = source as any
  const copy = await TemplateModel.create({ ...rest, name: `${rest.name} (copy)` })
  return copy.toObject()
}

export async function deleteTemplate(id: string) {
  const result = await TemplateModel.findByIdAndDelete(id)
  if (!result) throw new Error('not_found')
}
