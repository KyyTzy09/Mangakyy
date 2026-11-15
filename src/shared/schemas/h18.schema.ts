import { z } from 'zod'

export const getH18ListSchema = z.object({
  query: z.string().optional().default(''),
  page: z.number().optional().default(1),
  sort: z
    .enum(['recent', 'popular', 'popular-today', 'popular-week', 'popular-month'])
    .optional()
    .default('recent'),
  category: z.string().optional(),
  language: z.string().optional(),
  tags: z.array(z.string()).optional(),
  artist: z.string().optional(),
  parody: z.string().optional(),
  character: z.string().optional(),
  group: z.string().optional(),
})

export const getH18TagsPaginatedSchema = z.object({
  type: z.string().optional().default('tag'),
  sort: z.enum(['popular', 'name']).optional().default('popular'),
  letter: z.string().optional(),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(50),
})

export const getH18GroupedTagsSchema = z.object({
  letter: z.string().optional(),
  sort: z.enum(['popular', 'name']).optional().default('popular'),
  page: z.number().optional().default(1),
  per_page: z.number().optional().default(50),
})

export const searchH18TagsSchema = z.object({
  query: z.string(),
  type: z.string().optional(),
  limit: z.number().optional().default(50),
})

export const getH18DetailSchema = z.object({
  id: z.union([z.string(), z.number()]),
})

export const verifyH18PasscodeSchema = z.object({
  passcode: z.string(),
})

export type GetH18ListInput = z.infer<typeof getH18ListSchema>
export type GetH18TagsPaginatedInput = z.infer<typeof getH18TagsPaginatedSchema>
export type GetH18GroupedTagsInput = z.infer<typeof getH18GroupedTagsSchema>
export type SearchH18TagsInput = z.infer<typeof searchH18TagsSchema>
export type GetH18DetailInput = z.infer<typeof getH18DetailSchema>
export type VerifyH18PasscodeInput = z.infer<typeof verifyH18PasscodeSchema>
