import { z } from 'zod'

export const CreateShareSchema = z.object({
  snapshot: z.record(z.string(), z.any()),
  aspectRatio: z.string(),
  bgColor: z.string().optional(),
  expiry: z.enum(['never', '24h', '7d']).optional(),
  allowFork: z.boolean().optional(),
})

export type TCreateShare = z.infer<typeof CreateShareSchema>
