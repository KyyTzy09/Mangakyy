import {
  getPopularManga,
  getRecommendationManga,
  getUpdateManga,
} from '@/api/server/manga'
import HomePage from '@/pages/home'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  STANDARD_ROBOTS,
} from '@/shared/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

const HOME_TITLE =
  'MangaKyy - Beranda Baca Manga, Manhwa & Manhua Online Terbaru'

export const Route = createFileRoute('/home')({
  component: HomePage,
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
        title: HOME_TITLE,
      },
      {
        name: 'description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        name: 'keywords',
        content: DEFAULT_KEYWORDS,
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
        content: HOME_TITLE,
      },
      {
        property: 'og:description',
        content: DEFAULT_DESCRIPTION,
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
        content: `${SITE_URL}/home`,
      },

      // Twitter card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: HOME_TITLE,
      },
      {
        name: 'twitter:description',
        content: DEFAULT_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: DEFAULT_OG_IMAGE,
      },
      {
        name: 'twitter:url',
        content: `${SITE_URL}/home`,
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: `${SITE_URL}/home`,
      },
    ],
  }),
  loader: async () => {
    const recommendation = await getRecommendationManga({
      data: { format: 'manga' },
    })
    return {
      recommendation,
      popular: await getPopularManga({ data: { type: 'all_time' } }),
      update: await getUpdateManga({ data: { type: 'project' } }),
    }
  },
})
