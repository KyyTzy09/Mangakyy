import { trpcRouter } from "@/integrations/trpc/router";
import { getChapterListSchema } from "@/shared/schemas/shinigami.scema";
import { createServerFn } from "@tanstack/react-start";

export const getChapterList = createServerFn().inputValidator(getChapterListSchema).handler(async ({ context, data }) => {
    const caller = trpcRouter.createCaller(context!)
    return await caller.chapter.getChapterList(data)
})