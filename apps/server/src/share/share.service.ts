import { Injectable, NotFoundException, GoneException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Share, ShareDocument, ShareExpiry } from './share.schema'
import { CreateShareDto } from './share.dto'
import { nanoid } from 'nanoid'

const EXPIRY_MS: Record<ShareExpiry, number | null> = {
  never: null,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
}

@Injectable()
export class ShareService {
  constructor(@InjectModel(Share.name) private shareModel: Model<ShareDocument>) {}

  async create(dto: CreateShareDto): Promise<ShareDocument> {
    const expiry: ShareExpiry = dto.expiry ?? 'never'
    const expiresAt = EXPIRY_MS[expiry] !== null ? Date.now() + EXPIRY_MS[expiry]! : null
    const shareId = nanoid(10)
    const doc = await this.shareModel.create({
      shareId,
      snapshot: dto.snapshot,
      aspectRatio: dto.aspectRatio,
      bgColor: dto.bgColor ?? '',
      expiry,
      expiresAt,
      allowFork: dto.allowFork ?? false,
      viewCount: 0,
    })
    return doc.toObject() as any
  }

  async findByShareId(shareId: string): Promise<ShareDocument> {
    const doc = await this.shareModel.findOne({ shareId }).lean().exec()
    if (!doc) throw new NotFoundException('Share not found')
    // Guard stale docs that TTL hasn't cleaned yet
    if ((doc as any).expiresAt && (doc as any).expiresAt < Date.now()) {
      throw new GoneException('Share link has expired')
    }
    // Increment view count (fire-and-forget)
    this.shareModel.updateOne({ shareId }, { $inc: { viewCount: 1 } }).exec()
    return doc as any
  }

  async delete(shareId: string): Promise<void> {
    await this.shareModel.deleteOne({ shareId }).exec()
  }
}
