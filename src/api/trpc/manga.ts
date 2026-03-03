import { shinigamiService } from "@/api/service/shinigami";
import { createTRPCRouter, publicProcedure } from "../../integrations/trpc/init";
import { getComicDetailSchema, getPopularComicSchema } from "@/shared/schemas/shinigami.scema";

export const mangaRouter = createTRPCRouter({
    getRecommendationComic: publicProcedure.query(async () => {
        return await shinigamiService.getComicRecomendation("manhwa")
    }),
    getPopularComic: publicProcedure.input(getPopularComicSchema).query(async ({ input }) => {
        return await shinigamiService.getPopularComic(input.type, input.page)
    }),
    getUpdateComic: publicProcedure.query(async () => {
        return await shinigamiService.getComicUpdate("project")
    }),
    getComicDetail: publicProcedure.input(getComicDetailSchema).query(async ({ input }) => {
        return await shinigamiService.getComicDetail(input.mangaId)
    })
})