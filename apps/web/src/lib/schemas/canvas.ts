import { z } from 'zod'

export const CreateCanvasSchema = z.object({
  name: z.string().min(1),
  mode: z.enum(['live', 'editor']).optional().default('live'),
  aspectRatio: z.string().optional(),
  bgColor: z.string().optional(),
  isPublic: z.boolean().optional(),
  thumbnail: z.string().optional(),
  projectId: z.string().optional(),
  themeColor: z.string().optional(),
})

export const UpdateCanvasSchema = CreateCanvasSchema.partial().extend({
  pages: z.array(z.record(z.string(), z.any())).optional(),
  track: z.array(z.record(z.string(), z.any())).optional(),
})

export type TCreateCanvas = z.infer<typeof CreateCanvasSchema>
export type TUpdateCanvas = z.infer<typeof UpdateCanvasSchema>
