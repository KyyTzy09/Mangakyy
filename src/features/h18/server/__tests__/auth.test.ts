import { describe, it, expect } from 'vitest'
import { verifyPasscode, isSessionValid, createSessionToken } from '../auth'

describe('H18 Passcode & Session Auth', () => {
  const MOCK_ENV_PASSCODE = '12345678901' // 11 characters

  it('should reject passcode with length less than 11 characters', () => {
    const result = verifyPasscode('1234567890', MOCK_ENV_PASSCODE)
    expect(result.success).toBe(false)
    expect(result.error).toContain('11 digit')
  })

  it('should reject passcode with length greater than 11 characters', () => {
    const result = verifyPasscode('123456789012', MOCK_ENV_PASSCODE)
    expect(result.success).toBe(false)
    expect(result.error).toContain('11 digit')
  })

  it('should reject 11-character passcode that does not match environment passcode', () => {
    const result = verifyPasscode('99999999999', MOCK_ENV_PASSCODE)
    expect(result.success).toBe(false)
    expect(result.error).toBe('Kode akses salah')
  })

  it('should accept valid 11-character passcode and return session token', () => {
    const result = verifyPasscode('12345678901', MOCK_ENV_PASSCODE)
    expect(result.success).toBe(true)
    expect(result.token).toBeDefined()
    expect(result.token).toBe(createSessionToken(MOCK_ENV_PASSCODE))
  })

  it('should validate session token correctly', () => {
    const token = createSessionToken(MOCK_ENV_PASSCODE)
    expect(isSessionValid(token, MOCK_ENV_PASSCODE)).toBe(true)
    expect(isSessionValid('invalid_random_token', MOCK_ENV_PASSCODE)).toBe(false)
    expect(isSessionValid(null, MOCK_ENV_PASSCODE)).toBe(false)
    expect(isSessionValid(undefined, MOCK_ENV_PASSCODE)).toBe(false)
  })
})
