import { Button } from '@/shared/shadcn/button'
import { formatRelativeTime } from '@/shared/utils/dateConverter'
import type { NewChapterHistory } from '@/shared/utils/history'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'

interface Props {
  history: NewChapterHistory
}

export default function ChapterHistoryCard({ history }: Props) {
  const navigate = useNavigate()

  return (
    <div className="w-full flex items-center justify-between bg-primary/10 border border-primary/30 text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-primary/5 mb-5 backdrop-blur-sm">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="p-2.5 bg-primary/20 rounded-xl text-primary border border-primary/30">
          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-primary font-semibold uppercase tracking-wider">
            Terakhir Dibaca
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Chapter {history?.chapter_number}
          </h3>
          <span className="text-xs text-slate-400">
            {formatRelativeTime(history?.last_read_at)}
          </span>
        </div>
      </div>
      <Button
        onClick={() =>
          navigate({
            to: '/chapter/$chapterId',
            params: { chapterId: history?.chapter_id },
          })
        }
        className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 sm:px-6 py-2.5 rounded-xl shadow-md shadow-primary/20 transition cursor-pointer"
      >
        Lanjutkan
      </Button>
    </div>
  )
}
