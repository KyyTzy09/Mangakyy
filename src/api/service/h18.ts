import https from 'node:https'
import type { H18ComicDetail, H18ComicItem, H18SearchResponse, H18Tag } from '@/features/h18/types'

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
        queryParts.push(`artist:"${params.artist.replace(/"/g, '')}"`)
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
    return [
      {
        category: 'Genre & Tema Populer',
        description: 'Tag paling populer dan banyak dicari di database komik dewasa',
        tags: [
          { name: 'Sole Female', slug: 'sole-female', count: '142k' },
          { name: 'Sole Male', slug: 'sole-male', count: '118k' },
          { name: 'Big Breasts', slug: 'big-breasts', count: '175k' },
          { name: 'Nakadashi', slug: 'nakadashi', count: '127k' },
          { name: 'Anal', slug: 'anal', count: '125k' },
          { name: 'Blowjob', slug: 'blowjob', count: '111k' },
          { name: 'Stockings', slug: 'stockings', count: '82k' },
          { name: 'Schoolgirl', slug: 'schoolgirl', count: '89k' },
          { name: 'Group', slug: 'group', count: '86k' },
          { name: 'Ahegao', slug: 'ahegao', count: '65k' },
          { name: 'Full Color', slug: 'full-color', count: '64k' },
          { name: 'Yaoi', slug: 'yaoi', count: '64k' },
          { name: 'Glasses', slug: 'glasses', count: '59k' },
          { name: 'Milf', slug: 'milf', count: '48k' },
          { name: 'Romance', slug: 'romance', count: '45k' },
          { name: 'Creampie', slug: 'creampie', count: '45k' },
          { name: 'Thigh Highs', slug: 'thigh-highs', count: '43k' },
          { name: 'Futanari', slug: 'futanari', count: '42k' },
          { name: 'Bondage', slug: 'bondage', count: '41k' },
          { name: 'Dark Skin', slug: 'dark-skin', count: '38k' },
          { name: 'Vanilla', slug: 'vanilla', count: '38k' },
          { name: 'Comedy', slug: 'comedy', count: '38k' },
          { name: 'Masturbation', slug: 'masturbation', count: '37k' },
          { name: 'X-Ray', slug: 'x-ray', count: '36k' },
          { name: 'Sister', slug: 'sister', count: '35k' },
          { name: 'Paizuri', slug: 'paizuri', count: '34k' },
          { name: 'Defloration', slug: 'defloration', count: '33k' },
          { name: 'Double Penetration', slug: 'double-penetration', count: '32k' },
          { name: 'Swimsuit', slug: 'swimsuit', count: '31k' },
          { name: 'Yuri', slug: 'yuri', count: '30k' },
          { name: 'Netorare', slug: 'netorare', count: '29k' },
          { name: 'Fingering', slug: 'fingering', count: '29k' },
          { name: 'Handjob', slug: 'handjob', count: '28k' },
          { name: 'Femdom', slug: 'femdom', count: '27k' },
          { name: 'Exhibitionism', slug: 'exhibitionism', count: '26k' },
          { name: 'Childhood Friend', slug: 'childhood-friend', count: '26k' },
          { name: 'Impregnation', slug: 'impregnation', count: '25k' },
          { name: 'Maid', slug: 'maid', count: '24k' },
          { name: 'Crossdressing', slug: 'crossdressing', count: '23k' },
          { name: 'Gyaru', slug: 'gyaru', count: '22k' },
          { name: 'Kemonomimi', slug: 'kemonomimi', count: '22k' },
          { name: 'Cunnilingus', slug: 'cunnilingus', count: '22k' },
          { name: 'BDSM', slug: 'bdsm', count: '21k' },
          { name: 'Teacher', slug: 'teacher', count: '19k' },
          { name: 'Catgirl', slug: 'catgirl', count: '19k' },
          { name: 'Sweating', slug: 'sweating', count: '18k' },
          { name: 'Lactation', slug: 'lactation', count: '17k' },
          { name: 'Cheating', slug: 'cheating', count: '18k' },
          { name: 'Tsundere', slug: 'tsundere', count: '16k' },
          { name: 'Mind Break', slug: 'mind-break', count: '16k' },
          { name: 'Squirting', slug: 'squirting', count: '16k' },
          { name: 'Elf', slug: 'elf', count: '15k' },
          { name: 'Collar', slug: 'collar', count: '15k' },
          { name: 'Bunny Girl', slug: 'bunny-girl', count: '14k' },
          { name: 'Succubus', slug: 'succubus', count: '14k' },
          { name: 'Deepthroat', slug: 'deepthroat', count: '14k' },
          { name: 'Tanlines', slug: 'tanlines', count: '12k' },
          { name: 'Monster Girl', slug: 'monster-girl', count: '11k' },
          { name: 'Footjob', slug: 'footjob', count: '11k' },
          { name: 'Tomboy', slug: 'tomboy', count: '9k' },
          { name: 'Yandere', slug: 'yandere', count: '8k' },
          { name: 'Queen', slug: 'queen', count: '8k' },
          { name: 'Zombie', slug: 'zombie', count: '6k' },
        ],
      },
      {
        category: 'Tema Cerita & Emosi',
        description: 'Alur cerita, nuansa komedi, drama, dan dinamika emosional',
        tags: [
          { name: 'Comedy', slug: 'comedy', count: '38k' },
          { name: 'Romance', slug: 'romance', count: '45k' },
          { name: 'Harem', slug: 'harem', count: '32k' },
          { name: 'Fantasy', slug: 'fantasy', count: '25k' },
          { name: 'Supernatural', slug: 'supernatural', count: '18k' },
          { name: 'Slice of Life', slug: 'slice-of-life', count: '16k' },
          { name: 'Action', slug: 'action', count: '15k' },
          { name: 'Psychological', slug: 'psychological', count: '14k' },
          { name: 'Drama', slug: 'drama', count: '12k' },
          { name: 'Adventure', slug: 'adventure', count: '11k' },
          { name: 'Sports', slug: 'sports', count: '9k' },
          { name: 'Isekai', slug: 'isekai', count: '8k' },
          { name: 'Horror', slug: 'horror', count: '6k' },
          { name: 'Sci-Fi', slug: 'sci-fi', count: '5k' },
          { name: 'Mystery', slug: 'mystery', count: '4k' },
          { name: 'Unrequited Love', slug: 'unrequited-love', count: '3k' },
        ],
      },
      {
        category: 'Karakter & Profesi',
        description: 'Berdasarkan arketipe karakter, seragam, dan peran sosial',
        tags: [
          { name: 'Alien', slug: 'alien', count: '2k' },
          { name: 'Angel', slug: 'angel', count: '6k' },
          { name: 'Babysitter', slug: 'babysitter', count: '7k' },
          { name: 'Bunny Girl', slug: 'bunny-girl', count: '14k' },
          { name: 'Catgirl', slug: 'catgirl', count: '19k' },
          { name: 'Cousin', slug: 'cousin', count: '11k' },
          { name: 'Daughter', slug: 'daughter', count: '15k' },
          { name: 'Demon', slug: 'demon', count: '9k' },
          { name: 'Dilf', slug: 'dilf', count: '8k' },
          { name: 'Elf', slug: 'elf', count: '15k' },
          { name: 'Female Teacher', slug: 'female-teacher', count: '14k' },
          { name: 'Foxgirl', slug: 'foxgirl', count: '11k' },
          { name: 'Goddess', slug: 'goddess', count: '7k' },
          { name: 'Gyaru', slug: 'gyaru', count: '22k' },
          { name: 'Housewife', slug: 'housewife', count: '15k' },
          { name: 'Idol', slug: 'idol', count: '24k' },
          { name: 'JK', slug: 'jk', count: '12k' },
          { name: 'Joshi Kousei', slug: 'joshi-kousei', count: '15k' },
          { name: 'Knight', slug: 'knight', count: '14k' },
          { name: 'Kouhai', slug: 'kouhai', count: '15k' },
          { name: 'Kunoichi', slug: 'kunoichi', count: '9k' },
          { name: 'Magical Girl', slug: 'magical-girl', count: '18k' },
          { name: 'Maid', slug: 'maid', count: '24k' },
          { name: 'Miko', slug: 'miko', count: '12k' },
          { name: 'Milf', slug: 'milf', count: '48k' },
          { name: 'Monster Girl', slug: 'monster-girl', count: '11k' },
          { name: 'Mother', slug: 'mother', count: '32k' },
          { name: 'Ninja', slug: 'ninja', count: '6k' },
          { name: 'Nun', slug: 'nun', count: '8k' },
          { name: 'Nurse', slug: 'nurse', count: '15k' },
          { name: 'Office Lady', slug: 'office-lady', count: '13k' },
          { name: 'Older Man', slug: 'older-man', count: '11k' },
          { name: 'Onee-san', slug: 'onee-san', count: '19k' },
          { name: 'Police', slug: 'police', count: '7k' },
          { name: 'Princess', slug: 'princess', count: '16k' },
          { name: 'Queen', slug: 'queen', count: '8k' },
          { name: 'Quiet Girl', slug: 'quiet-girl', count: '3k' },
          { name: 'Robot', slug: 'robot', count: '4k' },
          { name: 'Schoolgirl', slug: 'schoolgirl', count: '89k' },
          { name: 'Senpai', slug: 'senpai', count: '18k' },
          { name: 'Sister', slug: 'sister', count: '35k' },
          { name: 'Stepmother', slug: 'stepmother', count: '16k' },
          { name: 'Stepsister', slug: 'stepsister', count: '12k' },
          { name: 'Stewardess', slug: 'stewardess', count: '6k' },
          { name: 'Succubus', slug: 'succubus', count: '14k' },
          { name: 'Teacher', slug: 'teacher', count: '19k' },
          { name: 'Tomboy', slug: 'tomboy', count: '9k' },
          { name: 'Twins', slug: 'twins', count: '16k' },
          { name: 'Uncle', slug: 'uncle', count: '8k' },
          { name: 'Vampire', slug: 'vampire', count: '11k' },
          { name: 'Villainess', slug: 'villainess', count: '3k' },
          { name: 'Waitress', slug: 'waitress', count: '11k' },
          { name: 'Widow', slug: 'widow', count: '8k' },
          { name: 'Witch', slug: 'witch', count: '6k' },
          { name: 'Wolfgirl', slug: 'wolfgirl', count: '7k' },
          { name: 'Yandere', slug: 'yandere', count: '8k' },
          { name: 'Zombie Girl', slug: 'zombie-girl', count: '3k' },
        ],
      },
      {
        category: 'Kreator & Artist Terkenal',
        description: 'Komik karya creator, mangaka, dan ilustrator populer',
        tags: [
          { name: 'Asagi Ryu', slug: 'asagi-ryu', count: '2k' },
          { name: 'Bosshi', slug: 'bosshi', count: '2k' },
          { name: 'Distance', slug: 'distance', count: '3k' },
          { name: 'Hisasi', slug: 'hisasi', count: '3k' },
          { name: 'Homunculus', slug: 'homunculus', count: '2k' },
          { name: 'Kisaragi Gunma', slug: 'kisaragi-gunma', count: '2k' },
          { name: 'Kurogane Ken', slug: 'kurogane-ken', count: '2k' },
          { name: 'MEME50', slug: 'meme50', count: '2k' },
          { name: 'Mizuryu Kei', slug: 'mizuryu-kei', count: '3k' },
          { name: 'Po-Ju', slug: 'po-ju', count: '2k' },
          { name: 'ReDrop', slug: 'redrop', count: '2k' },
          { name: 'Shindo L', slug: 'shindo-l', count: '2k' },
          { name: 'Tachibana Omina', slug: 'tachibana-omina', count: '2k' },
          { name: 'Tony Taka', slug: 'tony-taka', count: '2k' },
        ],
      },
      {
        category: 'Anime & Game Parodi',
        description: 'Karya parodi dari anime, manga, dan video game ternama',
        tags: [
          { name: 'Attack on Titan', slug: 'attack-on-titan', count: '6k' },
          { name: 'Azur Lane', slug: 'azur-lane', count: '21k' },
          { name: 'Bleach', slug: 'bleach', count: '9k' },
          { name: 'Blue Archive', slug: 'blue-archive', count: '14k' },
          { name: 'Chainsaw Man', slug: 'chainsaw-man', count: '4k' },
          { name: 'Dead or Alive', slug: 'dead-or-alive', count: '8k' },
          { name: 'Demon Slayer', slug: 'demon-slayer', count: '8k' },
          { name: 'Dragon Ball', slug: 'dragon-ball', count: '7k' },
          { name: 'Fate Grand Order', slug: 'fate-grand-order', count: '36k' },
          { name: 'Final Fantasy', slug: 'final-fantasy', count: '15k' },
          { name: 'Frieren', slug: 'frieren', count: '4k' },
          { name: 'Genshin Impact', slug: 'genshin-impact', count: '18k' },
          { name: 'Granblue Fantasy', slug: 'granblue-fantasy', count: '19k' },
          { name: 'Hololive', slug: 'hololive', count: '11k' },
          { name: 'Honkai Star Rail', slug: 'honkai-star-rail', count: '8k' },
          { name: 'Jujutsu Kaisen', slug: 'jujutsu-kaisen', count: '6k' },
          { name: 'Kantai Collection', slug: 'kantai-collection', count: '38k' },
          { name: 'League of Legends', slug: 'league-of-legends', count: '11k' },
          { name: 'Love Live', slug: 'love-live', count: '16k' },
          { name: 'My Hero Academia', slug: 'my-hero-academia', count: '9k' },
          { name: 'Naruto', slug: 'naruto', count: '12k' },
          { name: 'Neon Genesis Evangelion', slug: 'neon-genesis-evangelion', count: '12k' },
          { name: 'Nier Automata', slug: 'nier-automata', count: '6k' },
          { name: 'One Piece', slug: 'one-piece', count: '11k' },
          { name: 'Original', slug: 'original', count: '161k' },
          { name: 'Overwatch', slug: 'overwatch', count: '9k' },
          { name: 'Pokemon', slug: 'pokemon', count: '16k' },
          { name: 'Princess Connect', slug: 'princess-connect', count: '9k' },
          { name: 'Sailor Moon', slug: 'sailor-moon', count: '11k' },
          { name: 'Spy x Family', slug: 'spy-x-family', count: '5k' },
          { name: 'Street Fighter', slug: 'street-fighter', count: '7k' },
          { name: 'Sword Art Online', slug: 'sword-art-online', count: '14k' },
          { name: 'The Idolmaster', slug: 'the-idolmaster', count: '32k' },
          { name: 'Touhou Project', slug: 'touhou-project', count: '45k' },
          { name: 'Uma Musume', slug: 'uma-musume', count: '7k' },
          { name: 'Vocaloid', slug: 'vocaloid', count: '8k' },
          { name: 'Zenless Zone Zero', slug: 'zenless-zone-zero', count: '3k' },
          { name: 'Zero Two', slug: 'zero-two', count: '2k' },
        ],
      },
      {
        category: 'Fetish & Skenario Khusus',
        description: 'Skenario cerita, dinamika relasi, dan fetish tematik lengkap A-Z',
        tags: [
          { name: 'Ahegao', slug: 'ahegao', count: '65k' },
          { name: 'Anal', slug: 'anal', count: '125k' },
          { name: 'Bathing', slug: 'bathing', count: '10k' },
          { name: 'BDSM', slug: 'bdsm', count: '21k' },
          { name: 'Blackmail', slug: 'blackmail', count: '13k' },
          { name: 'Blindfold', slug: 'blindfold', count: '11k' },
          { name: 'Blowjob', slug: 'blowjob', count: '111k' },
          { name: 'Body Swap', slug: 'body-swap', count: '4k' },
          { name: 'Bondage', slug: 'bondage', count: '41k' },
          { name: 'Brainwash', slug: 'brainwash', count: '7k' },
          { name: 'Chikan', slug: 'chikan', count: '10k' },
          { name: 'Clit Growth', slug: 'clit-growth', count: '4k' },
          { name: 'Collar', slug: 'collar', count: '15k' },
          { name: 'Corruption', slug: 'corruption', count: '9k' },
          { name: 'Cosplay', slug: 'cosplay', count: '17k' },
          { name: 'Creampie', slug: 'creampie', count: '45k' },
          { name: 'Crossdressing', slug: 'crossdressing', count: '23k' },
          { name: 'Cumflation', slug: 'cumflation', count: '8k' },
          { name: 'Cunnilingus', slug: 'cunnilingus', count: '22k' },
          { name: 'Dark Skin', slug: 'dark-skin', count: '38k' },
          { name: 'Deepthroat', slug: 'deepthroat', count: '14k' },
          { name: 'Defloration', slug: 'defloration', count: '33k' },
          { name: 'Double Penetration', slug: 'double-penetration', count: '32k' },
          { name: 'Drug', slug: 'drug', count: '11k' },
          { name: 'Drunk', slug: 'drunk', count: '14k' },
          { name: 'Enema', slug: 'enema', count: '6k' },
          { name: 'Exhibitionism', slug: 'exhibitionism', count: '26k' },
          { name: 'Eyepatch', slug: 'eyepatch', count: '5k' },
          { name: 'Facial', slug: 'facial', count: '18k' },
          { name: 'Femdom', slug: 'femdom', count: '27k' },
          { name: 'Fingering', slug: 'fingering', count: '29k' },
          { name: 'Footjob', slug: 'footjob', count: '11k' },
          { name: 'Full Color', slug: 'full-color', count: '64k' },
          { name: 'Futanari', slug: 'futanari', count: '42k' },
          { name: 'Gag', slug: 'gag', count: '13k' },
          { name: 'Garter Belt', slug: 'garter-belt', count: '9k' },
          { name: 'Glasses', slug: 'glasses', count: '59k' },
          { name: 'Group', slug: 'group', count: '86k' },
          { name: 'Guro', slug: 'guro', count: '8k' },
          { name: 'Hairjob', slug: 'hairjob', count: '4k' },
          { name: 'Handjob', slug: 'handjob', count: '28k' },
          { name: 'Huge Breasts', slug: 'huge-breasts', count: '18k' },
          { name: 'Humiliation', slug: 'humiliation', count: '17k' },
          { name: 'Hypnosis', slug: 'hypnosis', count: '12k' },
          { name: 'Impregnation', slug: 'impregnation', count: '25k' },
          { name: 'Incest', slug: 'incest', count: '34k' },
          { name: 'Inverted Nipples', slug: 'inverted-nipples', count: '7k' },
          { name: 'Invisible Man', slug: 'invisible-man', count: '3k' },
          { name: 'Kinbaku', slug: 'kinbaku', count: '5k' },
          { name: 'Lactation', slug: 'lactation', count: '17k' },
          { name: 'Latex', slug: 'latex', count: '6k' },
          { name: 'Legwear', slug: 'legwear', count: '12k' },
          { name: 'Leotard', slug: 'leotard', count: '9k' },
          { name: 'Lingerie', slug: 'lingerie', count: '19k' },
          { name: 'Mask', slug: 'mask', count: '5k' },
          { name: 'Masturbation', slug: 'masturbation', count: '37k' },
          { name: 'Mind Break', slug: 'mind-break', count: '16k' },
          { name: 'Muscle', slug: 'muscle', count: '7k' },
          { name: 'Nakadashi', slug: 'nakadashi', count: '127k' },
          { name: 'Netorare', slug: 'netorare', count: '29k' },
          { name: 'Netori', slug: 'netori', count: '7k' },
          { name: 'Nipples', slug: 'nipples', count: '18k' },
          { name: 'Onahole', slug: 'onahole', count: '5k' },
          { name: 'Oshikko', slug: 'oshikko', count: '13k' },
          { name: 'Outdoor', slug: 'outdoor', count: '14k' },
          { name: 'Oyakodon', slug: 'oyakodon', count: '12k' },
          { name: 'Paizuri', slug: 'paizuri', count: '34k' },
          { name: 'Pantyhose', slug: 'pantyhose', count: '22k' },
          { name: 'Petplay', slug: 'petplay', count: '6k' },
          { name: 'Piercing', slug: 'piercing', count: '9k' },
          { name: 'Pregnant', slug: 'pregnant', count: '12k' },
          { name: 'Prostitution', slug: 'prostitution', count: '15k' },
          { name: 'Public', slug: 'public', count: '16k' },
          { name: 'Quadruple Penetration', slug: 'quadruple-penetration', count: '1k' },
          { name: 'Quickie', slug: 'quickie', count: '4k' },
          { name: 'Reverse Rape', slug: 'reverse-rape', count: '14k' },
          { name: 'Ribbon', slug: 'ribbon', count: '7k' },
          { name: 'Rimjob', slug: 'rimjob', count: '12k' },
          { name: 'Rimming', slug: 'rimming', count: '5k' },
          { name: 'Ryona', slug: 'ryona', count: '3k' },
          { name: 'Shemale', slug: 'shemale', count: '14k' },
          { name: 'Sleep', slug: 'sleep', count: '8k' },
          { name: 'Sole Female', slug: 'sole-female', count: '142k' },
          { name: 'Sole Male', slug: 'sole-male', count: '118k' },
          { name: 'Spanking', slug: 'spanking', count: '14k' },
          { name: 'Squirting', slug: 'squirting', count: '16k' },
          { name: 'Stockings', slug: 'stockings', count: '82k' },
          { name: 'Sweating', slug: 'sweating', count: '18k' },
          { name: 'Swimsuit', slug: 'swimsuit', count: '31k' },
          { name: 'Tanlines', slug: 'tanlines', count: '12k' },
          { name: 'Tattoo', slug: 'tattoo', count: '13k' },
          { name: 'Tentacles', slug: 'tentacles', count: '15k' },
          { name: 'Thigh Highs', slug: 'thigh-highs', count: '43k' },
          { name: 'Tomgirl', slug: 'tomgirl', count: '12k' },
          { name: 'Tsundere', slug: 'tsundere', count: '16k' },
          { name: 'Ugly Bastard', slug: 'ugly-bastard', count: '28k' },
          { name: 'Uncensored', slug: 'uncensored', count: '15k' },
          { name: 'Underwear', slug: 'underwear', count: '24k' },
          { name: 'Uniform', slug: 'uniform', count: '35k' },
          { name: 'Urination', slug: 'urination', count: '18k' },
          { name: 'Vanilla', slug: 'vanilla', count: '38k' },
          { name: 'Vibrator', slug: 'vibrator', count: '16k' },
          { name: 'Virginity', slug: 'virginity', count: '18k' },
          { name: 'Voyeurism', slug: 'voyeurism', count: '14k' },
          { name: 'Watersports', slug: 'watersports', count: '9k' },
          { name: 'Wet Clothes', slug: 'wet-clothes', count: '13k' },
          { name: 'X-Ray', slug: 'x-ray', count: '36k' },
          { name: 'X-Ray Glasses', slug: 'x-ray-glasses', count: '2k' },
          { name: 'X-Ray View', slug: 'x-ray-view', count: '4k' },
          { name: 'Yaoi', slug: 'yaoi', count: '64k' },
          { name: 'Yukata', slug: 'yukata', count: '9k' },
          { name: 'Yuri', slug: 'yuri', count: '30k' },
          { name: 'Zenra', slug: 'zenra', count: '4k' },
          { name: 'Zettai Ryouiki', slug: 'zettai-ryouiki', count: '12k' },
          { name: 'Zombie', slug: 'zombie', count: '6k' },
        ],
      },
      {
        category: 'Format & Kategori',
        description: 'Format karya dan tipe publikasi',
        tags: [
          { name: 'Doujinshi', slug: 'doujinshi', count: '520k' },
          { name: 'Manga', slug: 'manga', count: '150k' },
          { name: 'Artist CG', slug: 'artist-cg', count: '45k' },
          { name: 'Game CG', slug: 'game-cg', count: '18k' },
          { name: 'Anthology', slug: 'anthology', count: '12k' },
          { name: 'Western', slug: 'western', count: '9k' },
          { name: 'Webtoon', slug: 'webtoon', count: '8k' },
          { name: 'Non-H', slug: 'non-h', count: '2k' },
        ],
      },
      {
        category: 'Bahasa',
        description: 'Pilihan bahasa dan terjemahan komik',
        tags: [
          { name: 'English', slug: 'english', count: '150k' },
          { name: 'Japanese', slug: 'japanese', count: '380k' },
          { name: 'Chinese', slug: 'chinese', count: '95k' },
          { name: 'Translated', slug: 'translated', count: '290k' },
        ],
      },
    ]
  }
}

export const h18Service = new H18Service()