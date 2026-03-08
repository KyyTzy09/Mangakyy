import z from "zod";

export const getRecommendationComicSchema = z.object({
    format: z.enum(["manhwa", "manhua", "manga"]).optional() || "manhwa",
    page: z.number().optional() || 1,
    pageSize: z.number().optional() || 10
})

export const getPopularComicSchema = z.object({
    type: z.enum(["daily", "weekly", "all_time"]).optional() || "all_time",
    page: z.number().optional() || 1,
    pageSize: z.number().optional() || 10
})

export const getComicDetailSchema = z.object({
    mangaId: z.string()
})

export const getUpdateComicSchema = z.object({
    type: z.enum(["mirror", "project"]).optional(),
    page: z.number().optional() || 1,
    pageSize: z.number().optional() || 10
})

export const getChapterListSchema = z.object({
    mangaId: z.string(),
    sort_order: z.enum(["asc", "desc"]).optional(),
    query: z.string().optional(),
    page: z.number().optional() || 1,
    pageSize: z.number().optional() || 10
})

export const getChapterDetailSchema = z.object({
    chapterId: z.string()
})

export const getComicByGenreSchema = z.object({
    query: z.string().optional(),
    genres: z.array(z.string()).optional(),
    page: z.number().optional() || 1,
    pageSize: z.number().optional() || 10
})