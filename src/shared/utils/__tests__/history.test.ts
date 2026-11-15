import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearNewChapterHistories,
  getHistoryByComicId,
  getLatestChapterHistory,
  getNewChapterHistories,
  saveNewComicHistory,
  updateChapterProgress,
} from '../history'

describe('history', () => {
  const store: Record<string, string> = {}

  beforeEach(() => {
    for (const key of Object.keys(store)) {
      delete store[key]
    }

    const mockLocalStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => {
        store[key] = val
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        for (const k of Object.keys(store)) delete store[k]
      },
      length: 0,
      key: () => null,
    }

    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: mockLocalStorage },
      writable: true,
      configurable: true,
    })
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    })
  })

  it('saves new comic history and retrieves it', () => {
    saveNewComicHistory(
      {
        comic_id: 'comic-1',
        comic_title: 'One Piece',
        comic_cover_url: 'https://example.com/onepiece.jpg',
      },
      {
        chapter_id: 'ch-1',
        chapter_number: 1,
        thumbnail_image_url: 'https://example.com/ch1.jpg',
        last_read_at: new Date(),
      },
    )

    const list = getNewChapterHistories()
    expect(list).toHaveLength(1)
    expect(list[0].comic_id).toBe('comic-1')
    expect(list[0].chapters).toHaveLength(1)
    expect(list[0].chapters[0].chapter_number).toBe(1)
  })

  it('updates existing comic with new chapter and avoids duplicates', () => {
    const comic = {
      comic_id: 'comic-1',
      comic_title: 'One Piece',
      comic_cover_url: 'https://example.com/onepiece.jpg',
    }

    saveNewComicHistory(comic, {
      chapter_id: 'ch-1',
      chapter_number: 1,
      thumbnail_image_url: 'https://example.com/ch1.jpg',
      last_read_at: new Date(),
    })

    saveNewComicHistory(comic, {
      chapter_id: 'ch-2',
      chapter_number: 2,
      thumbnail_image_url: 'https://example.com/ch2.jpg',
      last_read_at: new Date(),
    })

    const found = getHistoryByComicId('comic-1')
    expect(found).not.toBeNull()
    expect(found?.chapters).toHaveLength(2)

    const latest = getLatestChapterHistory('comic-1')
    expect(latest?.chapter_id).toBe('ch-2')
  })

  it('moves re-read chapter and comic to the top/latest position', () => {
    const comic1 = {
      comic_id: 'comic-1',
      comic_title: 'One Piece',
      comic_cover_url: 'https://example.com/onepiece.jpg',
    }
    const comic2 = {
      comic_id: 'comic-2',
      comic_title: 'Naruto',
      comic_cover_url: 'https://example.com/naruto.jpg',
    }

    saveNewComicHistory(comic1, {
      chapter_id: 'ch-1',
      chapter_number: 1,
      thumbnail_image_url: 'https://example.com/ch1.jpg',
      last_read_at: new Date('2026-01-01T00:00:00Z'),
    })

    saveNewComicHistory(comic2, {
      chapter_id: 'ch-naruto-1',
      chapter_number: 1,
      thumbnail_image_url: 'https://example.com/naruto1.jpg',
      last_read_at: new Date('2026-01-02T00:00:00Z'),
    })

    // Initially comic2 is newest
    let histories = getNewChapterHistories()
    expect(histories[0].comic_id).toBe('comic-2')

    // Re-read comic1 ch-1, it should now become the newest
    saveNewComicHistory(comic1, {
      chapter_id: 'ch-1',
      chapter_number: 1,
      thumbnail_image_url: 'https://example.com/ch1.jpg',
      last_read_at: new Date('2026-01-03T00:00:00Z'),
    })

    histories = getNewChapterHistories()
    expect(histories[0].comic_id).toBe('comic-1')
    expect(histories[1].comic_id).toBe('comic-2')
  })

  it('updates chapter reading progress properly', () => {
    const comic = {
      comic_id: 'comic-progress',
      comic_title: 'Solo Leveling',
      comic_cover_url: 'https://example.com/sl.jpg',
    }

    saveNewComicHistory(comic, {
      chapter_id: 'ch-sl-1',
      chapter_number: 1,
      thumbnail_image_url: 'https://example.com/sl1.jpg',
      last_read_at: new Date(),
    })

    updateChapterProgress('comic-progress', 'ch-sl-1', 75)

    const found = getHistoryByComicId('comic-progress')
    expect(found?.last_read_progress).toBe(75)
    expect(found?.chapters[0].progress).toBe(75)
  })

  it('clears all history', () => {
    saveNewComicHistory(
      {
        comic_id: 'comic-1',
        comic_title: 'One Piece',
        comic_cover_url: 'https://example.com/onepiece.jpg',
      },
      {
        chapter_id: 'ch-1',
        chapter_number: 1,
        thumbnail_image_url: 'https://example.com/ch1.jpg',
        last_read_at: new Date(),
      },
    )

    clearNewChapterHistories()
    expect(getNewChapterHistories()).toEqual([])
    expect(getHistoryByComicId('comic-1')).toBeNull()
  })
})
