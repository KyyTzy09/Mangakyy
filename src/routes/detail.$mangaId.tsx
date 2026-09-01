import { getChapterList } from '@/api/server/chapter'
import { getMangaDetail } from '@/api/server/manga'
import DetailPage from '@/pages/detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/detail/$mangaId')({
  component: DetailPage,
  loader: async ({ params }) => {
    const detail = await getMangaDetail({ data: { mangaId: params.mangaId } })
    return {
      detail,
      chapters: await getChapterList({
        data: { mangaId: params.mangaId, page: 1 },
      }),
      meta: {
        title: `${detail?.data.title}`,
        description: detail?.data.description,
        image: detail?.data.cover_image_url,
      },
    }
  },
  head: async ({ loaderData }) => {
    const data = loaderData
    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: `${data?.meta.title} - MangaKyy`,
        },
        {
          name: 'description',
          content: `${data?.meta.description}`,
        },
        {
          name: 'keywords',
          content:
            'manga, manhwa, manhua, baca manga online, manga gratis, manhwa gratis, manhua gratis, komik online, mangakyy',
        },
        {
          name: 'author',
          content: 'Mangakyy',
        },
        {
          name: 'robots',
          content: 'index, follow',
        },

        // Open Graph (buat preview Discord, Facebook, dll)
        {
          property: 'og:title',
          content: `${data?.meta.title} - MangaKyy`,
        },
        {
          property: 'og:description',
          content:
            'Baca manga, manhwa, dan manhua gratis dengan update terbaru dan koleksi lengkap hanya di Mangakyy.',
        },
        {
          property: 'og:image',
          content: `${data?.meta.image}`,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          property: 'og:site_name',
          content: 'Mangakyy',
        },
        {
          property: 'og:url',
          content: `https://mangakyy.my.id/detail/${data?.detail?.data.manga_id}`,
        },
        // Twitter card
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: `${data?.meta.title} - MangaKyy`,
        },
        {
          name: 'twitter:description',
          content:
            'Platform baca manga, manhwa, dan manhua gratis dengan update cepat dan kualitas terbaik.',
        },
        {
          name: 'twitter:image',
          content: `${data?.meta.image}`,
        },
        {
          name: 'twitter:url',
          content: `https://mangakyy.my.id/detail/${data?.detail?.data.manga_id}`,
        },
      ],
    }
  },
})
