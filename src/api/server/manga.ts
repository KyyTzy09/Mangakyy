"use server"

import { trpcRouter } from "@/integrations/trpc/router"
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