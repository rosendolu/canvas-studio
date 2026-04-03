import { z } from 'zod'

const TEMPLATE_TYPES = ['scene', 'overlay'] as const

export const ListTemplatesSchema = z.object({
  type: z.enum(TEMPLATE_TYPES).optional(),
  q: z.string().optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
})

export const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(TEMPLATE_TYPES),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  payload: z.record(z.string(), z.any()),
})

export const UpdateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  payload: z.record(z.string(), z.any()).optional(),
})

export type TListTemplates = z.infer<typeof ListTemplatesSchema>
export type TCreateTemplate = z.infer<typeof CreateTemplateSchema>
export type TUpdateTemplate = z.infer<typeof UpdateTemplateSchema>
