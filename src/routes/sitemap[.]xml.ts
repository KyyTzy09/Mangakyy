import { shinigamiService } from '@/api/service/shinigami'
import { SITE_URL } from '@/shared/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        // Fetch popular & latest comics to include in sitemap
        let comics: Array<{ manga_id: string; updated_at?: string }> = []

        try {
          const res = await shinigamiService.getPopularComic('all_time', 1, 50)
          comics = res?.data || []
        } catch {
          comics = []
        }

        const today = new Date().toISOString().split('T')[0]

        const comicUrls = comics
          .map((comic) => {
            const lastMod = comic.updated_at
              ? new Date(comic.updated_at).toISOString().split('T')[0]
              : today
            return `  <url>
    <loc>${SITE_URL}/detail/${comic.manga_id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
          })
          .join('\n')

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/home</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/explore</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/popular</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/update</loc>
    <lastmod>${today}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
${comicUrls}
</urlset>`

        return new Response(xml.trim(), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          },
        })
      },
    },
  },
})