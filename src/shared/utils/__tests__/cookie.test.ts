import { describe, it, expect } from 'vitest'
import { getCookieFromHeader, serializeCookie } from '../cookie'

describe('Cookie Utility', () => {
  it('should parse cookie value from cookie header string', () => {
    const header = 'theme=dark; mangakyy_h18_session=secret_token_123; other=val'
    expect(getCookieFromHeader('mangakyy_h18_session', header)).toBe('secret_token_123')
    expect(getCookieFromHeader('theme', header)).toBe('dark')
    expect(getCookieFromHeader('non_existent', header)).toBeNull()
  })

  it('should return null when header is empty or undefined', () => {
    expect(getCookieFromHeader('any', '')).toBeNull()
    expect(getCookieFromHeader('any', undefined)).toBeNull()
  })

  it('should serialize cookie with max-age, path, and SameSite', () => {
    const serialized = serializeCookie('mangakyy_h18_session', 'token123', 30)
    expect(serialized).toContain('mangakyy_h18_session=token123')
    expect(serialized).toContain('Path=/')
    expect(serialized).toContain('SameSite=Lax')
    expect(serialized).toContain('Max-Age=2592000') // 30 days in seconds
  })
})
