import { Button } from '@/shared/shadcn/button'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import type { ChapterHistory } from '@/shared/utils/history'
import { useNavigate } from '@tanstack/react-router'

interface Props {
    history: ChapterHistory
}

export default function ChapterHistoryCard({ history }: Props) {
    const navigate = useNavigate()
    return (
        <div className="w-full flex items-center justify-between bg-primary/20 border border-primary text-white rounded-xl px-6 py-4 shadow-md mb-5">
            <div className="flex flex-col">
                <span className="text-sm opacity-80">Terakhir Dibaca </span>
                <h2 className="text-sm md:text-lg font-semibold">Chapter {history?.chapterNumber}</h2>
                <span className="text-xs opacity-70">{formatRelativeTime(history?.lastReadAt)}</span>
            </div>
            <Button
                onClick={() => navigate({ to: "/chapter/$chapterId", params: { chapterId: history?.chapterId } })}
                className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
                Lanjutkan
            </Button>
        </div>
    )
}
