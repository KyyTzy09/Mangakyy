import PopularCard from '@/features/manga/components/cards/PopularCard'
import { useGetPopularManga } from '@/features/manga/hooks/MangaQuery'
import PaginationSection from '@/shared/components/reusable/pagination'
import { Label } from '@/shared/shadcn/label'
import { useLoaderData } from '@tanstack/react-router'
import { Flame } from 'lucide-react'
import { useState } from 'react'

export default function PopularPage() {
  const { popular } = useLoaderData({ from: '/popular' })
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isPending } = useGetPopularManga(
    'all_time',
    popular?.data,
    currentPage,
    20,
  )

  return (
    <div className="font-primary flex flex-col w-full min-h-screen px-6 py-24 gap-5 pb-16 md:pb-0">
      <header className="flex flex-col md:flex-row items-center justify-between w-full gap-2">
        <Label className="text-white font-semibold text-2xl">
          <Flame className="w-6 h-6 text-primary" />
          Komik Populer
        </Label>
      </header>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 w-full gap-3">
        {!isPending &&
          data?.map((item, i) => (
            <PopularCard key={i} index={i} data={item} />
          ))}
      </section>
      <PaginationSection
        totalPage={popular?.meta?.total_page || 1}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}
