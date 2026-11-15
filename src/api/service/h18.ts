import https from 'node:https'
import type { H18ComicDetail, H18ComicItem, H18SearchResponse, H18Tag } from '@/features/h18/types'
import { H18_GENRE_CATEGORIES } from '@/features/h18/data/tags'

const CLOUDFLARE_IPS = ['104.21.19.217', '172.67.190.60', '213.152.165.54']

export interface H18SearchParams {
  query?: string
  page?: number
  sort?: 'recent' | 'popular' | 'popular-today' | 'popular-week' | 'popular-month'
  category?: string
  language?: string
  tags?: string[]
  artist?: string
  parody?: string
  character?: string
}

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

// In-memory cache for API queries
const searchCache = new Map<string, CacheEntry<H18SearchResponse>>()
const detailCache = new Map<string, CacheEntry<H18ComicDetail>>()

const SEARCH_CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const DETAIL_CACHE_TTL = 30 * 60 * 1000 // 30 minutes

/**
 * Perform HTTPS GET with direct connection and Cloudflare IP fallbacks
 */
function requestWithFallback(path: string): Promise<string> {
  // 1. Try direct HTTPS request first
  return new Promise((resolve, reject) => {
    const directReq = https.get(
      `https://nhentai.net${path}`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
        timeout: 6000,
      },
      (res) => {
        if (res.statusCode !== 200) {
          directReq.destroy()
          fallbackIps(path).then(resolve).catch(reject)
          return
        }
        let raw = ''
        res.on('data', (chunk) => {
          raw += chunk
        })
        res.on('end', () => resolve(raw))
      }
    )

    directReq.on('error', () => {
      fallbackIps(path).then(resolve).catch(reject)
    })

    directReq.on('timeout', () => {
      directReq.destroy()
      fallbackIps(path).then(resolve).catch(reject)
    })
  })
}

/**
 * Fallback to Cloudflare edge IPs when direct DNS / ISP is hijacked
 */
async function fallbackIps(path: string): Promise<string> {
  for (const ip of CLOUDFLARE_IPS) {
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const req = https.request(
          {
            host: ip,
            port: 443,
            path,
            servername: 'nhentai.net',
            headers: {
              Host: 'nhentai.net',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              Accept: 'application/json',
            },
            timeout: 6000,
          },
          (res) => {
            if (res.statusCode !== 200) {
              reject(new Error(`Status ${res.statusCode}`))
              return
            }
            let raw = ''
            res.on('data', (c) => {
              raw += c
            })
            res.on('end', () => resolve(raw))
          }
        )
        req.on('error', reject)
        req.on('timeout', () => {
          req.destroy()
          reject(new Error('timeout'))
        })
        req.end()
      })
      return data
    } catch {
      // try next IP
    }
  }
  throw new Error('All fallbacks failed')
}

async function fetchNhentaiV2<T>(path: string): Promise<T> {
  const raw = await requestWithFallback(path)
  return JSON.parse(raw) as T
}

function resolveThumbUrl(raw: any, mediaId: string): string {
  let pathStr = ''
  if (typeof raw === 'string' && raw.trim().length > 0) {
    pathStr = raw.trim()
  } else if (raw && typeof raw.path === 'string' && raw.path.trim().length > 0) {
    pathStr = raw.path.trim()
  } else if (mediaId) {
    pathStr = `galleries/${mediaId}/thumb.webp`
  }

  const clean = pathStr.replace(/^\/+/, '')
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean
  }
  return `https://t.nhentai.net/${clean}`
}

function resolveCoverUrl(raw: any, mediaId: string): string {
  let pathStr = ''
  if (typeof raw === 'string' && raw.trim().length > 0) {
    pathStr = raw.trim()
  } else if (raw && typeof raw.path === 'string' && raw.path.trim().length > 0) {
    pathStr = raw.path.trim()
  } else if (mediaId) {
    pathStr = `galleries/${mediaId}/cover.jpg.webp`
  }

  const clean = pathStr.replace(/^\/+/, '')
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean
  }
  return `https://t.nhentai.net/${clean}`
}

function resolvePageUrl(raw: any, mediaId: string, pageNum: number): string {
  let pathStr = ''
  if (typeof raw === 'string' && raw.trim().length > 0) {
    pathStr = raw.trim()
  } else if (raw && typeof raw.path === 'string' && raw.path.trim().length > 0) {
    pathStr = raw.path.trim()
  } else if (mediaId) {
    pathStr = `galleries/${mediaId}/${pageNum}.jpg`
  }

  const clean = pathStr.replace(/^\/+/, '')
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean
  }
  return `https://i.nhentai.net/${clean}`
}

export class H18Service {
  /**
   * Search / explore komik H18 dengan filter lengkap (query, tags, category, language, sort)
   */
  public async search(params: H18SearchParams = {}): Promise<H18SearchResponse> {
    const page = params.page && params.page > 0 ? params.page : 1
    const cacheKey = JSON.stringify({ ...params, page })

    const cached = searchCache.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data
    }

