"use server"

import { trpcRouter } from "@/integrations/trpc/router"
import { createServerFn } from "@tanstack/react-start"

export const getPopularManga = createServerFn().handler(async ({ context }) => {
    const caller = trpcRouter.createCaller(context!)
    const comic = await caller.manga.getPopular()

    return comic
})