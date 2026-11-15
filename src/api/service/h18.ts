import https from 'node:https'
import type {
  H18ComicDetail,
  H18ComicItem,
  H18GroupedTagsResult,
  H18PaginatedTagsResult,
  H18SearchResponse,
  H18Tag,
  H18TagItem,
} from '@/features/h18/types'
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
  group?: string
}

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: string
  headers?: Record<string, string>
  timeout?: number
}

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

// In-memory cache for API queries
const searchCache = new Map<string, CacheEntry<H18SearchResponse>>()
const detailCache = new Map<string, CacheEntry<H18ComicDetail>>()
const tagsCache = new Map<string, CacheEntry<H18PaginatedTagsResult>>()
const letterTagsCache = new Map<string, CacheEntry<H18PaginatedTagsResult>>()
const groupedTagsCache = new Map<string, CacheEntry<H18GroupedTagsResult>>()
const searchTagsCache = new Map<string, CacheEntry<H18TagItem[]>>()

const TAG_LETTER_START_PAGES: Record<string, number> = {
  A: 1, B: 3, C: 4, D: 6, E: 9, F: 10, G: 13, H: 14,
  I: 16, J: 17, K: 18, L: 20, M: 21, N: 24, O: 25, P: 26,
  Q: 28, R: 28, S: 29, T: 33, U: 35, V: 35, W: 36, X: 37,
  Y: 37, Z: 37,
}

const SEARCH_CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const DETAIL_CACHE_TTL = 30 * 60 * 1000 // 30 minutes
const TAGS_CACHE_TTL = 60 * 60 * 1000 // 60 minutes
const SEARCH_TAGS_CACHE_TTL = 15 * 60 * 1000 // 15 minutes

/**
 * Perform HTTPS request with direct connection and Cloudflare IP fallbacks
 */
function requestWithFallback(path: string, options?: RequestOptions): Promise<string> {
  const method = options?.method || 'GET'
  const body = options?.body
  const timeout = options?.timeout || 6000

  // 1. Try direct HTTPS request first
  return new Promise((resolve, reject) => {
    const reqHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'application/json',
      ...options?.headers,
    }
    if (body) {
      reqHeaders['Content-Type'] = 'application/json'
      reqHeaders['Content-Length'] = Buffer.byteLength(body).toString()
    }

    const directReq = https.request(
      `https://nhentai.net${path}`,
      {
        method,
        headers: reqHeaders,
        timeout,
      },
      (res) => {
        if (res.statusCode !== 200) {
          directReq.destroy()
          fallbackIps(path, options).then(resolve).catch(reject)
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
      fallbackIps(path, options).then(resolve).catch(reject)
    })

    directReq.on('timeout', () => {
      directReq.destroy()
      fallbackIps(path, options).then(resolve).catch(reject)
    })

    if (body) {
      directReq.write(body)
    }
    directReq.end()
  })
}

/**
 * Fallback to Cloudflare edge IPs when direct DNS / ISP is hijacked
 */
