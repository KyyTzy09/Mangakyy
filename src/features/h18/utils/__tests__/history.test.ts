import { describe, it, expect, beforeEach } from 'vitest'
import {
  getH18Histories,
  getH18HistoryById,
  saveH18History,
  updateH18Progress,
  removeH18History,
  clearH18Histories,
} from '../history'

describe('H18 History Storage Utility', () => {
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

    clearH18Histories()
  })

  it('should return empty array when no history exists', () => {
    const list = getH18Histories()
    expect(list).toEqual([])
  })

  it('should save comic into history and prepend recent entries', () => {
    saveH18History({
      id: 123,
      title: 'Comic A',
      cover_url: 'https://example.com/a.jpg',
      thumbnail_url: 'https://example.com/a_t.jpg',
      page_count: 24,
    })

    saveH18History({
      id: 456,
      title: 'Comic B',
      cover_url: 'https://example.com/b.jpg',
      thumbnail_url: 'https://example.com/b_t.jpg',
      page_count: 32,
    })

    const list = getH18Histories()
    expect(list.length).toBe(2)
    expect(list[0].id).toBe(456)
    expect(list[1].id).toBe(123)
  })

  it('should deduplicate entries and update position to top', () => {
    saveH18History({
      id: 123,
      title: 'Comic A',
      cover_url: 'https://example.com/a.jpg',
      thumbnail_url: 'https://example.com/a_t.jpg',
      page_count: 24,
    })

    saveH18History({
      id: 456,
      title: 'Comic B',
      cover_url: 'https://example.com/b.jpg',
      thumbnail_url: 'https://example.com/b_t.jpg',
      page_count: 32,
    })

    saveH18History({
      id: 123,
      title: 'Comic A Updated',
      cover_url: 'https://example.com/a.jpg',
      thumbnail_url: 'https://example.com/a_t.jpg',
      page_count: 24,
    })

    const list = getH18Histories()
    expect(list.length).toBe(2)
    expect(list[0].id).toBe(123)
    expect(list[0].title).toBe('Comic A Updated')
  })

  it('should remove item by ID', () => {
    saveH18History({
      id: 123,
      title: 'Comic A',
      cover_url: 'https://example.com/a.jpg',
      thumbnail_url: 'https://example.com/a_t.jpg',
      page_count: 24,
    })
    saveH18History({
      id: 456,
      title: 'Comic B',
      cover_url: 'https://example.com/b.jpg',
      thumbnail_url: 'https://example.com/b_t.jpg',
      page_count: 32,
    })

    removeH18History(123)
    const list = getH18Histories()
    expect(list.length).toBe(1)
    expect(list[0].id).toBe(456)
  })

  it('should update reading progress and retrieve by ID', () => {
    saveH18History({
      id: 789,
      title: 'Comic Progress Test',
      cover_url: 'https://example.com/c.jpg',
      thumbnail_url: 'https://example.com/c_t.jpg',
      page_count: 50,
      progress: 0,
      last_page: 1,
    })

    updateH18Progress(789, 45, 23)
    const item = getH18HistoryById(789)
    expect(item).not.toBeNull()
    expect(item?.progress).toBe(45)
    expect(item?.last_page).toBe(23)
  })

  it('should clear all history', () => {
    saveH18History({
      id: 123,
      title: 'Comic A',
      cover_url: 'https://example.com/a.jpg',
      thumbnail_url: 'https://example.com/a_t.jpg',
      page_count: 24,
    })
    clearH18Histories()
    expect(getH18Histories()).toEqual([])
  })
})
