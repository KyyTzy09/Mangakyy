import { getChapterList } from '@/api/server/chapter'
import { getMangaDetail, getSimilarManga } from '@/api/server/manga'
import DetailPage from '@/pages/detail'
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  STANDARD_ROBOTS,
  getComicDetailSchema,
} from '@/shared/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

export interface DetailSearch {
  page?: number
}

export const Route = createFileRoute('/detail/$mangaId')({
  validateSearch: (search: Record<string, unknown>): DetailSearch => {
    return {
      page: Number(search.page) > 0 ? Number(search.page) : 1,
    }
  },
  loaderDeps: ({ search: { page } }) => ({ page }),
  component: DetailPage,
  loader: async ({ params, deps: { page } }) => {
    const [detail, chapters, similar] = await Promise.all([
      getMangaDetail({ data: { mangaId: params.mangaId } }),
      getChapterList({
        data: { mangaId: params.mangaId, page: page || 1 },
      }),
      getSimilarManga({ data: { mangaId: params.mangaId } }).catch(() => ({ data: [] })),
    ])

    return {
      detail,
      chapters,
      similar,
      meta: {
        title: `Baca Komik ${detail?.data?.title || 'Manga'} Bahasa Indonesia - ${SITE_NAME}`,
        rawTitle: detail?.data?.title || 'Manga',
        description:
          detail?.data?.description ||
          `Baca manga ${detail?.data?.title} online gratis subtitle bahasa Indonesia update chapter terbaru di MangaKyy.`,
        image: detail?.data?.cover_image_url || DEFAULT_OG_IMAGE,
        genres:
          detail?.data?.taxonomy?.Genre?.map((g: { name: string }) => g.name) ||
          [],
        rating: detail?.data?.user_rate || 0,
        totalChapters: detail?.data?.latest_chapter_number || detail?.data?.total_chapters || 0,
        status: detail?.data?.status,
      },
    }
  },
  head: async ({ loaderData, params }) => {
    const meta = loaderData?.meta
    const pageUrl = `${SITE_URL}/detail/${params.mangaId}`
    const pageTitle = meta?.title || `Baca Manga - ${SITE_NAME}`
    const pageDescription =
      meta?.description ||
      `Baca komik online gratis bahasa Indonesia di ${SITE_NAME}.`
    const pageImage = meta?.image || DEFAULT_OG_IMAGE

    const comicSchema = getComicDetailSchema({
      title: meta?.rawTitle || 'Manga',
      description: pageDescription,
      image: pageImage,
      url: pageUrl,
      genres: meta?.genres || [],
      rating: meta?.rating,
      totalChapters: meta?.totalChapters,
      status: meta?.status,
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
          content: `${meta?.rawTitle || ''}, baca ${meta?.rawTitle || ''}, komik ${meta?.rawTitle || ''}, ${meta?.rawTitle || ''} bahasa indonesia, mangakyy, baca manga online`,
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
          content: 'book',
        },
        {
          property: 'og:site_name',
          content: SITE_NAME,
        },
        {
          property: 'og:url',
          content: pageUrl,
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
          name: 'twitter:description',
          content: pageDescription,
        },
        {
          name: 'twitter:image',
          content: pageImage,
        },
        {
          name: 'twitter:url',
          content: pageUrl,
        },
      ],
      links: [
        {
          rel: 'canonical',
          href: pageUrl,
        },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(comicSchema),
        },
      ],
    }
  },
})
