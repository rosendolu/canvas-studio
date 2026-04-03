import { z } from 'zod'

const ASSET_TYPES = ['background', 'sticker', 'apng', 'product', 'bubbleText', 'other'] as const

export const ListAssetsSchema = z.object({
  assetType: z.enum(ASSET_TYPES).optional(),
  q: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
})

export const UpdateAssetSchema = z.object({
  name: z.string().optional(),
  assetType: z.enum(ASSET_TYPES).optional(),
  tags: z.array(z.string()).optional(),
})

export type TListAssets = z.infer<typeof ListAssetsSchema>
export type TUpdateAsset = z.infer<typeof UpdateAssetSchema>