async function fallbackIps(path: string, options?: RequestOptions): Promise<string> {
  const method = options?.method || 'GET'
  const body = options?.body
  const timeout = options?.timeout || 6000

  for (const ip of CLOUDFLARE_IPS) {
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reqHeaders: Record<string, string> = {
          Host: 'nhentai.net',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'application/json',
          ...options?.headers,
        }
        if (body) {
          reqHeaders['Content-Type'] = 'application/json'
          reqHeaders['Content-Length'] = Buffer.byteLength(body).toString()
        }

        const req = https.request(
          {
            host: ip,
            port: 443,
            path,
            method,
            servername: 'nhentai.net',
            headers: reqHeaders,
            timeout,
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
        if (body) {
          req.write(body)
        }
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
      if (params.group) {
        queryParts.push(`group:"${params.group.replace(/"/g, '')}"`)
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

  /**
   * Ekstraksi tag lokal dari H18_GENRE_CATEGORIES sebagai fallback offline / rate limit
   */
  public getLocalFallbackTags(
    sort: 'popular' | 'name' = 'popular',
    page = 1,
    perPage = 50,
    letter?: string
  ): H18PaginatedTagsResult {
    let fallbackAllTags: H18TagItem[] = []
    const seenSlugs = new Set<string>()

    H18_GENRE_CATEGORIES.forEach((cat) => {
      cat.tags.forEach((t) => {
        if (!seenSlugs.has(t.slug)) {
          seenSlugs.add(t.slug)
          const numCount = parseInt(t.count.replace(/[^0-9]/g, ''), 10) || 1000
          fallbackAllTags.push({
            id: t.slug,
            type: 'tag',
            name: t.name,
            slug: t.slug,
            count: numCount,
            description: null,
          })
        }
      })
    })

    if (letter?.trim()) {
      const cleanL = letter.trim().toUpperCase()[0]
      fallbackAllTags = fallbackAllTags.filter((t) =>
        t.name.toUpperCase().startsWith(cleanL)
      )
    }

    if (sort === 'name') {
      fallbackAllTags.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      fallbackAllTags.sort((a, b) => b.count - a.count)
    }

    const total = fallbackAllTags.length
    const numPages = Math.max(1, Math.ceil(total / perPage))
    const safePage = Math.min(Math.max(1, page), numPages)
    const start = (safePage - 1) * perPage
    const paged = fallbackAllTags.slice(start, start + perPage)

    return {
      tags: paged,
      total,
      num_pages: numPages,
      current_page: safePage,
      per_page: perPage,
    }
  }

  /**
   * Mengambil daftar live tag/genre dengan paginasi dan sorting dari nhentai API v2
   */
  public async getTagsPaginated(params?: {
    type?: string
    sort?: 'popular' | 'name'
    letter?: string
    page?: number
    per_page?: number
  }): Promise<H18PaginatedTagsResult> {
    if (params?.letter?.trim()) {
      return this.getTagsByLetter({
        type: params.type || 'tag',
        letter: params.letter.trim(),
        sort: params.sort,
        page: params.page,
        per_page: params.per_page,
      })
    }

    const rawType = (params?.type || 'tag').toLowerCase().trim()
    const validTypes = ['tag', 'artist', 'parody', 'character', 'group', 'category']
    const type = validTypes.includes(rawType) ? rawType : 'tag'
    const sort = params?.sort === 'name' ? 'name' : 'popular'
    const page = Math.max(1, params?.page || 1)
    const perPage = Math.min(120, Math.max(1, params?.per_page || 50))

    const cacheKey = `${type}_${sort}_${page}_${perPage}`
    const cached = tagsCache.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data
    }

    try {
      const raw = await requestWithFallback(
        `/api/v2/tags/${type}?sort=${sort}&page=${page}&per_page=${perPage}`
      )
      const data = JSON.parse(raw)
      const list = Array.isArray(data.result) ? data.result : []
      const tags: H18TagItem[] = list.map((item: any) => ({
        id: item.id || item.slug,
        type: item.type || type,
        name: item.name,
        slug: item.slug,
        count: typeof item.count === 'number' ? item.count : 0,
        description: item.description || null,
      }))

      const sliced = tags.slice(0, perPage)

      const result: H18PaginatedTagsResult = {
        tags: sliced,
        total: typeof data.total === 'number' ? data.total : tags.length,
        num_pages: typeof data.num_pages === 'number' ? data.num_pages : 1,
        current_page: page,
        per_page: perPage,
      }

      tagsCache.set(cacheKey, {
        data: result,
        expiresAt: Date.now() + TAGS_CACHE_TTL,
      })

      return result
    } catch {
      return this.getLocalFallbackTags(sort, page, perPage)
    }
  }

  /**
   * Mengambil tag berdasarkan awalan huruf (A-Z) dengan pagination dan server caching.
   * Jumlah halaman dihitung murni dari data riil tanpa default 3 halaman buatan.
   */
  public async getTagsByLetter(params: {
    type?: string
    letter: string
    sort?: 'popular' | 'name'
    page?: number
    per_page?: number
  }): Promise<H18PaginatedTagsResult> {
    const letter = (params.letter || 'A').trim().toUpperCase()[0] || 'A'
    const rawType = (params.type || 'tag').toLowerCase().trim()
    const validTypes = ['tag', 'artist', 'parody', 'character', 'group']
    const type = validTypes.includes(rawType) ? rawType : 'tag'
    const sort = params.sort === 'name' ? 'name' : 'popular'
    const page = Math.max(1, params.page || 1)
    const perPage = Math.min(100, Math.max(1, params.per_page || 50))

    const cacheKey = `letter_${type}_${letter}_${sort}_${page}_${perPage}`
    const cached = letterTagsCache.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data
    }

    try {
      // Live prefix search mengambil data aktual awalan huruf ini (sampai 50 item)
      const items = await this.searchTags({
        query: letter.toLowerCase(),
        type,
        limit: perPage,
      })

      // Hitung halaman murni dari total data yang ada — tidak ada default/hardcoded 3 halaman
      const total = items.length
      const numPages = Math.max(1, Math.ceil(total / perPage))
      const safePage = Math.min(Math.max(1, page), numPages)
      const paged = items.slice((safePage - 1) * perPage, safePage * perPage)

      const result: H18PaginatedTagsResult = {
        tags: paged,
        total,
        num_pages: numPages,
        current_page: safePage,
        per_page: perPage,
      }

      letterTagsCache.set(cacheKey, {
        data: result,
        expiresAt: Date.now() + TAGS_CACHE_TTL,
      })

      return result
    } catch {
      return this.getLocalFallbackTags(sort, page, perPage, letter)
    }
  }

  /**
   * Mengambil data taksonomi yang dikelompokkan (Genre, Karakter, Artis, Parodi, Grup)
   * masing-masing 50 data terambil secara paralel dengan in-memory server cache
   */
  public async getGroupedTags(params?: {
    letter?: string
    sort?: 'popular' | 'name'
    page?: number
    per_page?: number
  }): Promise<H18GroupedTagsResult> {
    const letter = params?.letter?.trim().toUpperCase()
    const sort = params?.sort === 'name' ? 'name' : 'popular'
    const page = Math.max(1, params?.page || 1)
    const perPage = Math.min(100, Math.max(1, params?.per_page || 50))

    const cacheKey = `grouped_${letter || 'all'}_${sort}_${page}_${perPage}`
    const cached = groupedTagsCache.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data
    }

    const [tagRes, charRes, artistRes, parodyRes, groupRes] = await Promise.all([
      this.getTagsPaginated({ type: 'tag', letter, sort, page, per_page: perPage }),
      this.getTagsPaginated({ type: 'character', letter, sort, page, per_page: perPage }),
      this.getTagsPaginated({ type: 'artist', letter, sort, page, per_page: perPage }),
      this.getTagsPaginated({ type: 'parody', letter, sort, page, per_page: perPage }),
      this.getTagsPaginated({ type: 'group', letter, sort, page, per_page: perPage }),
    ])

    const result: H18GroupedTagsResult = {
      tag: tagRes,
      character: charRes,
      artist: artistRes,
      parody: parodyRes,
      group: groupRes,
    }

    groupedTagsCache.set(cacheKey, {
      data: result,
      expiresAt: Date.now() + TAGS_CACHE_TTL,
    })

    return result
  }

  /**
   * Pencarian langsung live tag/genre/creator/parody dengan POST /api/v2/tags/search
   */
  public async searchTags(params: {
    query: string
    type?: string
    limit?: number
  }): Promise<H18TagItem[]> {
    const q = (params.query || '').trim()
    if (!q) return []

    const rawType = params.type ? params.type.toLowerCase().trim() : undefined
    const limit = Math.min(50, Math.max(1, params.limit || 20))
    const cacheKey = `${rawType || 'all'}_${q.toLowerCase()}_${limit}`

    const cached = searchTagsCache.get(cacheKey)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data
    }

    try {
      const payload = JSON.stringify({
        query: q,
        ...(rawType ? { type: rawType } : {}),
        limit,
      })
      const raw = await requestWithFallback('/api/v2/tags/search', {
        method: 'POST',
        body: payload,
      })
      const data = JSON.parse(raw)
      const list = Array.isArray(data) ? data : []
      const tags: H18TagItem[] = list.map((item: any) => ({
        id: item.id || item.slug,
        type: item.type || rawType || 'tag',
        name: item.name,
        slug: item.slug,
        count: typeof item.count === 'number' ? item.count : 0,
        description: item.description || null,
      }))

      searchTagsCache.set(cacheKey, {
        data: tags,
        expiresAt: Date.now() + SEARCH_TAGS_CACHE_TTL,
      })

      return tags
    } catch {
      const fallback = this.getLocalFallbackTags('popular', 1, 300).tags
      const filtered = fallback.filter((t) => {
        const nameMatches = t.name.toLowerCase().includes(q.toLowerCase())
        const slugMatches = t.slug.toLowerCase().includes(q.toLowerCase())
        return nameMatches || slugMatches
      })
      return filtered.slice(0, limit)
    }
  }
}

export const h18Service = new H18Service()