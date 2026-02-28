import { createTRPCRouter, publicProcedure } from "@/integrations/trpc/init";
import { getChapterDetailSchema, getChapterListSchema } from "@/shared/schemas/shinigami.scema";
import { shinigamiService } from "../service/shinigami";
import { getChapterDetail } from "../server/chapter";

export const chapterRouter = createTRPCRouter({
    getChapterList: publicProcedure.input(getChapterListSchema).query(async ({ input }) => {
        return await shinigamiService.getChapterList(input.mangaId, input.page)
    }),
    getChapterDetail: publicProcedure.input(getChapterDetailSchema).query(async ({ input }) => {
        return await shinigamiService.getChapterDetail(input.chapterId)
    })
})