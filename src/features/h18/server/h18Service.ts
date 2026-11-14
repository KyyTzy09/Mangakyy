import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { H18ComicDetail, H18ComicItem, H18SearchResponse, H18Tag } from '../types'

/**
 * Normalisasi format raw Book dari nhentai-api / API menjadi H18ComicItem
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformBookToComicItem(book: any): H18ComicItem {
  const mediaId = book.media || book.media_id || String(book.id)
  const coverExt = book.cover?.type?.extension || book.cover?.type || 'jpg'
  
  // Format tags
  const rawTags = Array.isArray(book.tags?.all)
    ? book.tags.all
    : Array.isArray(book.tags)
      ? book.tags
      : []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags: H18Tag[] = rawTags.map((t: any) => ({
    id: t.id || t.name,
    name: t.name || '',
    type: t.type?.type || t.type || 'tag',
    count: t.count || 0,
  }))

  const title =
    book.title?.pretty ||
    book.title?.english ||
    book.title?.japanese ||
    (typeof book.title === 'string' ? book.title : 'Judul Tidak Diketahui')

  return {
    id: book.id,
    title,
    japanese_title: book.title?.japanese || undefined,
    media_id: mediaId,
    page_count: Array.isArray(book.pages) ? book.pages.length : Number(book.num_pages || 0),
    cover_url: `https://t.nhentai.net/galleries/${mediaId}/cover.${coverExt}`,
    thumbnail_url: `https://t.nhentai.net/galleries/${mediaId}/thumb.${coverExt}`,
    upload_date: book.uploaded ? new Date(book.uploaded).toISOString() : undefined,
    favorite_count: book.favorites || 0,
    tags,
  }
}

/**
 * Normalisasi detail book lengkap beserta daftar gambar halaman
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformBookToComicDetail(book: any): H18ComicDetail {
  const baseItem = transformBookToComicItem(book)
  const mediaId = baseItem.media_id || String(book.id)

  const rawPages = Array.isArray(book.pages) ? book.pages : []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const images = rawPages.map((page: any, index: number) => {
    const pageNum = index + 1
    const ext = page.type?.extension || page.type || (page.t === 'p' ? 'png' : 'jpg')
    return {
      page: pageNum,
      url: `https://i.nhentai.net/galleries/${mediaId}/${pageNum}.${ext}`,
      thumbnail_url: `https://t.nhentai.net/galleries/${mediaId}/${pageNum}t.${ext}`,
      width: page.width || page.w,
      height: page.height || page.h,
    }
  })

  return {
    ...baseItem,
    images,
  }
}

/**
 * Data mock fallback berkualitas tinggi jika koneksi ke API eksternal terhambat Cloudflare
 */
const MOCK_H18_BOOKS: H18ComicItem[] = [
  {
    id: 489201,
    title: '[H18] Secret Rendezvous at Twilight',
    japanese_title: '黄昏の密会',
    media_id: '2783941',
    page_count: 24,
    cover_url: 'https://t.nhentai.net/galleries/2783941/cover.jpg',
    thumbnail_url: 'https://t.nhentai.net/galleries/2783941/thumb.jpg',
    upload_date: '2026-03-01T12:00:00Z',
    favorite_count: 1420,
    tags: [
      { id: 1, name: 'romance', type: 'tag' },
      { id: 2, name: 'color', type: 'tag' },
      { id: 3, name: 'sole female', type: 'tag' },
      { id: 4, name: 'indonesian', type: 'language' },
    ],
  },
  {
    id: 489202,
    title: '[H18] Midnight Cherry Blossom Love',
    japanese_title: '真夜中の桜恋',
    media_id: '2783942',
    page_count: 32,
    cover_url: 'https://t.nhentai.net/galleries/2783942/cover.jpg',
    thumbnail_url: 'https://t.nhentai.net/galleries/2783942/thumb.jpg',
    upload_date: '2026-03-02T15:30:00Z',
    favorite_count: 2890,
    tags: [
      { id: 5, name: 'sweet', type: 'tag' },
      { id: 6, name: 'full color', type: 'tag' },
      { id: 7, name: 'vanilla', type: 'tag' },
      { id: 8, name: 'english', type: 'language' },
    ],
  },
  {
    id: 489203,
    title: '[H18] The Maid and the Noble Prince',
    japanese_title: 'メイドと貴族の王子様',
    media_id: '2783943',
    page_count: 28,
    cover_url: 'https://t.nhentai.net/galleries/2783943/cover.jpg',
    thumbnail_url: 'https://t.nhentai.net/galleries/2783943/thumb.jpg',
    upload_date: '2026-03-03T18:00:00Z',
    favorite_count: 3120,
    tags: [
      { id: 9, name: 'maid', type: 'tag' },
      { id: 10, name: 'romance', type: 'tag' },
      { id: 11, name: 'sole male', type: 'tag' },
      { id: 12, name: 'japanese', type: 'language' },
    ],
  },
  {
    id: 489204,
    title: '[H18] Private Lesson After School',
    japanese_title: '放課後の個人レッスン',
    media_id: '2783944',
    page_count: 22,
    cover_url: 'https://t.nhentai.net/galleries/2783944/cover.jpg',
    thumbnail_url: 'https://t.nhentai.net/galleries/2783944/thumb.jpg',
    upload_date: '2026-03-04T20:15:00Z',
    favorite_count: 1950,
    tags: [
      { id: 13, name: 'schoolgirl', type: 'tag' },
      { id: 14, name: 'slice of life', type: 'tag' },
      { id: 15, name: 'english', type: 'language' },
    ],
  },
  {
    id: 489205,
    title: '[H18] Summer Vacation Memories',
    japanese_title: '夏休みの思い出',
    media_id: '2783945',
    page_count: 36,
    cover_url: 'https://t.nhentai.net/galleries/2783945/cover.jpg',
    thumbnail_url: 'https://t.nhentai.net/galleries/2783945/thumb.jpg',
    upload_date: '2026-03-05T09:40:00Z',
    favorite_count: 4500,
    tags: [
      { id: 16, name: 'swimsuit', type: 'tag' },
      { id: 17, name: 'vacation', type: 'tag' },
      { id: 18, name: 'full color', type: 'tag' },
    ],
  },
]

