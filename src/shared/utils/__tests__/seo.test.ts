import { describe, expect, it } from 'vitest'
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  getChapterSchema,
  getComicDetailSchema,
  getWebsiteSchema,
} from '../seo'

describe('seo', () => {
  it('generates valid Website schema graph', () => {
    const schema = getWebsiteSchema()
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@graph']).toHaveLength(2)

    const website = schema['@graph'][0]
    expect(website['@type']).toBe('WebSite')
    expect(website.url).toBe(SITE_URL)
    expect(website.name).toBe(SITE_NAME)

    const org = schema['@graph'][1]
    expect(org['@type']).toBe('Organization')
    expect(org.url).toBe(SITE_URL)
  })

  it('generates valid ComicSeries schema', () => {
    const schema = getComicDetailSchema({
      title: 'Solo Leveling',
      description: 'Hunter Sung Jin-Woo',
      image: 'https://example.com/cover.jpg',
      url: `${SITE_URL}/detail/solo-leveling`,
      genres: ['Action', 'Fantasy'],
      rating: 9.8,
      totalChapters: 200,
      status: 1,
    })

    expect(schema['@context']).toBe('https://schema.org')
    const series = schema['@graph'][0] as any
    expect(series['@type']).toBe('ComicSeries')
    expect(series.name).toBe('Solo Leveling')
    expect(series.genre).toEqual(['Action', 'Fantasy'])
    expect(series.aggregateRating?.ratingValue).toBe(9.8)
    expect(series.numberOfEpisodes).toBe(200)
  })

  it('generates valid ComicIssue schema for chapter', () => {
    const schema = getChapterSchema({
      mangaTitle: 'Solo Leveling',
      chapterNumber: 50,
      chapterUrl: `${SITE_URL}/chapter/solo-leveling-50`,
      mangaUrl: `${SITE_URL}/detail/solo-leveling`,
      image: DEFAULT_OG_IMAGE,
    })

    expect(schema['@context']).toBe('https://schema.org')
    const issue = schema['@graph'][0] as any
    expect(issue['@type']).toBe('ComicIssue')
    expect(issue.issueNumber).toBe('50')
    expect(issue.isPartOf?.name).toBe('Solo Leveling')
    expect(issue.name).toContain('Chapter 50')
  })
})
