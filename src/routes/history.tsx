import { CardLayoutSwitcher } from '@/features/manga/components/interacts/CardLayoutSwitcher'
import { Label } from '@/shared/shadcn/label'
import { Separator } from '@/shared/shadcn/separator'
import { getNewChapterHistories, type NewComicHistory } from '@/shared/utils/history'
import { createFileRoute } from '@tanstack/react-router'
import { History } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  const [history, setHistory] = useState<NewComicHistory[]>([])
  const [cardLayout, setCardLayout] = useState<"grid" | "list">('list')

  useEffect(() => {
    const h = getNewChapterHistories()
    setHistory(h)
  }, [])
  return (
    <div className='flex flex-col items-start justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-20 md:pt-24 p-2 px-5 gap-2 pb-16 md:pb-0'>
      <section className='flex items-center justify-between w-full gap-2'>
        <Label className='text-white font-semibold text-2xl'>
          <History className='w-6 h-6 text-primary' />
          Komik Populer
        </Label>
        <CardLayoutSwitcher value={cardLayout} onChange={setCardLayout} />
      </section>
      <Separator className='bg-blue-400/20' />
      <section className='grid grid-cols-6 items-center justify-start w-full gap-2'>
        {history.map((h, i) => (
          <article className='w-full'>
            <img src={h.comic_cover_url} alt="no-image" className='w-full h-60 object-cover' />
          </article>
        ))}
      </section>
    </div>
  )
}
