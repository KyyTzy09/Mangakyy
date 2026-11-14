import https from 'node:https'
import type { H18ComicDetail, H18ComicItem, H18SearchResponse, H18Tag } from '@/features/h18/types'

const CLOUDFLARE_EDGE_IP = '104.21.19.217'

function fetchNhentaiV2<T>(path: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: CLOUDFLARE_EDGE_IP,
        port: 443,
        path,
        servername: 'nhentai.net',
        headers: {
          Host: 'nhentai.net',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`nhentai API returned status ${res.statusCode}`))
          return
        }

        let raw = ''
        res.on('data', (chunk) => {
          raw += chunk
        })
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw))
          } catch (err) {
            reject(err)
          }
        })
      }
    )

    req.on('error', reject)
    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('nhentai API request timeout'))
    })
    req.end()
  })
}

export class H18Service {
  /**
   * Search / daftar komik H18 langsung dari API resmi nhentai v2
   */
  public async search(
    query = '',
    page = 1,
    sort: 'popular' | 'recent' = 'recent'
  ): Promise<H18SearchResponse> {
    try {
      let searchQuery = query.trim()
      if (sort === 'popular') {
        searchQuery = searchQuery ? `${searchQuery} sort:popular` : 'language:english sort:popular'
      } else {
        searchQuery = searchQuery || 'language:english'
      }

      const encodedQuery = encodeURIComponent(searchQuery)
      const data = await fetchNhentaiV2<{
        result?: any[]
        num_pages?: number
        per_page?: number
        total?: number
      }>(`/api/v2/search?query=${encodedQuery}&page=${page}`)

      const list = Array.isArray(data.result) ? data.result : []
      const books: H18ComicItem[] = list.map((item) => {
        const mediaId = String(item.media_id || item.id)
        const title = item.english_title || item.title?.pretty || item.title?.english || 'Untitled'
        const rawThumb = item.thumbnail?.path || `galleries/${mediaId}/thumb.webp`
        const thumbUrl = `https://t.nhentai.net/${rawThumb.startsWith('galleries') ? rawThumb : `galleries/${mediaId}/thumb.webp`}`

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

      return {
        books,
        total_pages: data.num_pages || 1,
        current_page: page,
        per_page: data.per_page || books.length,
      }
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
    try {
      const data = await fetchNhentaiV2<any>(`/api/v2/galleries/${id}`)
      if (!data || !data.id) return null

      const mediaId = String(data.media_id || data.id)
      const title = data.title?.pretty || data.title?.english || data.english_title || 'Untitled'
      const coverPath = data.cover?.path || `galleries/${mediaId}/cover.webp`
      const coverUrl = `https://t.nhentai.net/${coverPath}`

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
        const imagePath = p.path || `galleries/${mediaId}/${pageNum}.webp`
        const thumbPath = p.thumbnail || p.path || `galleries/${mediaId}/${pageNum}t.webp`

        return {
          page: pageNum,
          url: `https://i.nhentai.net/${imagePath}`,
          thumbnail_url: `https://t.nhentai.net/${thumbPath}`,
          width: p.width,
          height: p.height,
        }
      })

      return {
        id: data.id,
        title,
        japanese_title: data.title?.japanese || undefined,
        media_id: mediaId,
        page_count: data.num_pages || images.length,
        cover_url: coverUrl,
        thumbnail_url: coverUrl,
        upload_date: data.upload_date ? new Date(data.upload_date * 1000).toISOString() : undefined,
        favorite_count: data.num_favorites || 0,
        tags,
        images,
      }
    } catch {
      return null
    }
  }
}

export const h18Service = new H18Service()