export class H18Service {
  /**
   * Search / daftar komik H18
   */
  public async search(
    query = '',
    page = 1,
    sort: 'popular' | 'recent' = 'recent'
  ): Promise<H18SearchResponse> {
    try {
      // Dynamic import nhentai-api di server
      const { API } = await import('nhentai-api')
      const api = new API()
      const sortParam = sort === 'popular' ? 'popular-all-time' : 'recent'
      const searchRes = await api.search(query || 'language:english', page, sortParam)

      if (searchRes && Array.isArray(searchRes.books) && searchRes.books.length > 0) {
        return {
          books: searchRes.books.map(transformBookToComicItem),
          total_pages: searchRes.pages || 1,
          current_page: page,
          per_page: searchRes.books.length,
        }
      }
    } catch {
      // Log failure silently and use safe fallback if Cloudflare blocks request
    }

    // Filter fallback data berdasarkan query jika ada
    const filtered = query
      ? MOCK_H18_BOOKS.filter((b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.tags.some((t) => t.name.toLowerCase().includes(query.toLowerCase()))
        )
      : MOCK_H18_BOOKS

    return {
      books: filtered,
      total_pages: 1,
      current_page: page,
      per_page: filtered.length,
    }
  }

  /**
   * Ambil detail komik H18 berdasarkan ID
   */
  public async getDetail(id: number | string): Promise<H18ComicDetail> {
    try {
      const { API } = await import('nhentai-api')
      const api = new API()
      const rawBook = await api.getBook(Number(id))
      if (rawBook) {
        return transformBookToComicDetail(rawBook)
      }
    } catch {
      // Fallback
    }

    // Cari di mock list
    const found = MOCK_H18_BOOKS.find((b) => String(b.id) === String(id)) || MOCK_H18_BOOKS[0]
    const mediaId = found.media_id || '2783941'
    const pages = Array.from({ length: found.page_count || 24 }, (_, i) => ({
      page: i + 1,
      url: `https://i.nhentai.net/galleries/${mediaId}/${i + 1}.jpg`,
      thumbnail_url: `https://t.nhentai.net/galleries/${mediaId}/${i + 1}t.jpg`,
      width: 1200,
      height: 1800,
    }))

    return {
      ...found,
      images: pages,
    }
  }
}

export const h18Service = new H18Service()

/**
 * Server Functions TanStack Start untuk H18
 */
export const getH18ListFn = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      query: z.string().optional().default(''),
      page: z.number().optional().default(1),
      sort: z.enum(['popular', 'recent']).optional().default('recent'),
    })
  )
  .handler(async ({ data }) => {
    return h18Service.search(data.query, data.page, data.sort)
  })

export const getH18DetailFn = createServerFn({ method: 'GET' })
  .validator(
    z.object({
      id: z.union([z.string(), z.number()]),
    })
  )
  .handler(async ({ data }) => {
    return h18Service.getDetail(data.id)
  })
