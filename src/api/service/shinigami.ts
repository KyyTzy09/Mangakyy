import { apiClient } from "@/shared/http/apiClient";
import type { APIResponse, ChapterDetail, ChapterList, ComicType, PopularComic, TaxonomyItem, UpdateComic } from "@/shared/interfaces";

export class ShinigamiService {
    public async getComicRecomendation(format: string) {
        return await apiClient<APIResponse<ComicType[]>>({ url: `/manga/list?format=${format}&page=1&page_size=10&is_recommended=true&sort=latest&sort_order=desc`, method: "get" })
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


    public async getComicGenre(genre: string) {
        return await apiClient<APIResponse<ComicType[]>>({ url: `/manga/list?page=1&page_size=24&genre_include=${genre}&genre_include_mode=or&genre_exclude_mode=or&sort=latest&sort_order=desc` })
    }

    public async getPopularComic(page: number = 1, pageSize: number = 16) {
        return await apiClient<APIResponse<PopularComic[]>>({ url: `/manga/top?filter=all_time&page=${page}&page_size=${pageSize}` })
    }

    public async getComicDetail(comicId: string) {
        return await apiClient<APIResponse<ComicType>>({ url: `/manga/detail/${comicId}` })
    }
    public async getChapterList(comicId: string, page: number = 1, pageSize: number = 24) {
        return await apiClient<APIResponse<ChapterList[]>>({ url: `/chapter/${comicId}/list?page=${page}&page_size=${pageSize}&sort_by=chapter_number&sort_order=desc` })

    }

    public async getChapterDetail(chapterId: string) {
        return await apiClient<APIResponse<ChapterDetail>>({ url: `/chapter/detail/${chapterId}` })

    }
}

export const shinigamiService = new ShinigamiService()