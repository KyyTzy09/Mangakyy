import { shinigamiService } from "@/api/service/shinigami";
import { createTRPCRouter, publicProcedure } from "../init";

export const mangaRouter = createTRPCRouter({
    getRecommendationComic: publicProcedure.query(async () => {
        const data = await shinigamiService.getComicRecomendation("manhwa")
        return data?.data
    }),
    getPopularComic: publicProcedure.query(async () => {
        const data = await shinigamiService.getPopularComic()
        return data?.data
    })
})