import { getComicGenres } from '@/api/server/genre'
import GenreListSection from '@/features/genre/components/section/GenreListSection'
import { useSelectGenre } from '@/features/genre/hooks/useSelectGenre'
import type { TaxonomyItem } from '@/shared/interfaces'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { createFileRoute } from '@tanstack/react-router'
import { Search, X } from 'lucide-react'
import { Activity, useState } from 'react'

export const Route = createFileRoute('/genre')({
  component: RouteComponent,
  loader: async () => {
    return {
      genres: await getComicGenres()
    }
  }
})

function RouteComponent() {
  const [selectedGenres, setSelectedGenres] = useState<TaxonomyItem[]>([])
  const { isSelectedGenre, unselectGenres } = useSelectGenre(selectedGenres, setSelectedGenres)
  const { genres } = Route.useLoaderData()

  return (
    <div className='flex items-start justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-24 p-4 gap-2'>
      <aside className='hidden md:flex flex-col items-center justify-start w-1/4 h-auto min-h-100 bg-black/20 backdrop-blur-sm border-gray-200/50 border rounded-md p-3 px-5 gap-2'>
        <GenreListSection selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} data={genres?.data || []} />
      </aside>
      <main className='flex flex-col items-center justify-start w-full md:w-3/4 min-h-screen bg-black/20 backdrop-blur-sm border-gray-200/50 border rounded-md p-3 px-5 gap-5'>
        <section className='flex items-center w-full'>
          <div className='flex text-gray-400 items-center justify-between w-40 md:w-60 h-full rounded-md bg-gray-600/20 backdrop-blur-sm pl-2 gap-1'>
            <Button className='flex items-center justify-center w-5 h-full rounded-md bg-transparent hover:bg-transparent text-white px-0'>
              <Search className='w-4 h-4' />
            </Button>
            <div className='flex items-center justify-start w-[95%]'>
              <Input placeholder="Cari Komik" className='w-full h-full aria-selected:ring-0 focus-visible:ring-0 border-0 pl-1 text-[12px] md:text-sm' />
            </div>
          </div>
        </section>
        {/* Genre */}
        <Activity mode={selectedGenres.length > 0 ? "visible" : "hidden"}>
          <section className='flex flex-row w-full'>
            <div className='flex flex-wrap items-center justify-start w-full gap-2 max-h-32 overflow-y-auto'>
              {selectedGenres?.map(({ name, slug }, i) => (
                <Badge
                  key={i}
                  onClick={() => unselectGenres(slug)}
                  className={`flex items-center justify-center h-10 rounded-md border cursor-pointer transition
                            ${isSelectedGenre(slug)
                      ? "border-primary bg-primary/20 text-white"
                      : "border-gray-400 bg-gray-600/20 text-gray-200 hover:opacity-75"}`
                  }
                >
                  {name}
                  <X className='w-6 h-6' strokeWidth={3} />
                </Badge>
              ))}
            </div>
          </section>
        </Activity>
        {/* manga */}
        <section className='flex items-center w-full'>
        </section>
      </main>
    </div>
  )
}
