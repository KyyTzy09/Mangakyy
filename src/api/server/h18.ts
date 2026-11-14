"use server"

import { createServerFn } from '@tanstack/react-start'
import { h18Service } from '@/api/service/h18'
import {
  getH18DetailSchema,
  getH18ListSchema,
  verifyH18PasscodeSchema,
} from '@/shared/schemas/h18.schema'

export const H18_COOKIE_NAME = 'mangakyy_h18_session'

export function validateH18Passcode(
  passcode: string,
  envPasscode: string = process.env.H18_PASSCODE || 'mangakyy18x'
) {
  const trimmed = (passcode || '').trim()
  const expected = envPasscode.trim()

  if (trimmed.length !== 11) {
    return {
      success: false,
      error: 'Kode akses harus tepat 11 digit!',
    }
  }

  if (trimmed === expected) {
    const token = Buffer.from(`h18_${Date.now()}_authenticated`).toString('base64')
    return {
      success: true,
      token,
    }
  }

  return {
    success: false,
    error: 'Kode akses tidak cocok!',
  }
}

export const getH18List = createServerFn({ method: 'GET' })
  .validator(getH18ListSchema)
  .handler(async ({ data }) => {
    return h18Service.search(data)
  })

export const getH18Detail = createServerFn({ method: 'GET' })
  .validator(getH18DetailSchema)
  .handler(async ({ data }) => {
    return h18Service.getDetail(data.id)
  })

export const verifyH18Passcode = createServerFn({ method: 'POST' })
  .validator(verifyH18PasscodeSchema)
  .handler(async ({ data }) => {
    return validateH18Passcode(data.passcode)
  })
