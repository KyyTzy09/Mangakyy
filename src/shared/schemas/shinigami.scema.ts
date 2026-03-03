import z from "zod";

export const getPopularComicSchema = z.object({
    type: z.enum(["daily", "weekly", "all_time"]).optional() || "all_time",
    page: z.number().optional() || 1
})

export const getComicDetailSchema = z.object({
    mangaId: z.string()
})

export const getChapterListSchema = z.object({
    mangaId: z.string(),
    page: z.number().optional() || 1,
})

export const getChapterDetailSchema = z.object({
    chapterId: z.string()
})