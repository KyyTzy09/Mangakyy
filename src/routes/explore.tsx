import { getComicGenres } from '@/api/server/genre'
import { getMangaByGenre } from '@/api/server/manga'
import ExplorePage from '@/pages/explore'
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  STANDARD_ROBOTS,
} from '@/shared/utils/seo'
import { createFileRoute } from '@tanstack/react-router'

const EXPLORE_TITLE =
  'Jelajahi Manga, Manhwa & Manhua Berdasarkan Genre - MangaKyy'
const EXPLORE_DESCRIPTION =
  'Cari dan temukan ribuan komik manga, manhwa, dan manhua berdasarkan genre action, romance, fantasy, isekai, komedi, dan banyak lagi secara gratis di MangaKyy.'

export interface ExploreSearch {
  page?: number
  q?: string
  genre?: string
  format?: string
  type?: string
  status?: string
  inc?: 'or' | 'and'
  exc?: 'or' | 'and'
  layout?: 'grid' | 'list'
}

export const Route = createFileRoute('/explore')({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => {
    return {
      page: Number(search.page) > 0 ? Number(search.page) : 1,
      q: typeof search.q === 'string' && search.q ? search.q : undefined,
      genre: typeof search.genre === 'string' && search.genre ? search.genre : undefined,
      format: typeof search.format === 'string' && search.format ? search.format : undefined,
      type: typeof search.type === 'string' && search.type ? search.type : undefined,
      status: typeof search.status === 'string' && search.status ? search.status : undefined,
      inc: search.inc === 'and' ? 'and' : 'or',
      exc: search.exc === 'and' ? 'and' : 'or',
      layout: search.layout === 'list' ? 'list' : 'grid',
    }
  },
  loaderDeps: ({ search }) => search,
  component: ExplorePage,
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
        title: EXPLORE_TITLE,
      },
      {
        name: 'description',
        content: EXPLORE_DESCRIPTION,
      },
      {
        name: 'keywords',
        content:
          'cari manga, filter genre manga, genre manhwa, genre manhua, baca komik gratis, mangakyy explore',
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
        content: EXPLORE_TITLE,
      },
      {
        property: 'og:description',
        content: EXPLORE_DESCRIPTION,
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
        content: `${SITE_URL}/explore`,
      },

      // Twitter card
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: EXPLORE_TITLE,
      },
      {
        name: 'twitter:description',
        content: EXPLORE_DESCRIPTION,
      },
      {
        name: 'twitter:image',
        content: DEFAULT_OG_IMAGE,
      },
      {
        name: 'twitter:url',
        content: `${SITE_URL}/explore`,
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: `${SITE_URL}/explore`,
      },
    ],
  }),
  loader: async ({ deps }) => {
    const genres = deps.genre ? deps.genre.split(',').filter(Boolean) : []
    const formats = deps.format ? deps.format.split(',').filter(Boolean) : []
    const types = deps.type ? deps.type.split(',').filter(Boolean) : []
    const status = deps.status ? deps.status.split(',').filter(Boolean) : []
    const query = deps.q || ''
    const page = deps.page || 1

    return {
      genres: await getComicGenres(),
      comics: await getMangaByGenre({
        data: {
          query,
          genres,
          format: formats,
          type: types,
          status,
          inclusion: deps.inc || 'or',
          exclusion: deps.exc || 'or',
          page,
        },
      }),
      initialSearch: deps,
    }
  },
})
