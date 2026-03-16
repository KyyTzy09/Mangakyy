import { trpcClient } from "@/integrations/tanstack-query/root-provider"
import type { APIResponse, ComicType, PopularComic, UpdateComic } from "@/shared/interfaces"
import { useQuery } from "@tanstack/react-query"

export const useGetRecommendationManga = (format: "manga" | "manhua" | "manhwa", initialData?: ComicType[], page?: number) => {
    return useQuery({
        queryKey: ["popular-manga", format || "manga", page],
        queryFn: async () => {
            const data = await trpcClient.manga.getRecommendationComic.query({ format, page, pageSize: 15 })
            return data?.data
        },
        initialData: initialData,
    })
}

export const useGetPopularManga = (type: "daily" | "weekly" | "all_time", initialData?: PopularComic[], page?: number, pageSize?: number) => {
    return useQuery({
        queryKey: ["popular-manga", type || "all_time", page],
        queryFn: async () => {
            const data = await trpcClient.manga.getPopularComic.query({ type, page, pageSize })
            return data?.data
        },
        initialData: initialData,
    })
}

export const useGetMangaByGenre = (initialData: APIResponse<ComicType[]>, query: string, genres: string[], formats: string[], types: string[], status: string[], inclusion: "or" | "and", exclusion: "or" | "and", page?: number) => {
    return useQuery({
        queryKey: ["genres-manga", genres, query, status, formats, types, inclusion, exclusion, page],
        queryFn: async () => {
            return await trpcClient.manga.getComicByGenres.query({ query, genres, format: formats, type: types, status, inclusion, exclusion, page })
        },
        placeholderData: (prev) => prev ?? initialData
    })
}

export const useGetUpdateManga = (initialData: APIResponse<UpdateComic[]>, type: "mirror" | "project", page?: number, pageSize?: number) => {
    return useQuery({
        queryKey: ["update-manga", type, page],
        queryFn: async () => {
            return await trpcClient.manga.getUpdateComic.query({ type, page, pageSize })
        },
        placeholderData: (prev) => prev ?? initialData
    })
}