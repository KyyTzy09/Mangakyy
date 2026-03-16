import { shinigamiService } from "@/api/service/shinigami";
import { createTRPCRouter, publicProcedure } from "../../integrations/trpc/init";
import { getComicByGenreSchema, getComicDetailSchema, getPopularComicSchema, getRecommendationComicSchema, getUpdateComicSchema } from "@/shared/schemas/shinigami.scema";

export const mangaRouter = createTRPCRouter({
    getRecommendationComic: publicProcedure.input(getRecommendationComicSchema).query(async ({ input }) => {
        return await shinigamiService.getComicRecomendation(input.format, input.page, input.pageSize)
    }),
    getPopularComic: publicProcedure.input(getPopularComicSchema).query(async ({ input }) => {
        return await shinigamiService.getPopularComic(input.type, input.page)
    }),
    getUpdateComic: publicProcedure.input(getUpdateComicSchema).query(async ({ input }) => {
        return await shinigamiService.getComicUpdate(input.type!, input.page, input.pageSize)
    }),
    getComicDetail: publicProcedure.input(getComicDetailSchema).query(async ({ input }) => {
        return await shinigamiService.getComicDetail(input.mangaId)
    }),
    getComicByGenres: publicProcedure.input(getComicByGenreSchema).query(async ({ input }) => {
        return await shinigamiService.getComicGenre(input.query, input.genres!, input.status!, input.format!, input.type!, input.inclusion, input.exclusion, input.page, input.pageSize)
    })
})