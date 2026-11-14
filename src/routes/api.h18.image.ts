import { createFileRoute } from '@tanstack/react-router'
import https from 'node:https'

const CLOUDFLARE_IPS = ['104.21.19.217', '172.67.190.60', '213.152.165.54']
const ALLOWED_HOSTS = ['t.nhentai.net', 'i.nhentai.net', 't3.nhentai.net', 'i3.nhentai.net']

const FALLBACK_SVG = `<svg width="400" height="560" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="560" fill="#120a17"/>
  <rect x="20" y="20" width="360" height="520" rx="16" fill="#1a0f22" stroke="#ff2d78" stroke-width="1.5" stroke-dasharray="4 4"/>
  <circle cx="200" cy="250" r="48" fill="#ff2d78" fill-opacity="0.15"/>
  <path d="M200 230V270M180 250H220" stroke="#ff2d78" stroke-width="3" stroke-linecap="round"/>
  <text x="200" y="330" fill="#ff2d78" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">MangaKyy 18+</text>
  <text x="200" y="355" fill="#a1a1aa" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">Preview Unavailable</text>
</svg>`

function fallbackResponse(status = 200) {
  return new Response(FALLBACK_SVG, {
    status,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

async function proxyImage(targetUrlStr: string): Promise<Response> {
  let parsed: URL
  try {
    parsed = new URL(targetUrlStr)
  } catch {
    return fallbackResponse(400)
  }

  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return fallbackResponse(403)
  }

  return new Promise<Response>((resolve) => {
    const ip = CLOUDFLARE_IPS[Math.floor(Math.random() * CLOUDFLARE_IPS.length)]
    const req = https.request(
      {
        host: ip,
        port: 443,
        path: parsed.pathname + parsed.search,
        servername: parsed.hostname,
        headers: {
          Host: parsed.hostname,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Referer: 'https://nhentai.net/',
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          resolve(fallbackResponse(res.statusCode || 502))
          return
        }

        const contentType = res.headers['content-type'] || 'image/jpeg'
        const chunks: Buffer[] = []
        res.on('data', (chunk: Buffer) => chunks.push(chunk))
        res.on('end', () => {
          const buffer = Buffer.concat(chunks)
          resolve(
            new Response(buffer, {
              status: 200,
              headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
              },
            })
          )
        })
      }
    )

    req.on('error', () => {
      resolve(fallbackResponse(502))
    })

    req.setTimeout(8000, () => {
      req.destroy()
      resolve(fallbackResponse(504))
    })

    req.end()
  })
}

export const Route = createFileRoute('/api/h18/image')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const targetUrl = url.searchParams.get('url')
        if (!targetUrl) {
          return fallbackResponse(400)
        }
        return proxyImage(targetUrl)
      },
    },
  },
})
