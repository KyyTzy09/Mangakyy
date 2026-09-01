import { getChapterDetail } from '@/api/server/chapter'
import { getMangaDetail } from '@/api/server/manga'
import ChapterPage from '@/pages/chapter'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/chapter/$chapterId')({
  component: ChapterPage,
  loader: async ({ params }) => {
    const detail = await getChapterDetail({
      data: { chapterId: params.chapterId },
    })
    const manga = await getMangaDetail({
      data: { mangaId: detail?.data.manga_id! },
    })
    return {
      detail,
      manga,
      meta: {
        title: `${manga?.data.title}-Ch.${detail?.data?.chapter_number}`,
        description: manga?.data.description,
        image: manga?.data.cover_image_url,
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
          content: `${data?.meta.title} - Mangakyy`,
        },
        {
          property: 'og:description',
          content: data?.meta.description,
        },
        {
          property: 'og:image',
          content: data?.meta.image,
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
          content: `https://mangakyy.com/chapter/${data?.detail?.data.chapter_id}`,
        },
        // Twitter card
        {
          name: 'twitter:card',
          content: data?.meta.image,
        },
        {
          name: 'twitter:title',
          content: `${data?.meta.title} - MangaKyy`,
        },
        {
          name: 'twitter:image',
          content: data?.meta.image,
        },
        {
          name: 'twitter:description',
          content: data?.meta.description,
        },
        {
          name: 'twitter:url',
          content: `https://mangakyy.com/chapter/${data?.detail?.data.chapter_id}`,
        },
      ],
    }
  },
})
