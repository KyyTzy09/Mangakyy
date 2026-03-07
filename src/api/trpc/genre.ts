import { createTRPCRouter, publicProcedure } from "@/integrations/trpc/init";
import { shinigamiService } from "../service/shinigami";

export const genreRouter = createTRPCRouter({
    getAllGenre: publicProcedure.query(async () => {
        return await shinigamiService.getGenreList()
    })
})