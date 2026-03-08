
import { shinigamiService } from '@/api/service/shinigami'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sitemap.xml')({
    server: {
        handlers: {
            GET: async () => {
                const res = await shinigamiService.getPopularComic("all_time", 1, 24)
                const comics = res?.data

                const comicUrls = comics?.map((comic) => `
  <url>
    <loc>https://mangakyy.my.id/detail/${comic.manga_id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
`).join('')

                const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://mangakyy.my.id/</loc>
  </url>
  <url>
    <loc>https://mangakyy.my.id/explore</loc>
  </url>
  
  <url>
    <loc>https://mangakyy.my.id/update</loc>
  </url>

  <url>
    <loc>https://mangakyy.my.id/series</loc>
  </url>

  <url>
    <loc>https://mangakyy.my.id/popular</loc>
  </url>

  ${comicUrls}

</urlset>`

                return new Response(xml, {
                    headers: {
                        "Content-Type": "application/xml; charset=utf-8",
                        "Cache-Control": "public, max-age=3600"
                    }
                })
            },
        },
    },
})