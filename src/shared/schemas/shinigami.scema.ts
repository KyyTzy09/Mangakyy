import z from "zod";

export const getComicDetailSchema = z.object({
    mangaId: z.string()
})

export const getChapterListSchema = z.object({
    mangaId: z.string(),
    page: z.number().optional() || 1,
})