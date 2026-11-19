import {
  getPopularManga,
  getRecommendationBySlug,
  getRecommendationLists,
  getRecommendationManga,
  getUpdateManga,
} from '@/api/server/manga'
import HomePage from '@/pages/home'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  STANDARD_ROBOTS,
} from '@/shared/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 30,
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
        title: DEFAULT_TITLE,
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
      {
        property: 'og:title',
        content: DEFAULT_TITLE,
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
        content: `${SITE_URL}/`,
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: DEFAULT_TITLE,
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
        content: `${SITE_URL}/`,
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: `${SITE_URL}/`,
      },
    ],
  }),
  loader: async () => {
    const [
      topWeekly,
      heroRecommendation,
      recommendationLists,
      recommendation,
      popular,
      update,
    ] = await Promise.all([
      getPopularManga({
        data: { type: 'weekly', pageSize: 12 },
      }).catch(() => null),
      getRecommendationBySlug({
        data: { slug: 'home' },
      }).catch(() => null),
      getRecommendationLists().catch(() => null),
      getRecommendationManga({
        data: { format: 'manga' },
      }).catch(() => null),
      getPopularManga({ data: { type: 'all_time' } }).catch(() => null),
      getUpdateManga({ data: { type: 'project' } }).catch(() => null),
    ])

    return {
      topWeekly,
      heroRecommendation,
      recommendationLists,
      recommendation,
      popular,
      update,
    }
  },
})
