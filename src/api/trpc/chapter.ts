import { createTRPCRouter, publicProcedure } from "@/integrations/trpc/init";
import { getChapterListSchema } from "@/shared/schemas/shinigami.scema";
import { shinigamiService } from "../service/shinigami";

export const chapterRouter = createTRPCRouter({
    getChapterList: publicProcedure.input(getChapterListSchema).query(async ({ input }) => {
        return await shinigamiService.getChapterList(input.mangaId, input.page)
    })
})