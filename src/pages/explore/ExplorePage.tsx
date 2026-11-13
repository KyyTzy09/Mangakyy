import { useState, useEffect, useMemo, useCallback, Activity } from 'react'
import ExploreSidebar from '@/features/explore/components/ExploreSidebar'
import GenreFilterDropdown from '@/features/explore/components/interacts/GenreFilterDropdown'
import GenreSearchSection from '@/features/explore/components/section/GenreSearchSection'
import SelectedGenreSection from '@/features/explore/components/section/SelectedGenreSection'
import { useSelectGenre } from '@/features/explore/hooks/useSelectGenre'
import type { SelectedGenreMode } from '@/features/explore/hooks/useGenreMode'
import GenreMangaCard from '@/features/manga/components/cards/GenreMangaCard'
import GenreMangaCardL from '@/features/manga/components/cards/GenreMangaCardL'
import GenreMangaCardSkeleton from '@/features/manga/components/skeletons/GenreMangaCardSkeleton'
import { useGetMangaByGenre } from '@/features/manga/hooks/MangaQuery'
import PaginationSection from '@/shared/components/reusable/pagination'
import type { SearchTaxonomyType, SearchResult } from '@/shared/interfaces/search'
import { useLoaderData, useNavigate, useSearch } from '@tanstack/react-router'
import { useDebounce } from '@/shared/hooks/useDebounce'

