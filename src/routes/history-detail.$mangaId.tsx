import SortHistoryButton, { type SortType } from '@/features/history/components/buttons/SortHistoryButton'
import ChapterHistoryCard from '@/features/history/components/cards/ChapterHistoryCard'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import { Separator } from '@/shared/shadcn/separator'
import { getHistoryByComicId, type NewChapterHistory, type NewComicHistory } from '@/shared/utils/history'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeft, History } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/history-detail/$mangaId')({
  component: RouteComponent,
})


function RouteComponent() {
  const params = Route.useParams();
  const router = useRouter();

  const history = getHistoryByComicId(params.mangaId)
  const [sortedChapters, setSortedChapters] = useState<NewChapterHistory[]>(history?.chapters || [])
  const sortChapters = (sortType: SortType) => {
    if (!history) return

    const chapters = [...history.chapters]

    const sorted = chapters.sort((a, b) => {
      const timeA = new Date(a.last_read_at).getTime()
      const timeB = new Date(b.last_read_at).getTime()

      return sortType === "newest" ? timeA - timeB : timeB - timeA
    })

    setSortedChapters(sorted)
  }
  return (
    <div className='flex flex-col items-start justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-20 md:pt-24 p-2 px-5 gap-2 md:gap-5 pb-16 md:pb-0'>
      <section className="flex items-center justify-between w-full gap-2">
        <Label className="text-white font-semibold text-2xl">
          <History className="w-6 h-6 text-primary" />
          {history?.comic_title || '...'}
        </Label>
        <Button
          onClick={() => router.history.back()}
          className="hover:bg-blue-400"
        >
          <ArrowLeft className="flex items-center justify-center font-primary" />
          Kembali
        </Button>
      </section>
      <Separator className='bg-primary/50' />
      <section className='flex items-center justify-between w-full'>
        <p className='text-sm text-gray-400'>Chapter yang sudah dibaca:</p>
        <SortHistoryButton onChange={(type) => sortChapters(type)} />
      </section>
      <section className='grid grid-cols-1 sm:grid-cols-4 items-start justify-start w-full gap-4'>
        {sortedChapters?.map((chapter, i) => (
          <ChapterHistoryCard key={i} history={history as NewComicHistory} chapter={chapter} index={i} />
        ))}
      </section>
    </div>
  )
}
