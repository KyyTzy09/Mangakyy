import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearNewChapterHistories,
  getHistoryByComicId,
  getLatestChapterHistory,
  getNewChapterHistories,
  saveNewComicHistory,
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
