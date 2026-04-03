import { BrandKitModel } from '../models/brandkit'
import type { TCreateBrandKit, TUpdateBrandKit } from '../schemas/brandkit'

export async function listBrandKits() {
  return BrandKitModel.find().sort({ createdAt: -1 }).lean()
}

export async function getBrandKit(id: string) {
  const doc = await BrandKitModel.findById(id).lean()
  if (!doc) throw new Error('not_found')
  return doc
}

export async function createBrandKit(dto: TCreateBrandKit) {
  const created = await BrandKitModel.create(dto)
  return created.toObject()
}

export async function updateBrandKit(id: string, dto: Partial<TUpdateBrandKit>) {
  const doc = await BrandKitModel.findByIdAndUpdate(id, { $set: dto }, { new: true, lean: true })
  if (!doc) throw new Error('not_found')
  return doc
}

export async function duplicateBrandKit(id: string) {
  const source = await getBrandKit(id)
  const { _id, createdAt, updatedAt, ...rest } = source as any
  const copy = await BrandKitModel.create({ ...rest, name: `${rest.name} (copy)` })
  return copy.toObject()
}

export async function deleteBrandKit(id: string) {
  const result = await BrandKitModel.findByIdAndDelete(id)
  if (!result) throw new Error('not_found')
}
