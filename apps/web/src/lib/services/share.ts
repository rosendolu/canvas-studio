import { nanoid } from 'nanoid'
import { ShareModel } from '../models/share'
import type { TCreateShare } from '../schemas/share'

const EXPIRY_MS: Record<string, number | null> = {
  never: null,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
}

export async function createShare(dto: TCreateShare) {
  const expiry = dto.expiry ?? 'never'
  const expiresAt = EXPIRY_MS[expiry] !== null
    ? Date.now() + (EXPIRY_MS[expiry] ?? 0)
    : null
  const shareId = nanoid(10)
  const doc = await ShareModel.create({
    shareId,
    snapshot: dto.snapshot,
    aspectRatio: dto.aspectRatio,
    bgColor: dto.bgColor ?? '',
    expiry,
    expiresAt,
    allowFork: dto.allowFork ?? false,
    viewCount: 0,
  })
  return doc.toObject()
}

export async function getShareById(shareId: string) {
  const doc = await ShareModel.findOne({ shareId }).lean()
  if (!doc) throw new Error('not_found')
  if ((doc as any).expiresAt && (doc as any).expiresAt < Date.now()) {
    throw new Error('gone:Share link has expired')
  }
  ShareModel.updateOne({ shareId }, { $inc: { viewCount: 1 } }).exec()
  return doc
}

export async function deleteShare(shareId: string) {
  await ShareModel.deleteOne({ shareId })
}