export default function ExplorePage() {
  const { genres, comics } = useLoaderData({ from: '/explore' })
  const search = useSearch({ from: '/explore' })
  const navigate = useNavigate({ from: '/explore' })

  const [openFilter, setOpenFilter] = useState(false)

  // Current values from URL search params
  const currentPage = Number(search.page) > 0 ? Number(search.page) : 1
  const cardLayout = search.layout === 'list' ? 'list' : 'grid'
  const currentInc = search.inc === 'and' ? 'and' : 'or'
  const currentExc = search.exc === 'and' ? 'and' : 'or'

  const inclusionMode: SelectedGenreMode = useMemo(
    () => ({
      name: currentInc === 'and' ? 'And' : 'Or',
      slug: currentInc,
      type: 'include',
    }),
    [currentInc],
  )

  const exclusionMode: SelectedGenreMode = useMemo(
    () => ({
      name: currentExc === 'and' ? 'And' : 'Or',
      slug: currentExc,
      type: 'exclude',
    }),
    [currentExc],
  )

  // Reconstruct selectedSearch from URL search params
  const selectedSearch: SearchTaxonomyType = useMemo(() => {
    const items: SearchResult[] = []

    if (search.genre) {
      const genreSlugs = search.genre.split(',').filter(Boolean)
      genreSlugs.forEach((slug) => {
        const found = genres?.data?.find(
          (g) => g.slug.toLowerCase() === slug.toLowerCase(),
        )
        items.push({
          name: found?.name || slug.charAt(0).toUpperCase() + slug.slice(1),
          slug,
          type: 'genre',
        })
      })
    }

    if (search.format) {
      const formatSlugs = search.format.split(',').filter(Boolean)
      formatSlugs.forEach((slug) => {
        items.push({
          name: slug.toUpperCase(),
          slug,
          type: 'format',
        })
      })
    }

    if (search.type) {
      const typeSlugs = search.type.split(',').filter(Boolean)
      typeSlugs.forEach((slug) => {
        items.push({
          name: slug.charAt(0).toUpperCase() + slug.slice(1),
          slug,
          type: 'type',
        })
      })
    }

    if (search.status) {
      const statusSlugs = search.status.split(',').filter(Boolean)
      statusSlugs.forEach((slug) => {
        items.push({
          name: slug.charAt(0).toUpperCase() + slug.slice(1),
          slug,
          type: 'status',
        })
      })
    }

    return items
  }, [search.genre, search.format, search.type, search.status, genres])

  // Local query state for smooth typing, debounced to URL search params
  const [localQuery, setLocalQuery] = useState(search.q || '')
  const debouncedQuery = useDebounce(localQuery, 400)

  // Keep local query in sync if URL query changes (e.g. on Back button)
  useEffect(() => {
    setLocalQuery(search.q || '')
  }, [search.q])

  // Sync debounced search query to URL
  useEffect(() => {
    const currentQ = search.q || ''
    if (debouncedQuery !== currentQ) {
      navigate({
        search: (prev) => ({
          ...prev,
          q: debouncedQuery || undefined,
          page: 1,
        }),
        replace: true,
      })
    }
  }, [debouncedQuery, search.q, navigate])

  // Update selected taxonomies
  const setSelectedSearch = useCallback(
    (action: SearchTaxonomyType | ((prev: SearchTaxonomyType) => SearchTaxonomyType)) => {
      const nextItems = typeof action === 'function' ? action(selectedSearch) : action

      const genreSlugs = nextItems.filter((i) => i.type === 'genre').map((i) => i.slug)
      const formatSlugs = nextItems.filter((i) => i.type === 'format').map((i) => i.slug)
      const typeSlugs = nextItems.filter((i) => i.type === 'type').map((i) => i.slug)
      const statusSlugs = nextItems.filter((i) => i.type === 'status').map((i) => i.slug)

      navigate({
        search: (prev) => ({
          ...prev,
          genre: genreSlugs.length ? genreSlugs.join(',') : undefined,
          format: formatSlugs.length ? formatSlugs.join(',') : undefined,
          type: typeSlugs.length ? typeSlugs.join(',') : undefined,
          status: statusSlugs.length ? statusSlugs.join(',') : undefined,
          page: 1,
        }),
        replace: true,
      })
    },
    [selectedSearch, navigate],
  )

  // Handlers for mode changes
  const setInclusionMode = useCallback(
    (mode: SelectedGenreMode | ((prev: SelectedGenreMode) => SelectedGenreMode)) => {
      const next = typeof mode === 'function' ? mode(inclusionMode) : mode
      navigate({
        search: (prev) => ({
          ...prev,
          inc: next.slug as 'or' | 'and',
          page: 1,
        }),
        replace: true,
      })
    },
    [inclusionMode, navigate],
  )

  const setExclusionMode = useCallback(
    (mode: SelectedGenreMode | ((prev: SelectedGenreMode) => SelectedGenreMode)) => {
      const next = typeof mode === 'function' ? mode(exclusionMode) : mode
      navigate({
        search: (prev) => ({
          ...prev,
          exc: next.slug as 'or' | 'and',
          page: 1,
        }),
        replace: true,
      })
    },
    [exclusionMode, navigate],
  )

  const setCardLayout = useCallback(
    (layout: 'grid' | 'list') => {
      navigate({
        search: (prev) => ({ ...prev, layout }),
        replace: true,
      })
    },
    [navigate],
  )

  const setCurrentPage = useCallback(
    (target: number | ((prev: number) => number)) => {
      const newPage = typeof target === 'function' ? target(currentPage) : target
      navigate({
        search: (prev) => ({ ...prev, page: newPage }),
      })
    },
    [currentPage, navigate],
  )

  // Filter lists for query
  const selectedGenres = useMemo(
    () => selectedSearch.filter((g) => g.type === 'genre').map((g) => g.slug),
    [selectedSearch],
  )
  const selectedTypes = useMemo(
    () => selectedSearch.filter((g) => g.type === 'type').map((g) => g.slug),
    [selectedSearch],
  )
  const selectedStatus = useMemo(
    () => selectedSearch.filter((g) => g.type === 'status').map((g) => g.slug),
    [selectedSearch],
  )
  const selectedFormats = useMemo(
    () => selectedSearch.filter((g) => g.type === 'format').map((g) => g.slug),
    [selectedSearch],
  )

  const { data: comicsData, isPending } = useGetMangaByGenre(
    comics!,
    search.q || '',
    selectedGenres,
    selectedFormats,
    selectedTypes,
    selectedStatus,
    currentInc,
    currentExc,
    currentPage,
  )

  const { isSelected, unselectGenres } = useSelectGenre(
    selectedSearch,
    setSelectedSearch,
  )
  const totalPage = comicsData?.meta?.total_page || 1

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
          query={localQuery}
          cardLayout={cardLayout}
          setCardLayout={setCardLayout}
          setQuery={setLocalQuery}
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
                {Number(comicsData?.data?.length || 0) > 0 && !isPending ? (
                  comicsData?.data?.map((data, i) => (
                    <GenreMangaCard key={data.manga_id || i} data={data} index={i} />
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
                    key={comic.manga_id || index}
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
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={totalPage}
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
