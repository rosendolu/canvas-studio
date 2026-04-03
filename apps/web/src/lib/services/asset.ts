import * as path from 'path'
import * as fs from 'fs/promises'
import * as crypto from 'crypto'
import { AssetModel } from '../models/asset'
import type { TListAssets, TUpdateAsset } from '../schemas/asset'

const ALLOWED_MIME = new Set([
  'image/png', 'image/jpeg', 'image/gif', 'image/webp',
  'image/svg+xml', 'image/apng',
])
const MAX_SIZE_BYTES = 20 * 1024 * 1024

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'assets')
const URL_BASE = '/uploads/assets'

export async function listAssets(query: {
  assetType?: string
  q?: string
  tags?: string | string[]
}) {
  const filter: Record<string, unknown> = {}
  if (query.assetType) filter.assetType = query.assetType
  if (query.tags) {
    const tagsArr = Array.isArray(query.tags)
      ? query.tags
      : (query.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
    if (tagsArr.length) filter.tags = { $in: tagsArr }
  }
  if (query.q) filter.$text = { $search: query.q }
  return AssetModel.find(filter as any).sort({ createdAt: -1 }).lean()
}

export async function getAsset(id: string) {
  const doc = await AssetModel.findById(id).lean()
  if (!doc) throw new Error('not_found')
  return doc
}

export async function uploadAsset(params: {
  buffer: Buffer
  originalName: string
  mimeType: string
  assetType: string
  name?: string
  tags?: string[]
}) {
  if (!ALLOWED_MIME.has(params.mimeType)) {
    throw new Error('bad_request:Unsupported mime type')
  }
  if (params.buffer.byteLength > MAX_SIZE_BYTES) {
    throw new Error(`bad_request:File too large (max ${MAX_SIZE_BYTES / 1024 / 1024} MB)`)
  }

  const checksum = crypto.createHash('sha256').update(params.buffer).digest('hex')
  const ext = (path.extname(params.originalName) || '').replace(/[^a-zA-Z0-9.]/g, '').slice(0, 10)
  const storageKey = `${Date.now()}-${checksum.slice(0, 8)}${ext}`
  const fullPath = path.join(UPLOAD_DIR, storageKey)

  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  await fs.writeFile(fullPath, params.buffer)

  const stored = {
    storageKey,
    url: `${URL_BASE}/${storageKey}`,
    size: params.buffer.byteLength,
    mimeType: params.mimeType,
    checksum,
  }

  try {
    const created = await AssetModel.create({
      name: params.name ?? params.originalName,
      assetType: params.assetType,
      mimeType: params.mimeType,
      size: stored.size,
      storageKey: stored.storageKey,
      url: stored.url,
      checksum: stored.checksum,
      tags: params.tags ?? [],
    })
    return created.toObject()
  } catch {
    await fs.unlink(fullPath).catch(() => {})
    throw new Error('internal:Failed to create asset record')
  }
}

export async function updateAsset(id: string, dto: Partial<TUpdateAsset>) {
  const doc = await AssetModel.findByIdAndUpdate(id, { $set: dto }, { new: true, lean: true })
  if (!doc) throw new Error('not_found')
  return doc
}

export async function deleteAsset(id: string) {
  const doc = await AssetModel.findByIdAndDelete(id).lean()
  if (!doc) throw new Error('not_found')
  const safe = path.basename((doc as any).storageKey ?? '')
  const fullPath = path.join(UPLOAD_DIR, safe)
  await fs.unlink(fullPath).catch(() => {})
}

export function assetAbsolutePath(storageKey: string): string {
  const safe = path.basename(storageKey)
  return path.join(UPLOAD_DIR, safe)
}
