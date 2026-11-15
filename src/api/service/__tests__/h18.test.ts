import { describe, it, expect } from 'vitest'
import { h18Service } from '../h18'

describe('H18 Service live query', () => {
  it('should search comics and return structured response', async () => {
    const res = await h18Service.search('english', 1, 'recent')
    expect(res).toBeDefined()
    expect(res.current_page).toBe(1)
    expect(Array.isArray(res.books)).toBe(true)
    if (res.books.length > 0) {
      const first = res.books[0]
      expect(first.id).toBeDefined()
      expect(first.title).toBeDefined()
      expect(first.cover_url).toBeDefined()
    }
  }, 15000)

  it('should get comic detail by ID', async () => {
    // 697106 is a verified gallery ID
    const detail = await h18Service.getDetail(697106)
    if (detail) {
      expect(detail.id).toBe(697106)
      expect(detail.title).toBeDefined()
      expect(detail.images).toBeDefined()
      expect(detail.images.length).toBeGreaterThan(0)
    }
  }, 15000)

  it('should cover every letter from A to Z in getGenreCategories()', () => {
    const categories = h18Service.getGenreCategories()
    expect(categories.length).toBeGreaterThan(0)

    const allTags = categories.flatMap((cat) => cat.tags)
    expect(allTags.length).toBeGreaterThan(100)

    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    alphabets.forEach((letter) => {
      const matching = allTags.filter((tag) => tag.name.toUpperCase().startsWith(letter))
      expect(matching.length, `Letter ${letter} should have at least one tag`).toBeGreaterThan(0)
    })
  })
})
