export const SITE_URL = 'https://mangakyy.my.id'
export const SITE_NAME = 'MangaKyy'
export const DEFAULT_TITLE =
  'MangaKyy - Platform Baca Manga, Manhwa & Manhua Online Gratis Tanpa Iklan'
export const DEFAULT_DESCRIPTION =
  'MangaKyy adalah platform baca manga, manhwa, dan manhua online gratis bahasa Indonesia dengan update tercepat, koleksi terlengkap, kualitas gambar HD, dan tanpa gangguan iklan.'
export const DEFAULT_KEYWORDS =
  'mangakyy, manga kyy, mangakyy id, baca manga online, baca manhwa gratis, baca manhua gratis, manga bahasa indonesia, komik online gratis, webtoon indonesia, mangakyy update tercepat'
export const DEFAULT_OG_IMAGE = `${SITE_URL}/mangakyy-logo.png`

/**
 * Schema.org WebSite & Organization JSON-LD for Root / Homepage
 */
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: ['Manga Kyy', 'MangaKyy Platform', 'MangaKyy Indonesia'],
        description: DEFAULT_DESCRIPTION,
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'id-ID',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/explore?query={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: DEFAULT_OG_IMAGE,
          caption: SITE_NAME,
        },
        image: DEFAULT_OG_IMAGE,
        description: DEFAULT_DESCRIPTION,
      },
    ],
  }
}

/**
 * Schema.org ComicSeries / Book JSON-LD for Manga Detail Page
 */
export function getComicDetailSchema({
  title,
  description,
  image,
  url,
  genres = [],
  rating,
  totalChapters,
  status,
}: {
  title: string
  description?: string
  image?: string
  url: string
  genres?: string[]
  rating?: number
  totalChapters?: number
  status?: number
}) {
  const statusString =
    status === 1 ? 'Ongoing' : status === 2 ? 'Hiatus' : 'Completed'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ComicSeries',
        '@id': `${url}/#series`,
        url: url,
        name: title,
        headline: `Baca Komik ${title} Bahasa Indonesia`,
        description: description || `Baca komik ${title} gratis di ${SITE_NAME}`,
        image: image || DEFAULT_OG_IMAGE,
        inLanguage: 'id-ID',
        genre: genres,
        creativeWorkStatus: statusString,
        numberOfEpisodes: totalChapters,
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          url: SITE_URL,
        },
        ...(rating && rating > 0
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: rating,
                bestRating: '10',
                worstRating: '1',
                ratingCount: '100',
              },
            }
          : {}),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Explore',
            item: `${SITE_URL}/explore`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title,
            item: url,
          },
        ],
      },
    ],
  }
}

/**
 * Schema.org ComicIssue / Chapter JSON-LD for Chapter Page
 */
export function getChapterSchema({
  mangaTitle,
  chapterNumber,
  chapterUrl,
  mangaUrl,
  image,
  datePublished,
}: {
  mangaTitle: string
  chapterNumber: number
  chapterUrl: string
  mangaUrl: string
  image?: string
  datePublished?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ComicIssue',
        '@id': `${chapterUrl}/#issue`,
        url: chapterUrl,
        name: `${mangaTitle} Chapter ${chapterNumber}`,
        headline: `Baca ${mangaTitle} Chapter ${chapterNumber} Bahasa Indonesia`,
        issueNumber: `${chapterNumber}`,
        image: image || DEFAULT_OG_IMAGE,
        inLanguage: 'id-ID',
        datePublished: datePublished || new Date().toISOString(),
        isPartOf: {
          '@type': 'ComicSeries',
          name: mangaTitle,
          url: mangaUrl,
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${chapterUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: mangaTitle,
            item: mangaUrl,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `Chapter ${chapterNumber}`,
            item: chapterUrl,
          },
        ],
      },
    ],
  }
}

/**
 * Standard Robots Meta Tag Configuration for High SEO Indexing
 */
export const STANDARD_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

export const NOINDEX_ROBOTS = 'noindex, nofollow'
