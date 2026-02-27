import { createTRPCRouter, publicProcedure } from "../init";

export const mangaRouter = createTRPCRouter({
    getPopular: publicProcedure.query(async () => {
        return [{
            judul: "Haloo",
            hai: "Halo"
        }]
    })
})