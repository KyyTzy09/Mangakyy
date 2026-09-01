import { getChapterDetail } from '@/api/server/chapter'
import { getMangaDetail } from '@/api/server/manga'
import ChapterPage from '@/pages/chapter'
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  STANDARD_ROBOTS,
  getChapterSchema,
} from '@/shared/utils/seo'
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
        title: `Baca ${manga?.data.title || 'Manga'} Chapter ${detail?.data?.chapter_number || ''} Bahasa Indonesia - ${SITE_NAME}`,
        mangaTitle: manga?.data.title || 'Manga',
        chapterNumber: detail?.data?.chapter_number || 0,
        description: `Baca ${manga?.data.title} chapter ${detail?.data?.chapter_number} subtitle bahasa Indonesia kualitas HD dan gratis tanpa iklan di MangaKyy.`,
        image: manga?.data.cover_image_url || DEFAULT_OG_IMAGE,
        mangaId: detail?.data.manga_id,
        chapterId: detail?.data.chapter_id,
        releaseDate: detail?.data.release_date,
      },
    }
  },
  head: async ({ loaderData, params }) => {
    const meta = loaderData?.meta
    const chapterUrl = `${SITE_URL}/chapter/${params.chapterId}`
    const mangaUrl = `${SITE_URL}/detail/${meta?.mangaId || ''}`
    const pageTitle = meta?.title || `Baca Chapter - ${SITE_NAME}`
    const pageDescription =
      meta?.description || `Baca komik online gratis di ${SITE_NAME}.`
    const pageImage = meta?.image || DEFAULT_OG_IMAGE

    const chapterSchema = getChapterSchema({
      mangaTitle: meta?.mangaTitle || 'Manga',
      chapterNumber: meta?.chapterNumber || 0,
      chapterUrl,
      mangaUrl,
      image: pageImage,
      datePublished: meta?.releaseDate,
    })

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
          title: pageTitle,
        },
        {
          name: 'description',
          content: pageDescription,
        },
        {
          name: 'keywords',
          content: `baca ${meta?.mangaTitle} chapter ${meta?.chapterNumber}, ${meta?.mangaTitle} ch ${meta?.chapterNumber}, komik ${meta?.mangaTitle} chapter ${meta?.chapterNumber} bahasa indonesia, mangakyy`,
        },
        {
          name: 'author',
          content: SITE_NAME,
        },
        {
          name: 'robots',
          content: STANDARD_ROBOTS,
        },

        // Open Graph
        {
          property: 'og:title',
          content: pageTitle,
        },
        {
          property: 'og:description',
          content: pageDescription,
        },
        {
          property: 'og:image',
          content: pageImage,
        },
        {
          property: 'og:type',
          content: 'article',
        },
        {
          property: 'og:site_name',
          content: SITE_NAME,
        },
        {
          property: 'og:url',
          content: chapterUrl,
        },

        // Twitter card
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:title',
          content: pageTitle,
        },
        {
          name: 'twitter:image',
          content: pageImage,
        },
        {
          name: 'twitter:description',
          content: pageDescription,
        },
        {
          name: 'twitter:url',
          content: chapterUrl,
        },
      ],
      links: [
        {
          rel: 'canonical',
          href: chapterUrl,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(chapterSchema),
        },
      ],
    }
  },
})
