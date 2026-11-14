import { createFileRoute } from '@tanstack/react-router'
import https from 'node:https'

const CLOUDFLARE_IPS = ['104.21.19.217', '172.67.190.60', '213.152.165.54']

// In-memory cache for proxied image buffers to guarantee 0ms instant reload
interface ImageCacheItem {
  buffer: Buffer
  contentType: string
  cachedAt: number
}
const imageCache = new Map<string, ImageCacheItem>()
const MAX_CACHE_ITEMS = 250
const IMAGE_CACHE_TTL = 60 * 60 * 1000 // 1 hour

const FALLBACK_SVG = `<svg width="400" height="560" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="560" fill="#120a17"/>
  <rect x="20" y="20" width="360" height="520" rx="16" fill="#1a0f22" stroke="#ff2d78" stroke-width="1.5" stroke-dasharray="4 4"/>
  <circle cx="200" cy="250" r="48" fill="#ff2d78" fill-opacity="0.15"/>
  <path d="M200 230V270M180 250H220" stroke="#ff2d78" stroke-width="3" stroke-linecap="round"/>
  <text x="200" y="330" fill="#ff2d78" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">MangaKyy H18</text>
  <text x="200" y="355" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Pratinjau Gambar</text>
</svg>`

function fallbackResponse(status = 200) {
  return new Response(FALLBACK_SVG, {
    status,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

function isAllowedHost(hostname: string): boolean {
  return (
    hostname === 'nhentai.net' ||
    hostname.endsWith('.nhentai.net')
  )
}

function fetchSingleAttempt(
  parsed: URL,
  ipOverride?: string
): Promise<{ buffer: Buffer; contentType: string; statusCode: number }> {
  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      headers: {
        Host: parsed.hostname,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Referer: 'https://nhentai.net/',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      timeout: 7000,
    }

    if (ipOverride) {
      options.host = ipOverride
      options.port = 443
      options.path = parsed.pathname + parsed.search
      options.servername = parsed.hostname
    } else {
      options.host = parsed.hostname
      options.path = parsed.pathname + parsed.search
    }

    const req = https.request(options, (res) => {
      const statusCode = res.statusCode || 500
      const contentType = res.headers['content-type'] || 'image/jpeg'

      // Follow redirect if 301/302/307/308
      if (
        statusCode >= 300 &&
        statusCode < 400 &&
        res.headers.location
      ) {
        try {
          const nextUrl = new URL(res.headers.location, parsed.origin)
          fetchSingleAttempt(nextUrl, ipOverride).then(resolve).catch(reject)
          return
        } catch {
          // ignore redirect error
        }
      }

      if (statusCode !== 200) {
        resolve({ buffer: Buffer.alloc(0), contentType, statusCode })
        return
      }

      const chunks: Buffer[] = []
      res.on('data', (c: Buffer) => chunks.push(c))
      res.on('end', () => {
        resolve({
          buffer: Buffer.concat(chunks),
          contentType,
          statusCode: 200,
        })
      })
    })

    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('timeout'))
    })
    req.end()
  })
}

async function fetchImageBuffer(targetUrl: URL): Promise<{ buffer: Buffer; contentType: string } | null> {
  // Strategy:
  // 1. Try Direct
  // 2. If direct fails, try Cloudflare IPs
  // 3. If 404 and ends with .webp, try variations (.jpg.webp, .jpg)
  const candidateUrls: URL[] = [targetUrl]

  if (targetUrl.pathname.endsWith('/thumb.webp')) {
    candidateUrls.push(new URL(targetUrl.href.replace('/thumb.webp', '/thumb.jpg.webp')))
  } else if (targetUrl.pathname.endsWith('/cover.webp')) {
    candidateUrls.push(new URL(targetUrl.href.replace('/cover.webp', '/cover.jpg.webp')))
  }

  for (const url of candidateUrls) {
    // 1. Direct fetch
    try {
      const res = await fetchSingleAttempt(url)
      if (res.statusCode === 200 && res.buffer.length > 0) {
        return { buffer: res.buffer, contentType: res.contentType }
      }
    } catch {
      // direct connection failed (e.g. ISP blocked)
    }

    // 2. Cloudflare IPs
    for (const ip of CLOUDFLARE_IPS) {
      try {
        const res = await fetchSingleAttempt(url, ip)
        if (res.statusCode === 200 && res.buffer.length > 0) {
          return { buffer: res.buffer, contentType: res.contentType }
        }
      } catch {
        // try next IP
      }
    }
  }

  return null
}

async function proxyImage(targetUrlStr: string): Promise<Response> {
  let parsed: URL
  try {
    parsed = new URL(targetUrlStr)
  } catch {
    return fallbackResponse(200)
  }

  if (!isAllowedHost(parsed.hostname)) {
    return fallbackResponse(200)
  }

  const cacheKey = parsed.href
  const cached = imageCache.get(cacheKey)
  if (cached && cached.cachedAt + IMAGE_CACHE_TTL > Date.now()) {
    return new Response(cached.buffer, {
      status: 200,
      headers: {
        'Content-Type': cached.contentType,
        'Content-Length': String(cached.buffer.length),
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  const result = await fetchImageBuffer(parsed)
  if (!result || result.buffer.length === 0) {
    return fallbackResponse(200)
  }

  // Manage in-memory cache size (LRU-like eviction)
  if (imageCache.size >= MAX_CACHE_ITEMS) {
    const oldestKey = imageCache.keys().next().value
    if (oldestKey) imageCache.delete(oldestKey)
  }

  imageCache.set(cacheKey, {
    buffer: result.buffer,
    contentType: result.contentType,
    cachedAt: Date.now(),
  })

  return new Response(result.buffer, {
    status: 200,
    headers: {
      'Content-Type': result.contentType,
      'Content-Length': String(result.buffer.length),
      'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000',
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export const Route = createFileRoute('/api/h18/image')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const targetUrl = url.searchParams.get('url')
        if (!targetUrl) {
          return fallbackResponse(200)
        }
        return proxyImage(targetUrl)
      },
    },
  },
})