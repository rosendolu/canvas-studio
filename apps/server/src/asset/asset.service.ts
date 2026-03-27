import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ConfigService } from '@nestjs/config'
import { Asset, AssetDocument } from './asset.schema'
import { UpdateAssetDto, ListAssetsDto } from './asset.dto'
import { AssetStorageService } from './asset-storage.service'
import * as path from 'path'

const ALLOWED_MIME = new Set([
  'image/png', 'image/jpeg', 'image/gif', 'image/webp',
  'image/svg+xml', 'image/apng',
])
const MAX_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB

@Injectable()
export class AssetService {
  private storage: AssetStorageService

  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
    private config: ConfigService,
  ) {
    const uploadDir = this.config.get<string>(
      'ASSET_UPLOAD_DIR',
      path.join(process.cwd(), 'uploads', 'assets'),
    )
    const urlBase = this.config.get<string>('ASSET_URL_BASE', '/api/assets/file')
    this.storage = new AssetStorageService(uploadDir, urlBase)
  }

  async list(query: ListAssetsDto): Promise<AssetDocument[]> {
    const filter: Record<string, any> = {}
    if (query.assetType) filter.assetType = query.assetType
    if (query.tags?.length) filter.tags = { $in: query.tags }
    if (query.q) filter.$text = { $search: query.q }
    return this.assetModel.find(filter).sort({ createdAt: -1 }).lean().exec() as any
  }

  async findById(id: string): Promise<AssetDocument> {
    const doc = await this.assetModel.findById(id).lean().exec()
    if (!doc) throw new NotFoundException(`Asset ${id} not found`)
    return doc as any
  }

  async upload(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    assetType: string,
    name?: string,
    tags?: string[],
  ): Promise<AssetDocument> {
    if (!ALLOWED_MIME.has(mimeType)) {
      throw new BadRequestException(`Unsupported mime type: ${mimeType}`)
    }
    if (buffer.byteLength > MAX_SIZE_BYTES) {
      throw new BadRequestException(`File too large (max ${MAX_SIZE_BYTES / 1024 / 1024} MB)`)
    }

    let stored
    try {
      stored = await this.storage.put(buffer, originalName, mimeType)
    } catch (err) {
      throw new BadRequestException('Failed to store file')
    }

    try {
      const created = await this.assetModel.create({
        name: name || originalName,
        assetType,
        mimeType,
        size: stored.size,
        storageKey: stored.storageKey,
        url: stored.url,
        checksum: stored.checksum,
        tags: tags || [],
      })
      return created.toObject() as any
    } catch (err) {
      // Orphan cleanup: delete file if doc creation fails
      await this.storage.delete(stored.storageKey)
      throw err
    }
  }

  async update(id: string, dto: UpdateAssetDto): Promise<AssetDocument> {
    const doc = await this.assetModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true, lean: true })
      .exec()
    if (!doc) throw new NotFoundException(`Asset ${id} not found`)
    return doc as any
  }

  async delete(id: string): Promise<void> {
    const doc = await this.assetModel.findByIdAndDelete(id).lean().exec()
    if (!doc) throw new NotFoundException(`Asset ${id} not found`)
    await this.storage.delete((doc as any).storageKey)
  }

  storageAbsPath(storageKey: string): string {
    return this.storage.absolutePath(storageKey)
  }
}
