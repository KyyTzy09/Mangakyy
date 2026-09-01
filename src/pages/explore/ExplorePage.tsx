import ExploreSidebar from '@/features/explore/components/ExploreSidebar'
import GenreFilterDropdown from '@/features/explore/components/interacts/GenreFilterDropdown'
import GenreListSection from '@/features/explore/components/section/GenreListSection'
import GenreSearchSection from '@/features/explore/components/section/GenreSearchSection'
import SelectedGenreSection from '@/features/explore/components/section/SelectedGenreSection'
import SelectFormatSection from '@/features/explore/components/section/SelectFormatSection'
import SelectStatussection from '@/features/explore/components/section/SelectStatusSection'
import SelectTypesection from '@/features/explore/components/section/SelectTypeSection'
import { useExplore } from '@/features/explore/hooks/useExplore'
import { useSelectGenre } from '@/features/explore/hooks/useSelectGenre'
import GenreMangaCard from '@/features/manga/components/cards/GenreMangaCard'
import GenreMangaCardL from '@/features/manga/components/cards/GenreMangaCardL'
import GenreMangaCardSkeleton from '@/features/manga/components/skeletons/GenreMangaCardSkeleton'
import { useGetMangaByGenre } from '@/features/manga/hooks/MangaQuery'
import PaginationSection from '@/shared/components/reusable/pagination'
import { useLoaderData } from '@tanstack/react-router'
import { Activity } from 'react'

export default function ExplorePage() {
  const { genres, comics } = useLoaderData({ from: '/explore' })

  const {
    openFilter,
    setOpenFilter,
    selectedSearch,
    setSelectedSearch,
    query,
    setQuery,
    currentPage,
    setCurrentPage,
    cardLayout,
    setCardLayout,
    inclusionMode,
    setInclusionMode,
    exclusionMode,
    setExclusionMode,
    selectedGenres,
    selectedTypes,
    selectedStatus,
    selectedFormats,
  } = useExplore()

  const { data: comicsData, isPending } = useGetMangaByGenre(
    comics!,
    query,
    selectedGenres,
    selectedFormats,
    selectedTypes,
    selectedStatus,
    inclusionMode.slug as 'or' | 'and',
    exclusionMode.slug as 'or' | 'and',
    currentPage,
  )

  const { isSelected, unselectGenres } = useSelectGenre(
    selectedSearch,
    setSelectedSearch,
  )
  const totalPage = comicsData?.meta.total_page

  return (
    <div className="flex items-start justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-20 md:pt-24 p-2 gap-2 pb-16 md:pb-0">
      {/* Sidebar */}
      <ExploreSidebar
        genres={genres?.data || []}
        selectedSearch={selectedSearch}
        setSelectedSearch={setSelectedSearch}
        inclusionMode={inclusionMode}
        exclusionMode={exclusionMode}
        setInclusionMode={setInclusionMode}
        setExclusionMode={setExclusionMode}
      />
      <main className="flex flex-col items-center justify-start w-full md:w-3/4 min-h-screen bg-black/20 backdrop-blur-sm border-gray-200/50 border rounded-md p-3 px-3 md:px-5 gap-5">
        {/* Search */}
        <GenreSearchSection
          cardLayout={cardLayout}
          setCardLayout={setCardLayout}
          setQuery={setQuery}
          setOpenFilter={setOpenFilter}
        />

        {/* Selected Items */}
        <Activity mode={selectedSearch.length > 0 ? 'visible' : 'hidden'}>
          <SelectedGenreSection
            isSelected={isSelected}
            selectedGenres={selectedSearch}
            setSelectedGenres={setSelectedSearch}
            unselectGenres={unselectGenres}
          />
        </Activity>

        {/* Comic List */}
        <Activity
          mode={
            !isPending && (comicsData?.data?.length || 0) > 0
              ? 'visible'
              : 'hidden'
          }
        >
          <section className="flex items-center w-full">
            <Activity mode={cardLayout === 'grid' ? 'visible' : 'hidden'}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 w-full max-h-screen overflow-y-auto gap-3">
                {Number(comicsData?.data.length || 0) > 0 && !isPending ? (
                  comicsData?.data?.map((data, i) => (
                    <GenreMangaCard key={i} data={data} index={i} />
                  ))
                ) : (
                  <GenreMangaCardSkeleton count={15} />
                )}
              </div>
            </Activity>
            <Activity mode={cardLayout === 'list' ? 'visible' : 'hidden'}>
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

        {/* Pagination */}
        <PaginationSection
          currentPage={currentPage || 0}
          setCurrentPage={setCurrentPage}
          totalPage={totalPage!}
        />
      </main>
      <GenreFilterDropdown
        isOpen={openFilter}
        setIsOpen={setOpenFilter}
        genres={genres?.data || []}
        selectedSearch={selectedSearch}
        setSelectedSearch={setSelectedSearch}
        inclusionMode={inclusionMode}
        exclusionMode={exclusionMode}
        setInclusionMode={setInclusionMode}
        setExclusionMode={setExclusionMode}
      />
    </div>
  )
}
