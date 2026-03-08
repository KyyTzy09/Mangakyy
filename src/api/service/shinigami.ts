import { apiClient } from "@/shared/http/apiClient";
import type { APIResponse, ChapterDetail, ChapterList, ComicType, PopularComic, TaxonomyItem, UpdateComic } from "@/shared/interfaces";

export class ShinigamiService {
    public async getComicRecomendation(format: "manhwa" | "manhua" | "manga" = "manga", page: number = 1, pageSize: number = 10) {
        return await apiClient<APIResponse<ComicType[]>>({ url: `/manga/list?format=${format}&page=${page}&page_size=${pageSize}&is_recommended=true&sort=latest&sort_order=desc`, method: "get" })
    }

    public async getComicUpdate(type: string, page: number = 1, pageSize: number = 19) {
        return await apiClient<APIResponse<UpdateComic[]>>({ url: `/manga/list?type=${type}&page=${page}&page_size=${pageSize}&is_update=true&sort=latest&sort_order=desc` })
    }

    public async getComicStatus(status: string) {
        return await apiClient<APIResponse<ComicType[]>>({ url: `/manga/list?page=1&page_size=24&genre_include_mode=or&genre_exclude_mode=or&status=${status}&sort=latest&sort_order=desc` })
    }

    public async getGenreList() {
        return await apiClient<APIResponse<TaxonomyItem[]>>({
            url: `/genre/list`
        });
    }

    public async getComicGenre(query: string = "", genres: string[], page: number = 1, pageSize: number = 19) {
        const genre = genres.join(",")
        return await apiClient<APIResponse<ComicType[]>>({ url: `/manga/list?page=${page}&page_size=${pageSize}&genre_include=${genre}&genre_include_mode=or&genre_exclude_mode=or&sort=latest&sort_order=desc&q=${query}` })
    }
    // https://api.shngm.io/v1/manga/list?page=1&page_size=24&genre_include_mode=or&genre_exclude_mode=or&sort=latest&sort_order=desc&q=tes
    public async getComicSearch(query: string, page: number = 1, pageSize: number = 19) {
        return await apiClient<APIResponse<ComicType[]>>({ url: `/manga/list?q=${query}&page=${page}&page_size=${pageSize}&sort=latest&sort_order=desc` })
    }

    public async getPopularComic(filter: "daily" | "weekly" | "all_time" = "all_time", page: number = 1, pageSize: number = 16) {
        return await apiClient<APIResponse<PopularComic[]>>({ url: `/manga/top?filter=${filter}&page=${page}&page_size=${pageSize}` })
    }

    public async getComicDetail(comicId: string) {
        return await apiClient<APIResponse<ComicType>>({ url: `/manga/detail/${comicId}` })
    }

    public async getChapterList(comicId: string, page: number = 1, pageSize: number = 24, sort_order: "asc" | "desc" = "desc") {
        return await apiClient<APIResponse<ChapterList[]>>({ url: `/chapter/${comicId}/list?page=${page}&page_size=${pageSize}&sort_by=chapter_number&sort_order=${sort_order}` })
    }

    public async getSearchChapter(comicId: string, page: number = 1, pageSize: number = 24, sort_order: "asc" | "desc" = "desc", query: string = "") {
        return await apiClient<APIResponse<ChapterList[]>>({ url: `/chapter/${comicId}/list?page=${page}&page_size=${pageSize}&sort_by=chapter_number&sort_order=${sort_order}&search=${Number(query)}` })
    }
    // https://api.shngm.io/v1/chapter/3a22fb56-e358-4ced-a7b1-79acde9d6910/list?page=1&page_size=24&sort_by=chapter_number&sort_order=desc&search=10

    public async getChapterDetail(chapterId: string) {
        return await apiClient<APIResponse<ChapterDetail>>({ url: `/chapter/detail/${chapterId}` })
    }
}

export const shinigamiService = new ShinigamiService()