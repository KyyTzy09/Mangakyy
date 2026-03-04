import { trpcClient } from "@/integrations/tanstack-query/root-provider"
import type { ComicType, PopularComic } from "@/shared/interfaces"
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