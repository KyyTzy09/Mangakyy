import { describe, expect, it } from 'vitest'
import { formatCompactNumber } from '../formater'

describe('formater', () => {
  it('formats compact numbers properly', () => {
    expect(formatCompactNumber(500)).toBe('500')
    expect(formatCompactNumber(1200)).toBe('1.2k')
    expect(formatCompactNumber(1000000)).toBe('1m')
    expect(formatCompactNumber(2500000)).toBe('2.5m')
  })
})
