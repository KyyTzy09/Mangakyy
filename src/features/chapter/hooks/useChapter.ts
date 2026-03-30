import type { ChapterDetail, ComicType } from "@/shared/interfaces";
import { saveNewComicHistory } from "@/shared/utils/history";
import { useEffect } from "react";

interface Props {
    chapterId: string
    chapter: ChapterDetail
    comic: ComicType
}


export const useChapter = ({ chapterId, chapter, comic }: Props) => {
    useEffect(() => {
        saveNewComicHistory({ comic_cover_url: comic?.cover_image_url || "", comic_id: comic?.manga_id || "", comic_title: comic?.title || "" }, { chapter_id: chapter?.chapter_id || "", chapter_number: chapter?.chapter_number || 0, thumbnail_image_url: chapter?.thumbnail_image_url || "", last_read_at: new Date() })
    }, [chapterId])
}