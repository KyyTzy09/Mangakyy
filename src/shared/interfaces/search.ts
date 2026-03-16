
export type SearchType = "genre" | "include" | "exclude" | "format" | "type" | "status"

export type SearchTaxonomyType = SearchResult[]

export interface SearchResult {
    name: string,
    type: SearchType,
    slug: string
}