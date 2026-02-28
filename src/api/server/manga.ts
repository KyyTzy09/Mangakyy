"use server"

import { trpcRouter } from "@/integrations/trpc/router"
import { getComicDetailSchema } from "@/shared/schemas/shinigami.scema"
import { createServerFn } from "@tanstack/react-start"

export const getRecommendationManga = createServerFn().handler(async ({ context }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.manga.getRecommendationComic()
})

export const getPopularManga = createServerFn().handler(async ({ context }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.manga.getPopularComic()
})

export const getUpdateManga = createServerFn().handler(async ({ context }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.manga.getUpdateComic()
})

export const getMangaDetail = createServerFn().inputValidator(getComicDetailSchema).handler(async ({ context, data }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.manga.getComicDetail({ mangaId: data.mangaId })
})