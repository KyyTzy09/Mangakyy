import z from "zod";

export const getComicDetailSchema = z.object({
    mangaId: z.string()
})