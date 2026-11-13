import { describe, expect, it } from 'vitest'
import { cleanText } from '../cleaner'

describe('cleaner', () => {
  it('decodes HTML entities correctly', () => {
    expect(cleanText('&quot;Hello&quot; &amp; &lt;World&gt;')).toBe(
      '"Hello" & World',
    )
  })

  it('strips asterisks and angle brackets', () => {
    expect(cleanText('**Bold text** with <tag>inside</tag>')).toBe(
      'Bold text with taginside/tag',
    )
  })

  it('normalizes multi-space and trims', () => {
    expect(cleanText('   multiple    spaces   everywhere   ')).toBe(
      'multiple spaces everywhere',
    )
  })
})
