import { trpcRouter } from "@/integrations/trpc/router"
import { createServerFn } from "@tanstack/react-start"

export const getComicGenres = createServerFn().handler(async ({ context }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.genre.getAllGenre()
})