    try {
      const queryParts: string[] = []

      if (params.query?.trim()) {
        queryParts.push(params.query.trim())
      }
      if (params.category) {
        queryParts.push(`category:${params.category}`)
      }
      if (params.language) {
        queryParts.push(`language:${params.language}`)
      }
      if (params.artist) {
        const cleanA = params.artist.replace(/-/g, ' ').replace(/"/g, '').trim()
        queryParts.push(`artist:"${cleanA}"`)
      }
      if (params.parody) {
        queryParts.push(`parody:"${params.parody.replace(/"/g, '')}"`)
      }
      if (params.character) {
        queryParts.push(`character:"${params.character.replace(/"/g, '')}"`)
      }
      if (params.tags && Array.isArray(params.tags)) {
        params.tags.forEach((t) => {
          const clean = t.trim().replace(/^#/, '').toLowerCase()
          if (!clean) return

          if (['doujinshi', 'manga', 'artist-cg', 'game-cg', 'western', 'non-h'].includes(clean)) {
            queryParts.push(`category:${clean}`)
          } else if (['english', 'japanese', 'chinese', 'translated'].includes(clean)) {
            queryParts.push(`language:${clean}`)
          } else if (clean.includes(' ')) {
            queryParts.push(`"${clean}"`)
          } else {
            queryParts.push(clean)
          }
        })
      }

      if (queryParts.length === 0) {
        queryParts.push('language:english')
      }

      const fullQuery = queryParts.join(' ')
      const sortParam =
        params.sort === 'popular'
          ? 'popular'
          : params.sort === 'popular-today'
            ? 'popular-today'
            : params.sort === 'popular-week'
              ? 'popular-week'
              : params.sort === 'popular-month'
                ? 'popular-month'
                : 'date'

      const encodedQuery = encodeURIComponent(fullQuery)
      const data = await fetchNhentaiV2<{
        result?: any[]
        num_pages?: number
        per_page?: number
        total?: number
      }>(`/api/v2/search?query=${encodedQuery}&sort=${sortParam}&page=${page}`)

      const list = Array.isArray(data.result) ? data.result : []
      const books: H18ComicItem[] = list.map((item) => {
        const mediaId = String(item.media_id || item.id)
        const title = item.english_title || item.title?.pretty || item.title?.english || 'Untitled'
        const thumbUrl = resolveThumbUrl(item.thumbnail, mediaId)

        const tags: H18Tag[] = Array.isArray(item.tags)
          ? item.tags.map((t: any) => ({
              id: t.id || t.name,
              name: t.name,
              type: t.type || 'tag',
              count: t.count || 0,
            }))
          : []

        return {
          id: item.id,
          title,
          japanese_title: item.japanese_title || undefined,
          media_id: mediaId,
          page_count: item.num_pages || 0,
          cover_url: thumbUrl,
          thumbnail_url: thumbUrl,
          upload_date: item.upload_date ? new Date(item.upload_date * 1000).toISOString() : undefined,
          favorite_count: item.num_favorites || 0,
          tags,
        }
      })

      const response: H18SearchResponse = {
        books,
        total_pages: data.num_pages || 1,
        current_page: page,
        per_page: data.per_page || books.length,
      }

      // Save to cache
      searchCache.set(cacheKey, {
        data: response,
        expiresAt: Date.now() + SEARCH_CACHE_TTL,
      })

      return response
    } catch {
      return {
        books: [],
        total_pages: 1,
        current_page: page,
        per_page: 0,
      }
    }
  }

  /**
   * Ambil detail komik H18 berdasarkan ID dari API v2
   */
  public async getDetail(id: number | string): Promise<H18ComicDetail | null> {
    const cleanId = String(id).replace(/[^0-9]/g, '')
    if (!cleanId) return null

    const cached = detailCache.get(cleanId)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data
    }

    try {
      const data = await fetchNhentaiV2<any>(`/api/v2/galleries/${cleanId}`)
      if (!data || !data.id) return null

      const mediaId = String(data.media_id || data.id)
      const title = data.title?.pretty || data.title?.english || data.english_title || 'Untitled'
      const coverUrl = resolveCoverUrl(data.cover, mediaId)
      const thumbUrl = resolveThumbUrl(data.thumbnail || data.cover, mediaId)

      const tags: H18Tag[] = Array.isArray(data.tags)
        ? data.tags.map((t: any) => ({
            id: t.id || t.name,
            name: t.name,
            type: t.type || 'tag',
            count: t.count || 0,
          }))
        : []

      const rawPages = Array.isArray(data.pages) ? data.pages : []
      const images = rawPages.map((p: any) => {
        const pageNum = p.number || 1
        const imageUrl = resolvePageUrl(p, mediaId, pageNum)
        const pageThumbUrl = resolveThumbUrl(p.thumbnail || p, mediaId)

        return {
          page: pageNum,
          url: imageUrl,
          thumbnail_url: pageThumbUrl,
          width: p.width,
          height: p.height,
        }
      })

      const detail: H18ComicDetail = {
        id: data.id,
        title,
        japanese_title: data.title?.japanese || undefined,
        media_id: mediaId,
        page_count: data.num_pages || images.length,
        cover_url: coverUrl,
        thumbnail_url: thumbUrl,
        upload_date: data.upload_date ? new Date(data.upload_date * 1000).toISOString() : undefined,
        favorite_count: data.num_favorites || 0,
        tags,
        images,
      }

      // Save to cache
      detailCache.set(cleanId, {
        data: detail,
        expiresAt: Date.now() + DETAIL_CACHE_TTL,
      })

      return detail
    } catch {
      return null
    }
  }

  /**
   * Daftar Taksonomi Genre & Tag Lengkap untuk Halaman /h-genre
   * Menjamin semua huruf alfabet A-Z memiliki tag otentik dan komprehensif.
   */
  public getGenreCategories() {
    return H18_GENRE_CATEGORIES
  }
}

export const h18Service = new H18Service()