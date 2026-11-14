import { z } from 'zod'

export const getH18ListSchema = z.object({
  query: z.string().optional().default(''),
  page: z.number().optional().default(1),
  sort: z.enum(['popular', 'recent']).optional().default('recent'),
})

export const getH18DetailSchema = z.object({
  id: z.union([z.string(), z.number()]),
})

export const verifyH18PasscodeSchema = z.object({
  passcode: z.string(),
})

export type GetH18ListInput = z.infer<typeof getH18ListSchema>
export type GetH18DetailInput = z.infer<typeof getH18DetailSchema>
export type VerifyH18PasscodeInput = z.infer<typeof verifyH18PasscodeSchema>
