export interface ComicResponseType {
    retcode: number;
    message: string;
    meta: Meta;
    data: ComicType[];
    facet: Facet;
}

export interface Meta {
    request_id: string;
    timestamp: number;
    process_time: string;
    page: number;
    page_size: number;
    total_page: number;
    total_record: number;
}

export interface ComicType {
    alternative_title: string;
    bookmark_count: number;
    country_id: string;
    cover_image_url: string;
    cover_portrait_url: string;
    created_at: string;
    deleted_at: string | null;
    description: string;
    is_recommended: boolean;
    latest_chapter_id: string;
    latest_chapter_number: number;
    latest_chapter_time: string;
    manga_id: string;
    rank: number;
    release_year: string;
    status: number;
    taxonomy: Taxonomy;
    title: string;
    updated_at: string;
    user_rate: number;
    view_count: number;
}

export interface Taxonomy {
    Artist: TaxonomyItem[];
    Author: TaxonomyItem[];
    Format: TaxonomyItem[];
    Genre: TaxonomyItem[];
    Type: TaxonomyItem[];
}

export interface TaxonomyItem {
    name: string;
    slug: string;
}

export interface Facet {
    release_year: Record<string, number>;
    "taxonomy.Artist.name": Record<string, number>;
    "taxonomy.Artist.slug": Record<string, number>;
    "taxonomy.Author.name": Record<string, number>;
    "taxonomy.Author.slug": Record<string, number>;
    "taxonomy.Format.name": Record<string, number>;
    "taxonomy.Format.slug": Record<string, number>;
    "taxonomy.Genre.name": Record<string, number>;
    "taxonomy.Genre.slug": Record<string, number>;
    "taxonomy.Type.name": Record<string, number>;
    "taxonomy.Type.slug": Record<string, number>;
}