"use server"

import { trpcRouter } from "@/integrations/trpc/router"
import { getComicByGenreSchema, getComicDetailSchema, getPopularComicSchema, getRecommendationComicSchema, getUpdateComicSchema } from "@/shared/schemas/shinigami.scema"
import { createServerFn } from "@tanstack/react-start"

export const getRecommendationManga = createServerFn().inputValidator(getRecommendationComicSchema).handler(async ({ context, data }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.manga.getRecommendationComic(data)
})

export const getPopularManga = createServerFn().inputValidator(getPopularComicSchema).handler(async ({ context, data }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.manga.getPopularComic(data)
})

export const getUpdateManga = createServerFn().inputValidator(getUpdateComicSchema).handler(async ({ context, data }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.manga.getUpdateComic(data)
})

export const getMangaDetail = createServerFn().inputValidator(getComicDetailSchema).handler(async ({ context, data }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.manga.getComicDetail({ mangaId: data.mangaId })
})

export const getMangaByGenre = createServerFn().inputValidator(getComicByGenreSchema).handler(async ({ context, data }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.manga.getComicByGenres(data)
})