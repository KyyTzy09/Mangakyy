import { describe, it, expect } from 'vitest'
import { validateH18Passcode } from '../h18'

describe('H18 Server Authentication', () => {
  it('should accept valid 11-digit passcode matching env', () => {
    const result = validateH18Passcode('mangakyy18x', 'mangakyy18x')
    expect(result.success).toBe(true)
    expect(result.token).toBeDefined()
  })

  it('should reject passcode shorter than 11 digits', () => {
    const result = validateH18Passcode('short', 'mangakyy18x')
    expect(result.success).toBe(false)
    expect(result.error).toContain('11 digit')
  })

  it('should reject passcode longer than 11 digits', () => {
    const result = validateH18Passcode('waytoolong12345', 'mangakyy18x')
    expect(result.success).toBe(false)
    expect(result.error).toContain('11 digit')
  })

  it('should reject incorrect 11-digit passcode', () => {
    const result = validateH18Passcode('wrongcode11', 'mangakyy18x')
    expect(result.success).toBe(false)
    expect(result.error).toContain('tidak cocok')
  })
})
