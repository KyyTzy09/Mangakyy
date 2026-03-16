
export type SearchType = "genre" | "format" | "type" | "status"

export type SearchTaxonomyType = SearchResult[]

export interface SearchResult {
    name: string,
    type: SearchType,
    slug: string
}