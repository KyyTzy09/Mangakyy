import { getPopularManga } from '@/api/server/manga'
import PopularPage from '@/pages/popular'
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  STANDARD_ROBOTS,
} from '@/shared/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

const POPULAR_TITLE =
  'Manga & Manhwa Populer Terbanyak Dibaca - MangaKyy'
const POPULAR_DESCRIPTION =
  'Daftar komik manga, manhwa, dan manhua terpopuler dengan rating tertinggi dan paling banyak dibaca pembaca di MangaKyy.'

export const Route = createFileRoute('/popular')({
  component: PopularPage,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: POPULAR_TITLE,
      },
      {
        name: 'description',
        content: POPULAR_DESCRIPTION,
      },
      {
        name: 'keywords',
        content:
          'manga populer, manhwa terbaik, manhua populer, komik rating tertinggi, mangakyy populer',
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
        content: POPULAR_TITLE,
      },
      {
        property: 'og:description',
        content: POPULAR_DESCRIPTION,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:site_name',
        content: SITE_NAME,
      },
      {
        property: 'og:image',
        content: DEFAULT_OG_IMAGE,
      },
      {
        property: 'og:url',
        content: `${SITE_URL}/popular`,
      },

      // Twitter card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: POPULAR_TITLE,
      },
      {
        name: 'twitter:description',
        content: POPULAR_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: DEFAULT_OG_IMAGE,
      },
      {
        name: 'twitter:url',
        content: `${SITE_URL}/popular`,
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: `${SITE_URL}/popular`,
      },
    ],
  }),
  loader: async () => {
    return {
      popular: await getPopularManga({
        data: { type: 'all_time', page: 1, pageSize: 20 },
      }),
    }
  },
})
