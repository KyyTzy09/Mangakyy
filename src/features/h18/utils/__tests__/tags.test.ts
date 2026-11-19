import { describe, expect, it } from 'bun:test'
import { parseTagsList } from '@/routes/h-explore'

describe('parseTagsList utility', () => {
  it('should return an empty array when undefined, null, or empty string is passed', () => {
    expect(parseTagsList(undefined)).toEqual([])
    expect(parseTagsList('')).toEqual([])
  })

  it('should parse single tag with or without hash prefix', () => {
    expect(parseTagsList('sole-female')).toEqual(['sole-female'])
    expect(parseTagsList('#sole-female')).toEqual(['sole-female'])
  })

  it('should parse comma-separated tags and normalize spaces and cases', () => {
    expect(parseTagsList('sole-female, romance, #maid')).toEqual([
      'sole-female',
      'romance',
      'maid',
    ])
  })

  it('should handle array format of tags', () => {
    expect(parseTagsList(['#comedy', 'romance', '#maid'])).toEqual([
      'comedy',
      'romance',
      'maid',
    ])
  })

  it('should filter out empty items', () => {
    expect(parseTagsList('sole-female,,  , #romance')).toEqual([
      'sole-female',
      'romance',
    ])
  })
})
