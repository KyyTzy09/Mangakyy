import { trpcClient } from "@/integrations/tanstack-query/root-provider"
import type { APIResponse, ChapterList } from "@/shared/interfaces"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

export const useGetChapterList = (initialData: APIResponse<ChapterList[]>, mangaId: string, page?: number) => {
    return useQuery({
        queryKey: ["chapter-list", mangaId, page],
        queryFn: async () => {
            return await trpcClient.chapter.getChapterList.query({ mangaId, page })
        },
        placeholderData: (prev) => prev ?? initialData
    })
}

export const useGetInfiniteChapter = (mangaId: string, initialData?: APIResponse<ChapterList[]>) => {
    return useInfiniteQuery({
        queryKey: ["chapter", mangaId],
        queryFn: async ({ pageParam = 1 }) => {
            return await trpcClient.chapter.getChapterList.query({ page: pageParam, mangaId })
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            const meta = lastPage?.meta

            if (!meta) return undefined

            return meta.page < meta.total_page
                ? meta.page + 1
                : undefined
        },
        initialData: initialData
            ? {
                pages: [initialData],
                pageParams: [1]
            }
            : undefined
    })
}

export const useSearchChapter = (mangaId: string, query: string) => {
    return useQuery({
        queryKey: ["search-chapter", mangaId, query],
        queryFn: async () => {
            return await trpcClient.chapter.getSearchChapter.query({ mangaId, query })
        },
    })
}