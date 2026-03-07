import { getComicGenres } from '@/api/server/genre'
import { getMangaByGenre } from '@/api/server/manga'
import GenreListSection from '@/features/genre/components/section/GenreListSection'
import SelectedGenreSection from '@/features/genre/components/section/SelectedGenreSection'
import { useSelectGenre } from '@/features/genre/hooks/useSelectGenre'
import GenreMangaCard from '@/features/manga/components/cards/GenreMangaCard'
import PaginationSection from '@/shared/components/reusable/pagination'
import type { TaxonomyItem } from '@/shared/interfaces'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Label } from '@/shared/shadcn/label'
import { countryCodeToFlag } from '@/shared/utils/countryConverter'
import { formatCompactNumber } from '@/shared/utils/formater'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Eye, Search, X } from 'lucide-react'
import { Activity, useState } from 'react'

export const Route = createFileRoute('/genre')({
  component: RouteComponent,
  loader: async () => {
    return {
      genres: await getComicGenres(),
      comics: await getMangaByGenre({ data: { query: "", genres: [], page: 1 } })
    }
  }
})

function RouteComponent() {
  const [selectedGenres, setSelectedGenres] = useState<TaxonomyItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const { isSelectedGenre, unselectGenres } = useSelectGenre(selectedGenres, setSelectedGenres)
  const { genres, comics } = Route.useLoaderData()
  const totalPage = comics?.meta.total_page

  return (
    <div className='flex items-start justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-20 md:pt-24 p-2 gap-2'>
      <aside className='hidden md:flex flex-col items-center justify-start w-1/4 h-auto min-h-100 bg-black/20 backdrop-blur-sm border-gray-200/50 border rounded-md p-3 px-5 gap-2'>
        <GenreListSection selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} data={genres?.data || []} />
      </aside>
      <main className='flex flex-col items-center justify-start w-full md:w-3/4 min-h-screen bg-black/20 backdrop-blur-sm border-gray-200/50 border rounded-md p-3 px-3 md:px-5 gap-5'>
        <section className='flex items-center w-full'>
          <div className='flex text-gray-400 items-center justify-between w-40 md:w-60 h-full rounded-md bg-gray-600/20 backdrop-blur-sm pl-2 gap-1'>
            <Button className='flex items-center justify-center w-5 h-full rounded-md bg-transparent hover:bg-transparent text-white px-0'>
              <Search className='w-4 h-4' />
            </Button>
            <div className='flex items-center justify-start w-[95%] h-10'>
              <Input placeholder="Cari Komik" className='w-full h-full aria-selected:ring-0 focus-visible:ring-0 border-0 pl-1 text-[12px] md:text-sm' />
            </div>
          </div>
        </section>
        {/* Genre */}
        <Activity mode={selectedGenres.length > 0 ? "visible" : "hidden"}>
          <SelectedGenreSection
            isSelected={isSelectedGenre}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            unselectGenres={unselectGenres}
          />
        </Activity>
        {/* manga */}
        <section className='flex items-center w-full'>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 w-full max-h-screen overflow-y-auto gap-3'>
            {comics?.data.map((data, i) => (
              <GenreMangaCard key={i} data={data} index={i} />
            ))}
          </div>
        </section>
        <PaginationSection
          currentPage={currentPage!}
          setCurrentPage={setCurrentPage}
          totalPage={totalPage!}
        />
      </main>
    </div>
  )
}
