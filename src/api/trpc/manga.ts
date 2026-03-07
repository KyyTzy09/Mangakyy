import { shinigamiService } from "@/api/service/shinigami";
import { createTRPCRouter, publicProcedure } from "../../integrations/trpc/init";
import { getComicByGenreSchema, getComicDetailSchema, getPopularComicSchema, getRecommendationComicSchema } from "@/shared/schemas/shinigami.scema";

export const mangaRouter = createTRPCRouter({
    getRecommendationComic: publicProcedure.input(getRecommendationComicSchema).query(async ({ input }) => {
        return await shinigamiService.getComicRecomendation(input.format, input.page, input.pageSize)
    }),
    getPopularComic: publicProcedure.input(getPopularComicSchema).query(async ({ input }) => {
        return await shinigamiService.getPopularComic(input.type, input.page)
    }),
    getUpdateComic: publicProcedure.query(async () => {
        return await shinigamiService.getComicUpdate("project")
    }),
    getComicDetail: publicProcedure.input(getComicDetailSchema).query(async ({ input }) => {
        return await shinigamiService.getComicDetail(input.mangaId)
    }),
    getComicByGenres: publicProcedure.input(getComicByGenreSchema).query(async ({ input }) => {
        return await shinigamiService.getComicGenre(input.query, input.genres!, input.page, input.pageSize)
    })
})