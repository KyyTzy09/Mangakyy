import { shinigamiService } from "@/api/service/shinigami";
import { createTRPCRouter, publicProcedure } from "../../integrations/trpc/init";
import { getComicDetailSchema } from "@/shared/schemas/shinigami.scema";

export const mangaRouter = createTRPCRouter({
    getRecommendationComic: publicProcedure.query(async () => {
        const data = await shinigamiService.getComicRecomendation("manhwa")
        return data?.data
    }),
    getPopularComic: publicProcedure.query(async () => {
        const data = await shinigamiService.getPopularComic()
        return data?.data
    }),
    getUpdateComic: publicProcedure.query(async () => {
        const data = await shinigamiService.getComicUpdate("project")
        return data
    }),
    getComicDetail: publicProcedure.input(getComicDetailSchema).query(async ({ input }) => {
        const data = await shinigamiService.getComicDetail(input.mangaId)
        return await data
    })
})