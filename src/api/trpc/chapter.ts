import { createTRPCRouter, publicProcedure } from "@/integrations/trpc/init";
import { getChapterDetailSchema, getChapterListSchema } from "@/shared/schemas/shinigami.scema";
import { shinigamiService } from "../service/shinigami";

export const chapterRouter = createTRPCRouter({
    getChapterList: publicProcedure.input(getChapterListSchema).query(async ({ input }) => {
        return await shinigamiService.getChapterList(input.mangaId, input.page, input.pageSize)
    }),
    getChapterDetail: publicProcedure.input(getChapterDetailSchema).query(async ({ input }) => {
        return await shinigamiService.getChapterDetail(input.chapterId)
    }),
    getSearchChapter: publicProcedure.input(getChapterListSchema).query(async ({ input }) => {
        return await shinigamiService.getSearchChapter(input.mangaId, input.page, input.pageSize, input.sort_order, input.query)
    }),
})