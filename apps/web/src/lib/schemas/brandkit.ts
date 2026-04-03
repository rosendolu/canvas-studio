import { z } from 'zod'

export const BrandColorSchema = z.object({
  label: z.string(),
  value: z.string(),
})

export const BrandTypographySchema = z.object({
  fontFamily: z.string(),
  fontSize: z.number(),
  color: z.string(),
  lineHeight: z.number().optional(),
})

export const CreateBrandKitSchema = z.object({
  name: z.string().min(1).max(100),
  palette: z.array(BrandColorSchema).optional(),
  typography: z.array(BrandTypographySchema).optional(),
  logoAssetId: z.string().optional(),
})

export const UpdateBrandKitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  palette: z.array(BrandColorSchema).optional(),
  typography: z.array(BrandTypographySchema).optional(),
  logoAssetId: z.string().optional(),
})

export type TCreateBrandKit = z.infer<typeof CreateBrandKitSchema>
export type TUpdateBrandKit = z.infer<typeof UpdateBrandKitSchema>
