import { describe, it, expect } from 'vitest'
import { transformBookToComicItem, transformBookToComicDetail } from '../h18Service'

describe('H18 Service Transformers', () => {
  const mockRawBook = {
    id: 123456,
    media: '987654',
    title: {
      english: 'Test Doujinshi English',
      japanese: 'テスト 漫画',
      pretty: 'Test Doujinshi',
    },
    pages: [
      { id: '1', type: { extension: 'jpg' }, width: 1200, height: 1800 },
      { id: '2', type: { extension: 'png' }, width: 1200, height: 1800 },
    ],
    cover: { id: 'cover', type: { extension: 'jpg' }, width: 350, height: 500 },
    tags: {
      all: [
        { id: 1, type: { type: 'language' }, name: 'english', count: 100 },
        { id: 2, type: { type: 'tag' }, name: 'romance', count: 50 },
      ],
    },
    favorites: 350,
    uploaded: new Date('2026-01-01T00:00:00Z'),
  }

  it('should transform raw book into normalized H18ComicItem', () => {
    const item = transformBookToComicItem(mockRawBook)
    expect(item.id).toBe(123456)
    expect(item.title).toBe('Test Doujinshi')
    expect(item.japanese_title).toBe('テスト 漫画')
    expect(item.page_count).toBe(2)
    expect(item.tags).toHaveLength(2)
    expect(item.tags[0].name).toBe('english')
    expect(item.cover_url).toContain('987654/cover.jpg')
    expect(item.thumbnail_url).toContain('987654/thumb.jpg')
  })

  it('should transform raw book into full H18ComicDetail with page images', () => {
    const detail = transformBookToComicDetail(mockRawBook)
    expect(detail.images).toHaveLength(2)
    expect(detail.images[0].page).toBe(1)
    expect(detail.images[0].url).toContain('987654/1.jpg')
    expect(detail.images[1].page).toBe(2)
    expect(detail.images[1].url).toContain('987654/2.png')
  })
})
