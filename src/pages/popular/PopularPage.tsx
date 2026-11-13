import PopularCard from '@/features/manga/components/cards/PopularCard'
import { useGetPopularManga } from '@/features/manga/hooks/MangaQuery'
import PaginationSection from '@/shared/components/reusable/pagination'
import { Label } from '@/shared/shadcn/label'
import { useLoaderData, useNavigate, useSearch } from '@tanstack/react-router'
import { Flame } from 'lucide-react'

export default function PopularPage() {
  const { popular } = useLoaderData({ from: '/popular' })
  const search = useSearch({ from: '/popular' })
  const navigate = useNavigate({ from: '/popular' })

  const currentPage = Number(search?.page) > 0 ? Number(search.page) : 1

  const setCurrentPage = (target: number | ((prev: number) => number)) => {
    const newPage = typeof target === 'function' ? target(currentPage) : target
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    })
  }

  const { data, isPending } = useGetPopularManga(
    'all_time',
    popular?.data,
    currentPage,
    20,
  )

  return (
    <div className="relative font-primary flex flex-col w-full min-h-screen px-6 py-24 gap-5 pb-16 md:pb-0 overflow-x-hidden">
      {/* Fixed Ambient Watermark Logo */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden"
      >
        <img
          src="/mangakyy-logo.png"
          alt=""
          className="w-[320px] sm:w-[480px] md:w-[600px] max-w-[85vw] object-contain opacity-[0.045] select-none pointer-events-none transform-gpu will-change-transform"
          loading="eager"
          decoding="async"
        />
      </div>

      <header className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full gap-2">
        <Label className="text-white font-semibold text-2xl">
          <Flame className="w-6 h-6 text-primary" />
          Komik Populer
        </Label>
      </header>
      <section className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 w-full gap-3">
        {!isPending &&
          data?.map((item, i) => (
            <PopularCard key={i} index={i} data={item} />
          ))}
      </section>
      <div className="relative z-10">
        <PaginationSection
          totalPage={popular?.meta?.total_page || 1}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  )
}
