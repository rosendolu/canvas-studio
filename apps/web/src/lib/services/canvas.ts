import { nanoid } from 'nanoid'
import { CanvasModel } from '../models/canvas'
import type { TCreateCanvas, TUpdateCanvas } from '../schemas/canvas'

export async function createCanvas(dto: TCreateCanvas) {
  const defaultPage = {
    uid: nanoid(),
    bgColor: dto.bgColor ?? '#000000',
    elements: [],
  }
  const doc = new CanvasModel({
    ...dto,
    pages: dto.mode !== 'editor' ? [defaultPage] : [],
    track: dto.mode === 'editor' ? [] : [],
  })
  return doc.save()
}

export async function listCanvases(query: {
  mode?: string
  projectId?: string
  isPublic?: boolean
}) {
  const filter: Record<string, unknown> = {}
  if (query.mode) filter.mode = query.mode
  if (query.projectId) filter.projectId = query.projectId
  if (query.isPublic !== undefined) filter.isPublic = query.isPublic
  return CanvasModel.find(filter)
    .select('-pages -track')
    .sort({ createdAt: -1 })
    .lean()
}

export async function getCanvas(id: string) {
  const doc = await CanvasModel.findById(id)
  if (!doc) throw new Error('not_found')
  return doc
}

export async function updateCanvas(id: string, dto: Partial<TUpdateCanvas>) {
  const doc = await CanvasModel.findByIdAndUpdate(id, { $set: dto }, { new: true })
  if (!doc) throw new Error('not_found')
  return doc
}

export async function deleteCanvas(id: string) {
  const result = await CanvasModel.findByIdAndDelete(id)
  if (!result) throw new Error('not_found')
}

export async function saveCanvasPages(id: string, pages: unknown[]) {
  return updateCanvas(id, { pages: pages as TUpdateCanvas['pages'] })
}

export async function saveCanvasTrack(id: string, track: unknown[]) {
  return updateCanvas(id, { track: track as TUpdateCanvas['track'] })
}

export async function duplicateCanvas(id: string) {
  const source = await getCanvas(id)
  const copy = new CanvasModel({
    ...source.toObject(),
    _id: undefined,
    name: `${(source as any).name} (副本)`,
    createdAt: undefined,
    updatedAt: undefined,
  })
  return copy.save()
}
