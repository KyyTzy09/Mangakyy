import { trpcClient } from "@/integrations/tanstack-query/root-provider"
import type { ComicType, PopularComic } from "@/shared/interfaces"
import { useQuery } from "@tanstack/react-query"

export const useGetPopularManga = (type: "daily" | "weekly" | "all_time", initialData?: PopularComic[], page?: number) => {
    return useQuery({
        queryKey: ["popular-manga", type || "all_time", page],
        queryFn: async () => {
            const data = await trpcClient.manga.getPopularComic.query({ type })
            return data?.data
        },
        initialData: initialData,
    })
}