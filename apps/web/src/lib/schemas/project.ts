import { z } from 'zod'

export const CreateProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  isPublic: z.boolean().optional(),
  themeColor: z.string().optional(),
})

export const UpdateProjectSchema = CreateProjectSchema.partial()

export type TCreateProject = z.infer<typeof CreateProjectSchema>
export type TUpdateProject = z.infer<typeof UpdateProjectSchema>
