import { getUpdateManga } from '@/api/server/manga'
import UpdatePage from '@/pages/update'
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  STANDARD_ROBOTS,
} from '@/shared/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

const UPDATE_TITLE =
  'Update Chapter Komik Terbaru Hari Ini - MangaKyy'
const UPDATE_DESCRIPTION =
  'Rilis chapter manga, manhwa, dan manhua terbaru hari ini dengan kecepatan update terbaik hanya di MangaKyy.'

export interface UpdateSearch {
  type?: 'mirror' | 'project'
  page?: number
}

export const Route = createFileRoute('/update')({
  validateSearch: (search: Record<string, unknown>): UpdateSearch => {
    const type = search.type === 'project' ? 'project' : 'mirror'
    const page = Number(search.page) > 0 ? Number(search.page) : 1
    return {
      type,
      page,
    }
  },
  loaderDeps: ({ search: { type, page } }) => ({ type, page }),
  component: UpdatePage,
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
        title: UPDATE_TITLE,
      },
      {
        name: 'description',
        content: UPDATE_DESCRIPTION,
      },
      {
        name: 'keywords',
        content:
          'manga update hari ini, komik terbaru, chapter terbaru, rilis manhwa terbaru, mangakyy update',
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
        content: UPDATE_TITLE,
      },
      {
        property: 'og:description',
        content: UPDATE_DESCRIPTION,
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
        content: `${SITE_URL}/update`,
      },

      // Twitter card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: UPDATE_TITLE,
      },
      {
        name: 'twitter:description',
        content: UPDATE_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: DEFAULT_OG_IMAGE,
      },
      {
        name: 'twitter:url',
        content: `${SITE_URL}/update`,
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: `${SITE_URL}/update`,
      },
    ],
  }),
  loader: async ({ deps: { type, page } }) => ({
    data: await getUpdateManga({
      data: { type: type || 'mirror', page: page || 1, pageSize: 17 },
    }),
  }),
})
