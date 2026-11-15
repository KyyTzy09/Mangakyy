/**
 * Type definitions for H18 Mode
 */

export interface H18Tag {
  id: number | string
  name: string
  type: 'tag' | 'category' | 'artist' | 'character' | 'parody' | 'language' | string
  count?: number
}

export interface H18ComicItem {
  id: string | number
  title: string
  japanese_title?: string
  cover_url: string
  thumbnail_url: string
  media_id?: string
  page_count: number
  upload_date?: string
  tags: H18Tag[]
  favorite_count?: number
}

export interface H18ComicDetail extends H18ComicItem {
  images: {
    page: number
    url: string
    thumbnail_url?: string
    width?: number
    height?: number
  }[]
}

export interface H18SearchResponse {
  books: H18ComicItem[]
  total_pages: number
  current_page: number
  per_page: number
}

export interface H18TagItem {
  id: number | string
  type: string
  name: string
  slug: string
  count: number
  description?: string | null
}

export interface H18PaginatedTagsResult {
  tags: H18TagItem[]
  total: number
  num_pages: number
  current_page: number
  per_page: number
}

export interface H18GroupedTagsResult {
  tag: H18PaginatedTagsResult
  character: H18PaginatedTagsResult
  artist: H18PaginatedTagsResult
  parody: H18PaginatedTagsResult
  group: H18PaginatedTagsResult
}
