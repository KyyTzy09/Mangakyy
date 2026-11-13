import { describe, expect, it } from 'vitest'
import {
  countryCodeToFlag,
  displayComicType,
  displayCountryName,
} from '../countryConverter'

describe('countryConverter', () => {
  it('converts country codes to flag emojis', () => {
    expect(countryCodeToFlag('JP')).toBe('🇯🇵')
    expect(countryCodeToFlag('KR')).toBe('🇰🇷')
    expect(countryCodeToFlag('ID')).toBe('🇮🇩')
  })

  it('displays country name in Indonesian', () => {
    expect(displayCountryName('JP')).toBe('Jepang')
    expect(displayCountryName('KR')).toBe('Korea Selatan')
    expect(displayCountryName('ID')).toBe('Indonesia')
  })

  it('classifies comic types correctly by country code', () => {
    expect(displayComicType('KR')).toBe('Manhwa')
    expect(displayComicType('JP')).toBe('Manga')
    expect(displayComicType('CN')).toBe('Manhua')
    expect(displayComicType('US')).toBe('Manhua')
  })
})
