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

  it('should fetch paginated tags with live/fallback tags structure', async () => {
    const res = await h18Service.getTagsPaginated({ type: 'tag', page: 1, per_page: 20 })
    expect(res).toBeDefined()
    expect(Array.isArray(res.tags)).toBe(true)
    expect(res.tags.length).toBeGreaterThan(0)
    expect(res.total).toBeGreaterThan(0)
    expect(res.num_pages).toBeGreaterThan(0)
    expect(res.current_page).toBe(1)

    const first = res.tags[0]
    expect(first.name).toBeDefined()
    expect(first.slug).toBeDefined()
    expect(typeof first.count).toBe('number')
  }, 15000)

  it('should search tags and return matching results', async () => {
    const results = await h18Service.searchTags({ query: 'school', limit: 10 })
    expect(Array.isArray(results)).toBe(true)
    expect(results.length).toBeGreaterThan(0)
    const match = results.some(
      (t) => t.name.toLowerCase().includes('school') || t.slug.includes('school')
    )
    expect(match).toBe(true)
  }, 15000)

  it('should fetch tags by letter with pagination', async () => {
    const res = await h18Service.getTagsByLetter({
      type: 'tag',
      letter: 'B',
      page: 1,
      per_page: 50,
    })
    expect(res).toBeDefined()
    expect(Array.isArray(res.tags)).toBe(true)
    expect(res.tags.length).toBeGreaterThan(0)
    expect(res.current_page).toBe(1)
    expect(res.per_page).toBe(50)
    const allStartWithB = res.tags.every((t) => t.name.toUpperCase().startsWith('B'))
    expect(allStartWithB).toBe(true)
  }, 15000)

  it('should fetch grouped taxonomy for 5 categories (tag, character, artist, parody, group)', async () => {
    const grouped = await h18Service.getGroupedTags({
      sort: 'popular',
      page: 1,
      per_page: 50,
    })
    expect(grouped).toBeDefined()
    expect(grouped.tag).toBeDefined()
    expect(grouped.character).toBeDefined()
    expect(grouped.artist).toBeDefined()
    expect(grouped.parody).toBeDefined()
    expect(grouped.group).toBeDefined()

    expect(grouped.tag.tags.length).toBeGreaterThan(0)
    expect(grouped.character.tags.length).toBeGreaterThan(0)
    expect(grouped.artist.tags.length).toBeGreaterThan(0)
    expect(grouped.parody.tags.length).toBeGreaterThan(0)
    expect(grouped.group.tags.length).toBeGreaterThan(0)
  }, 20000)
})
