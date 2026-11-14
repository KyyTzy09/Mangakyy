import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

export const H18_COOKIE_NAME = 'mangakyy_h18_session'
const SALT = 'mangakyy_h18_secure_salt_v1'

/**
 * Buat deterministic session token dari passcode & salt
 */
export function createSessionToken(passcode: string): string {
  // Simple deterministic hash function that works universally (client, edge, node)
  let hash = 0
  const combined = `${passcode}:${SALT}`
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0 // Convert to 32bit integer
  }
  return `h18_${Math.abs(hash).toString(36)}_${combined.length}`
}

/**
 * Verifikasi passcode 11-digit
 */
export function verifyPasscode(
  input: string,
  envPasscode: string = process.env.H18_PASSCODE || 'mangakyy18x'
): { success: boolean; token?: string; error?: string } {
  const trimmed = (input || '').trim()

  if (trimmed.length !== 11) {
    return {
      success: false,
      error: 'Kode akses harus tepat 11 digit gaboleh kurang atau lebih',
    }
  }

  if (trimmed !== envPasscode.trim()) {
    return {
      success: false,
      error: 'Kode akses salah',
    }
  }

  return {
    success: true,
    token: createSessionToken(envPasscode.trim()),
  }
}

/**
 * Cek apakah session token valid
 */
export function isSessionValid(
  token: string | null | undefined,
  envPasscode: string = process.env.H18_PASSCODE || 'mangakyy18x'
): boolean {
  if (!token) return false
  const expected = createSessionToken(envPasscode.trim())
  return token === expected
}

/**
 * Server Function TanStack Start untuk verifikasi passcode dari UI
 */
export const verifyH18PasscodeFn = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      passcode: z.string(),
    })
  )
  .handler(async ({ data }) => {
    return verifyPasscode(data.passcode)
  })
