import { createFileRoute } from '@tanstack/react-router'
import { getComicGenres } from '@/api/server/genre'
import { getMangaByGenre } from '@/api/server/manga'
import GenreListSection from '@/features/genre/components/section/GenreListSection'
import SelectedGenreSection from '@/features/genre/components/section/SelectedGenreSection'
import { useSelectGenre } from '@/features/genre/hooks/useSelectGenre'
import GenreMangaCard from '@/features/manga/components/cards/GenreMangaCard'
import PaginationSection from '@/shared/components/reusable/pagination'
import type { TaxonomyItem } from '@/shared/interfaces'
import { Activity, useState } from 'react'
import { useGetMangaByGenre } from '@/features/manga/hooks/MangaQuery'
import GenreMangaCardSkeleton from '@/features/manga/components/skeletons/GenreMangaCardSkeleton'
import GenreMangaCardL from '@/features/manga/components/cards/GenreMangaCardL'
import GenreSearchSection from '@/features/genre/components/section/GenreSearchSection'
import GenreFilterDropdown from '@/features/genre/components/interacts/GenreFilterDropdown'

export const Route = createFileRoute('/explore')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Explore - Mangakyy",
      },
      {
        name: "description",
        content:
          "Mangakyy adalah platform untuk membaca manga, manhwa, dan manhua gratis dengan update cepat dan koleksi lengkap. Temukan berbagai genre seperti action, romance, fantasy, dan banyak lagi dengan kualitas terbaik.",
      },
      {
        name: "keywords",
        content:
          "manga, manhwa, manhua, baca manga online, manga gratis, manhwa gratis, manhua gratis, komik online, mangakyy",
      },
      {
        name: "author",
        content: "Mangakyy",
      },
      {
        name: "robots",
        content: "index, follow",
      },

      // Open Graph (buat preview Discord, Facebook, dll)
      {
        property: "og:title",
        content: "Explore - Mangakyy",
      },
      {
        property: "og:description",
        content:
          "Baca manga, manhwa, dan manhua gratis dengan update terbaru dan koleksi lengkap hanya di Mangakyy.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: "Mangakyy",
      },
      {
        property: "og:image",
        content: "/mangakyy-logo.png"
      },
      {
        property: "og:url",
        content: "https://mangakyy.my.id/explore",
      },

      // Twitter card
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Explore - Mangakyy",
      },
      {
        name: "twitter:description",
        content:
          "Platform baca manga, manhwa, dan manhua gratis dengan update cepat dan kualitas terbaik.",
      },
      {
        name: "twitter:image",
        content: "/mangakyy-logo.png"
      },
      {
        name: "twitter:url",
        content: "https://mangakyy.my.id/explore",
      }
    ]
  }),
  loader: async () => {
    return {
      genres: await getComicGenres(),
      comics: await getMangaByGenre({ data: { query: "", genres: [], page: 1 } })
    }
  }
})

function RouteComponent() {
  const { genres, comics } = Route.useLoaderData()

  const [openFilter, setOpenFilter] = useState<boolean>(false)
  const [selectedGenres, setSelectedGenres] = useState<TaxonomyItem[]>([])
  const [query, setQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [cardLayout, setCardLayout] = useState<"grid" | "list">("grid")

  const { data: comicsData, isPending } = useGetMangaByGenre(comics!, query, selectedGenres.map((g) => g.slug), currentPage)
  const { isSelectedGenre, unselectGenres } = useSelectGenre(selectedGenres, setSelectedGenres)
  const totalPage = comicsData?.meta.total_page

  return (
    <div className='flex items-start justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-20 md:pt-24 p-2 gap-2 pb-16 md:pb-0'>
      <aside className='hidden md:flex flex-col w-70 h-fit max-h-[85vh] sticky top-24 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 gap-5 overflow-y-auto'>
        <GenreListSection selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} data={genres?.data || []} />
      </aside>
      <main className='flex flex-col items-center justify-start w-full md:w-3/4 min-h-screen bg-black/20 backdrop-blur-sm border-gray-200/50 border rounded-md p-3 px-3 md:px-5 gap-5'>
        {/* Search */}
        <GenreSearchSection
          cardLayout={cardLayout}
          setCardLayout={setCardLayout}
          setQuery={setQuery}
          setOpenFilter={setOpenFilter}
        />
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
        <Activity mode={!isPending && comicsData?.data?.length! > 0 ? "visible" : "hidden"}>
          <section className='flex items-center w-full'>
            <Activity mode={cardLayout === "grid" ? "visible" : "hidden"}>
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 w-full max-h-screen overflow-y-auto gap-3'>
                {comicsData?.data?.length! > 0 && !isPending ? comicsData?.data?.map((data, i) => (
                  <GenreMangaCard key={i} data={data} index={i} />
                )) : <GenreMangaCardSkeleton count={15} />}
              </div>
            </Activity>
            <Activity mode={cardLayout === "list" ? "visible" : "hidden"}>
              <div className="grid grid-cols-1 md:grid-cols-2 max-h-screen gap-3 overflow-y-auto">
                {comicsData?.data?.map((comic, index) => (
                  <GenreMangaCardL
                    key={comic.manga_id}
                    data={comic}
                    index={index}
                  />
                ))}
              </div>
            </Activity>
          </section>
        </Activity>

        <PaginationSection
          currentPage={currentPage!}
          setCurrentPage={setCurrentPage}
          totalPage={totalPage!}
        />
      </main>
      <GenreFilterDropdown
        isOpen={openFilter}
        setIsOpen={setOpenFilter}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        genres={genres?.data || []}
      />
    </div>
  )
}
