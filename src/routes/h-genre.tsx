import { useState, useMemo, useEffect, useRef } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  Tag,
  Search,
  Compass,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  BookOpen,
  User,
  Users,
  Tv,
  Layers,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { z } from 'zod'
import {
  getH18GenreList,
  getH18GroupedTags,
  getH18LiveTags,
  searchH18Tags,
} from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'
import type {
  H18GroupedTagsResult,
  H18PaginatedTagsResult,
  H18TagItem,
} from '@/features/h18/types'

const genreSearchSchema = z.object({
  q: z.string().optional().default(''),
  type: z
    .enum(['all', 'tag', 'character', 'artist', 'parody', 'group', 'curated'])
    .optional()
    .default('all'),
  sort: z.enum(['popular', 'name']).optional().default('popular'),
  letter: z.string().optional(),
  page: z.number().optional().default(1),
})

export const Route = createFileRoute('/h-genre')({
  validateSearch: (search) => genreSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    try {
      const categories = await getH18GenreList().catch(() => [])

      let initialGroupedData: H18GroupedTagsResult | null = null
      let initialSingleData: H18PaginatedTagsResult | null = null
      let initialSearchData: H18TagItem[] = []

      if (deps.q?.trim()) {
        initialSearchData = await searchH18Tags({
          data: {
            query: deps.q.trim().replace(/^#/, ''),
            type: deps.type === 'all' ? undefined : deps.type,
            limit: 50,
          },
        }).catch(() => [])
      } else if (deps.type === 'all') {
        initialGroupedData = await getH18GroupedTags({
          data: {
            letter: deps.letter,
            sort: deps.sort,
            page: deps.page,
            per_page: 50,
          },
        }).catch(() => null)
      } else if (deps.type !== 'curated') {
        initialSingleData = await getH18LiveTags({
          data: {
            type: deps.type,
            letter: deps.letter,
            sort: deps.sort,
            page: deps.page,
            per_page: 50,
          },
        }).catch(() => null)
      }

      return {
        categories,
        initialGroupedData,
        initialSingleData,
        initialSearchData,
      }
    } catch {
      return {
        categories: [],
        initialGroupedData: null,
        initialSingleData: null,
        initialSearchData: [],
      }
    }
  },
  component: H18GenreIndexPage,
})

const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const TAXONOMY_TABS = [
  { label: 'Semua (Dikelompokkan)', value: 'all', icon: Layers, countDesc: '50/Grup' },
  { label: 'Genre & Tema', value: 'tag', icon: Tag, countDesc: '4.780+' },
  { label: 'Karakter', value: 'character', icon: Users, countDesc: '18.000+' },
  { label: 'Artis / Kreator', value: 'artist', icon: User, countDesc: '33.300+' },
  { label: 'Anime / Parodi', value: 'parody', icon: Tv, countDesc: '4.400+' },
  { label: 'Lingkaran / Grup', value: 'group', icon: BookOpen, countDesc: '25.300+' },
  { label: 'Kategori Pilihan', value: 'curated', icon: Sparkles, countDesc: '156' },
] as const

const GROUP_CONFIGS = [
  {
    key: 'tag' as const,
    title: 'Genre & Tema Cerita',
    icon: Tag,
    desc: 'Kategori fetish, tema cerita, dan gaya visual utama komik',
    exploreType: 'tag',
  },
  {
    key: 'character' as const,
    title: 'Karakter Populer',
    icon: Users,
    desc: 'Tokoh-tokoh anime, game, dan manga yang sering muncul',
    exploreType: 'character',
  },
  {
    key: 'artist' as const,
    title: 'Artis & Kreator',
    icon: User,
    desc: 'Mangaka, circle author, dan ilustrator dewasa papan atas',
    exploreType: 'artist',
  },
  {
    key: 'parody' as const,
    title: 'Anime & Game Parodi',
    icon: Tv,
    desc: 'Franchise anime, novel visual, dan video game',
    exploreType: 'parody',
  },
  {
    key: 'group' as const,
    title: 'Lingkaran & Grup (Circle)',
    icon: BookOpen,
    desc: 'Studio independen dan lingkaran doujinshi',
    exploreType: 'group',
  },
] as const

function formatTagCount(count: number | string): string {
  const num =
    typeof count === 'number'
      ? count
      : parseInt(String(count).replace(/[^0-9]/g, ''), 10) || 0
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toLocaleString('id-ID')
}

function H18GenreIndexPage() {
  const {
    categories,
    initialGroupedData,
    initialSingleData,
    initialSearchData,
  } = Route.useLoaderData()
  const search = Route.useSearch()
  const { isAuthenticated } = useH18Auth()
  const navigate = useNavigate()

  const [inputVal, setInputVal] = useState(search.q || '')
  const [activeCuratedCategory, setActiveCuratedCategory] = useState<string>('all')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const tabsContainerRef = useRef<HTMLDivElement | null>(null)
  const curatedTabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const curatedContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setInputVal(search.q || '')
  }, [search.q])

  // Fungsi eksak untuk memposisikan tab terpilih tepat ke tengah (auto-center) dan bergeser sendiri secara halus
  const centerActiveTab = (tabKey: string, smooth = true) => {
    const run = () => {
      const element = tabRefs.current[tabKey]
      const container = tabsContainerRef.current
      if (!element || !container) return

      const containerWidth = container.clientWidth
      const elementLeft = element.offsetLeft
      const elementWidth = element.clientWidth
      const targetLeft = elementLeft - containerWidth / 2 + elementWidth / 2

      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: smooth ? 'smooth' : 'auto',
      })
    }

    requestAnimationFrame(run)
    setTimeout(run, 50)
  }

  const centerCuratedTab = (catKey: string, smooth = true) => {
    const run = () => {
      const element = curatedTabRefs.current[catKey]
      const container = curatedContainerRef.current
      if (!element || !container) return

      const containerWidth = container.clientWidth
      const elementLeft = element.offsetLeft
      const elementWidth = element.clientWidth
      const targetLeft = elementLeft - containerWidth / 2 + elementWidth / 2

      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: smooth ? 'smooth' : 'auto',
      })
    }

    requestAnimationFrame(run)
    setTimeout(run, 50)
  }

  // Otomatis geser / center tab aktif ke tengah sendiri saat halaman dimuat atau tab berganti
  useEffect(() => {
    const currentTab = search.type || 'all'
    centerActiveTab(currentTab, true)
  }, [search.type])

  useEffect(() => {
    if (search.type === 'curated') {
      centerCuratedTab(activeCuratedCategory, true)
    }
  }, [search.type, activeCuratedCategory])

  const handleTabsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && tabsContainerRef.current) {
      tabsContainerRef.current.scrollLeft += e.deltaY
    }
  }

  // 1. TanStack Query for Grouped Taxonomy (50 items per category) with caching
  const groupedQuery = useQuery({
    queryKey: ['h18-tags-grouped', search.letter, search.sort, search.page],
    queryFn: () =>
      getH18GroupedTags({
        data: {
          letter: search.letter,
          sort: search.sort,
          page: search.page,
          per_page: 50,
        },
      }),
    placeholderData: keepPreviousData,
    initialData:
      search.type === 'all' && !search.q && (search.page === 1 || !search.page)
        ? initialGroupedData || undefined
        : undefined,
    enabled: !search.q?.trim() && search.type === 'all',
    staleTime: 10 * 60 * 1000, // 10 minutes cache freshness
    gcTime: 60 * 60 * 1000, // 60 minutes in garbage collection cache
  })

  // 2. TanStack Query for Single Category Paginated view (50 items per page) with letter caching
  const singleQuery = useQuery({
    queryKey: [
      'h18-tags-single',
      search.type,
      search.letter,
      search.sort,
      search.page,
    ],
    queryFn: () =>
      getH18LiveTags({
        data: {
          type: search.type,
          letter: search.letter,
          sort: search.sort,
          page: search.page,
          per_page: 50,
        },
      }),
    placeholderData: keepPreviousData,
    initialData:
      search.type !== 'all' &&
      search.type !== 'curated' &&
      !search.q &&
      (search.page === 1 || !search.page)
        ? initialSingleData || undefined
        : undefined,
    enabled:
      !search.q?.trim() &&
      search.type !== 'all' &&
      search.type !== 'curated',
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })

  // 3. TanStack Query for Live Search with debounce
  const searchQuery = useQuery({
    queryKey: ['h18-tags-search', search.q, search.type],
    queryFn: () =>
      searchH18Tags({
        data: {
          query: (search.q || '').trim().replace(/^#/, ''),
          type: search.type === 'all' ? undefined : search.type,
          limit: 50,
        },
      }),
    placeholderData: keepPreviousData,
    initialData: search.q?.trim() ? initialSearchData : undefined,
    enabled: !!search.q?.trim(),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  const updateSearch = (patch: Partial<z.infer<typeof genreSearchSchema>>) => {
    navigate({
      to: '/h-genre',
      search: {
        ...search,
        page: 1,
        ...patch,
      },
    })
  }

  const handleSearchInputChange = (val: string) => {
    setInputVal(val)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      updateSearch({ q: val.trim() })
    }, 350)
  }

  const handleClearSearch = () => {
    setInputVal('')
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    updateSearch({ q: '' })
  }

  const handleTabChange = (typeVal: (typeof TAXONOMY_TABS)[number]['value']) => {
    setInputVal('')
    updateSearch({ type: typeVal, q: '', page: 1 })
    centerActiveTab(typeVal, true)
  }

  const handleSelectCurated = (catKey: string) => {
    setActiveCuratedCategory(catKey)
    centerCuratedTab(catKey, true)
  }

  const handleSortToggle = (newSort: 'popular' | 'name') => {
    updateSearch({ sort: newSort, page: 1 })
  }

  const handleLetterClick = (letter: string) => {
    if (search.letter?.toUpperCase() === letter) {
      updateSearch({ letter: undefined, page: 1 })
    } else {
      updateSearch({ letter, q: '', page: 1 })
    }
  }

  const handlePageChange = (newPage: number, totalP: number) => {
    if (newPage < 1 || newPage > totalP) return
    navigate({
      to: '/h-genre',
      search: {
        ...search,
        page: newPage,
      },
    })
    const gridEl = document.getElementById('genre-grid-top')
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Curated category tags flattening
  const curatedTags = useMemo(() => {
    if (activeCuratedCategory === 'all') {
      const map = new Map<
        string,
        { name: string; slug: string; count: string; category: string }
      >()
      categories.forEach((cat) => {
        cat.tags.forEach((t) => {
          if (!map.has(t.slug)) {
            map.set(t.slug, { ...t, category: cat.category })
          }
        })
      })
      return Array.from(map.values())
    }
    const cat = categories.find((c) => c.category === activeCuratedCategory)
    return cat ? cat.tags.map((t) => ({ ...t, category: cat.category })) : []
  }, [categories, activeCuratedCategory])

  // Destination resolver based on tag type
  const getTagDestination = (tag: {
    name: string
    slug: string
    type?: string
  }) => {
    const tType = tag.type || (search.type === 'all' ? 'tag' : search.type)
    if (tType === 'artist') {
      return {
        to: '/h-explore' as const,
        search: { artist: tag.slug },
      }
    }
    if (tType === 'parody') {
      return {
        to: '/h-explore' as const,
        search: { q: `parody:"${tag.name}"` },
      }
    }
    if (tType === 'character') {
      return {
        to: '/h-explore' as const,
        search: { q: `character:"${tag.name}"` },
      }
    }
    if (tType === 'group') {
      return {
        to: '/h-explore' as const,
        search: { q: `group:"${tag.name}"` },
      }
    }
    return {
      to: '/h-genre-detail/$genre' as const,
      params: { genre: tag.slug },
    }
  }

  const isSearchActive = !!search.q?.trim()
  const isFetchingAny =
    groupedQuery.isFetching || singleQuery.isFetching || searchQuery.isFetching

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#08050a] text-slate-100 overflow-x-hidden pt-22 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col gap-6">
        {/* 1. Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff2d78] text-white flex items-center justify-center shadow-lg shadow-[#ff2d78]/30 shrink-0">
              <Tag className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight flex items-center gap-2">
                <span>Daftar Genre &amp; Tag H18</span>
                {isFetchingAny && (
                  <Loader2 className="w-4 h-4 text-[#ff2d78] animate-spin" />
                )}
              </h1>
            </div>
          </div>

          {/* Quick link to Explore */}
          <Link
            to="/h-explore"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-[#ff2d78]/20 border border-white/10 hover:border-[#ff2d78]/40 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <Compass className="w-4 h-4 text-[#ff2d78]" />
            <span>Ke Halaman Explore</span>
          </Link>
        </div>

        {/* 2. Taxonomy Category Tabs (Semua Dikelompokkan, Genre, Karakter, Artis, Parodi, Grup) */}
        <div
          ref={tabsContainerRef}
          onWheel={handleTabsWheel}
          className="flex items-center gap-2 overflow-x-auto py-1 scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x"
        >
          {TAXONOMY_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = search.type === tab.value
            return (
              <button
                key={tab.value}
                ref={(el) => {
                  tabRefs.current[tab.value] = el
                }}
                type="button"
                onClick={() => handleTabChange(tab.value)}
                className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border select-none ${
                  isActive
                    ? 'bg-[#ff2d78] text-white border-[#ff2d78] shadow-md shadow-[#ff2d78]/30 font-extrabold'
                    : 'bg-[#120a18] text-slate-400 hover:text-white hover:bg-white/10 border-white/10'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive ? 'text-white' : 'text-[#ff2d78]'
                  }`}
                />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {tab.countDesc}
                </span>
              </button>
            )
          })}
        </div>

        {/* 3. Search & Sorting Controls Container */}
        <div className="flex flex-col gap-4 p-4 rounded-2xl bg-[#110a17] border border-white/10 shadow-lg">
          {/* Search Input Bar with Live Debounce */}
          <div className="relative w-full">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              placeholder="Cari langsung tag, karakter, kreator, parodi... (misal: sole female, romance, asuka, blue archive)"
              className="w-full h-11 bg-black/60 border border-white/15 focus:border-[#ff2d78] rounded-xl pl-10 pr-9 text-xs sm:text-sm text-white outline-none transition-colors placeholder:text-slate-500 font-medium"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {inputVal && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                title="Hapus pencarian"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sub-controls: Curated Category Filter vs Sort Order & Alphabet Bar */}
          {search.type === 'curated' ? (
            <div
              ref={curatedContainerRef}
              className="flex items-center gap-1.5 overflow-x-auto py-1 scroll-smooth scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x"
            >
              <button
                ref={(el) => {
                  curatedTabRefs.current['all'] = el
                }}
                type="button"
                onClick={() => handleSelectCurated('all')}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                  activeCuratedCategory === 'all'
                    ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Semua Kategori (156)
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.category}
                  ref={(el) => {
                    curatedTabRefs.current[cat.category] = el
                  }}
                  type="button"
                  onClick={() => handleSelectCurated(cat.category)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                    activeCuratedCategory === cat.category
                      ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.category} ({cat.tags.length})
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
              {/* Sort Toggle */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Urutkan:
                </span>
                <button
                  type="button"
                  onClick={() => handleSortToggle('popular')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    search.sort === 'popular'
                      ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/30 font-extrabold'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Terpopuler
                </button>
                <button
                  type="button"
                  onClick={() => handleSortToggle('name')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    search.sort === 'name'
                      ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/30 font-extrabold'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Alfabetis (A-Z)
                </button>
              </div>

              {/* Alphabet Index Filter Bar (A-Z) with per-letter pagination support */}
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => updateSearch({ letter: undefined, page: 1 })}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    !search.letter
                      ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40 font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  SEMUA
                </button>
                {ALPHABETS.map((letter) => {
                  const isSelected = search.letter?.toUpperCase() === letter
                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => handleLetterClick(letter)}
                      title={`Filter awalan ${letter}`}
                      className={`min-w-6.5 h-6.5 px-1 rounded-md flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40 font-extrabold'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. Status Bar: Active Filter & Count */}
        <div
          id="genre-grid-top"
          className="flex items-center justify-between text-xs text-slate-400 px-1 scroll-mt-24"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff2d78]" />
            {isSearchActive ? (
              <span>
                Hasil pencarian untuk &quot;
                <strong className="text-[#ff2d78]">{search.q}</strong>
                &quot;: <strong>{searchQuery.data?.length || 0}</strong> item ditemukan
              </span>
            ) : search.type === 'curated' ? (
              <span>
                Menampilkan <strong>{curatedTags.length}</strong> kategori pilihan
              </span>
            ) : search.type === 'all' ? (
              <span>
                {search.letter ? (
                  <>
                    Menampilkan data kelompok dengan awalan huruf{' '}
                    <strong className="text-[#ff2d78] font-bold">
                      &quot;{search.letter.toUpperCase()}&quot;
                    </strong>{' '}
                    (50 item per kelompok)
                  </>
                ) : (
                  <>
                    Menampilkan <strong>50 data per kelompok</strong> (Genre, Karakter,
                    Artis, Parodi, Grup)
                  </>
                )}
              </span>
            ) : (
              <span>
                Menampilkan <strong>{singleQuery.data?.tags.length || 0}</strong> item
                {search.letter ? (
                  <>
                    {' '}dengan awalan huruf{' '}
                    <strong className="text-[#ff2d78] font-bold">
                      &quot;{search.letter.toUpperCase()}&quot;
                    </strong>
                  </>
                ) : null}
                {(singleQuery.data?.num_pages || 1) > 1 && (
                  <>
                    {' '}(Halaman{' '}
                    <strong className="text-white">{singleQuery.data?.current_page || search.page}</strong> dari{' '}
                    {singleQuery.data?.num_pages || 1})
                  </>
                )}
              </span>
            )}
          </div>

          {search.type !== 'all' &&
            search.type !== 'curated' &&
            !isSearchActive &&
            (singleQuery.data?.num_pages || 1) > 1 && (
              <span className="font-medium text-slate-500">
                Halaman{' '}
                <strong className="text-white">
                  {singleQuery.data?.current_page || search.page}
                </strong>{' '}
                dari {singleQuery.data?.num_pages || 1}
              </span>
            )}
        </div>

        {/* 5. Main Content Renderer */}
        {isSearchActive ? (
          /* SEARCH RESULTS VIEW */
          (searchQuery.data || []).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {(searchQuery.data || []).map((tag) => {
                const dest = getTagDestination(tag)
                return (
                  <Link
                    key={`${tag.type}-${tag.id}-${tag.slug}`}
                    {...dest}
                    className="group flex items-center justify-between p-3 rounded-xl bg-[#120a18] hover:bg-[#1a0f22] border border-white/10 hover:border-[#ff2d78] transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#ff2d78]/20"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-[#ff2d78] transition-colors truncate">
                        #{tag.name}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold truncate">
                        {tag.type}
                      </span>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/5 group-hover:bg-[#ff2d78]/20 text-[10px] font-semibold text-slate-400 group-hover:text-[#ff2d78] transition-colors border border-white/5">
                      {formatTagCount(tag.count)}
                    </span>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#ff2d78]/15 border border-[#ff2d78] text-[#ff2d78] flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-lg text-white">Tidak Ada Hasil Ditemukan</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                Tidak ditemukan data yang cocok dengan kata kunci &quot;{search.q}&quot;.
              </p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-2 rounded-xl bg-[#ff2d78] text-white text-xs font-bold cursor-pointer hover:bg-[#e02068] transition-colors"
              >
                Reset Filter Pencarian
              </button>
            </div>
          )
        ) : search.type === 'curated' ? (
          /* CURATED LOCAL TAXONOMY VIEW */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {curatedTags.map((tag) => (
              <Link
                key={tag.slug}
                to="/h-genre-detail/$genre"
                params={{ genre: tag.slug }}
                className="group flex items-center justify-between p-3 rounded-xl bg-[#120a18] hover:bg-[#1a0f22] border border-white/10 hover:border-[#ff2d78] transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#ff2d78]/20"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-[#ff2d78] transition-colors truncate">
                    #{tag.name}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">{tag.category}</span>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/5 group-hover:bg-[#ff2d78]/20 text-[10px] font-semibold text-slate-400 group-hover:text-[#ff2d78] transition-colors border border-white/5">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        ) : search.type === 'all' ? (
          /* GROUPED TAXONOMY VIEW (50 items for Genre, Character, Artist, Parody, Group) */
          <div className="flex flex-col gap-10">
            {GROUP_CONFIGS.map((grp) => {
              const Icon = grp.icon
              const groupData = groupedQuery.data?.[grp.key]
              const items = groupData?.tags || []

              return (
                <section key={grp.key} className="flex flex-col gap-3.5">
                  {/* Group Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#ff2d78]/15 border border-[#ff2d78]/40 text-[#ff2d78] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                          <span>{grp.title}</span>
                          {search.letter && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#ff2d78] text-white font-extrabold">
                              Huruf {search.letter.toUpperCase()}
                            </span>
                          )}
                        </h2>
                        <p className="text-[11px] text-slate-400">{grp.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400 font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                        {items.length} data terambil
                      </span>
                      <button
                        type="button"
                        onClick={() => handleTabChange(grp.key)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ff2d78]/15 hover:bg-[#ff2d78] text-[#ff2d78] hover:text-white border border-[#ff2d78]/30 hover:border-[#ff2d78] text-xs font-bold transition-all cursor-pointer"
                      >
                        <span>Lihat Semua ({formatTagCount(groupData?.total || 0)})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 50 Cards Grid */}
                  {items.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
                      {items.map((tag) => {
                        const dest = getTagDestination(tag)
                        return (
                          <Link
                            key={`${tag.type}-${tag.id}-${tag.slug}`}
                            {...dest}
                            className="group flex items-center justify-between p-3 rounded-xl bg-[#120a18] hover:bg-[#1a0f22] border border-white/10 hover:border-[#ff2d78] transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#ff2d78]/20"
                          >
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-[#ff2d78] transition-colors truncate">
                                #{tag.name}
                              </span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold truncate">
                                {tag.type}
                              </span>
                            </div>
                            <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/5 group-hover:bg-[#ff2d78]/20 text-[10px] font-semibold text-slate-400 group-hover:text-[#ff2d78] transition-colors border border-white/5">
                              {formatTagCount(tag.count)}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-6 rounded-xl bg-white/5 border border-white/5 text-center text-xs text-slate-400">
                      Tidak ada data untuk huruf &quot;{search.letter}&quot; pada kategori ini.
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        ) : (
          /* SINGLE CATEGORY PAGINATED VIEW */
          <>
            {(singleQuery.data?.tags || []).length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
                  {(singleQuery.data?.tags || []).map((tag) => {
                    const dest = getTagDestination(tag)
                    return (
                      <Link
                        key={`${tag.type}-${tag.id}-${tag.slug}`}
                        {...dest}
                        className="group flex items-center justify-between p-3 rounded-xl bg-[#120a18] hover:bg-[#1a0f22] border border-white/10 hover:border-[#ff2d78] transition-all cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#ff2d78]/20"
                      >
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-[#ff2d78] transition-colors truncate">
                            #{tag.name}
                          </span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold truncate">
                            {tag.type || search.type}
                          </span>
                        </div>
                        <span className="shrink-0 px-2 py-0.5 rounded-full bg-white/5 group-hover:bg-[#ff2d78]/20 text-[10px] font-semibold text-slate-400 group-hover:text-[#ff2d78] transition-colors border border-white/5">
                          {formatTagCount(tag.count)}
                        </span>
                      </Link>
                    )
                  })}
                </div>

                {/* Pagination Controls for Single Category View */}
                {(singleQuery.data?.num_pages || 1) > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                      type="button"
                      disabled={(singleQuery.data?.current_page || search.page) <= 1}
                      onClick={() =>
                        handlePageChange(
                          (singleQuery.data?.current_page || search.page) - 1,
                          singleQuery.data?.num_pages || 1
                        )
                      }
                      className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#120a17] border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:border-[#ff2d78] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Sebelumnya</span>
                    </button>

                    {/* Page Number Indicators */}
                    <div className="flex items-center gap-1 px-2">
                      {Array.from({
                        length: singleQuery.data?.num_pages || 1,
                      }).map((_, idx) => {
                        const p = idx + 1
                        const curP = singleQuery.data?.current_page || search.page
                        const totalP = singleQuery.data?.num_pages || 1
                        if (
                          p === 1 ||
                          p === totalP ||
                          (p >= curP - 2 && p <= curP + 2)
                        ) {
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => handlePageChange(p, totalP)}
                              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                                curP === p
                                  ? 'bg-[#ff2d78] text-white shadow-sm shadow-[#ff2d78]/40'
                                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                              }`}
                            >
                              {p}
                            </button>
                          )
                        } else if (p === curP - 3 || p === curP + 3) {
                          return (
                            <span key={p} className="text-slate-600 px-1 text-xs">
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                    </div>

                    <button
                      type="button"
                      disabled={
                        (singleQuery.data?.current_page || search.page) >=
                        (singleQuery.data?.num_pages || 1)
                      }
                      onClick={() =>
                        handlePageChange(
                          (singleQuery.data?.current_page || search.page) + 1,
                          singleQuery.data?.num_pages || 1
                        )
                      }
                      className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#120a17] border border-white/10 text-xs font-bold text-slate-300 hover:text-white hover:border-[#ff2d78] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#ff2d78]/15 border border-[#ff2d78] text-[#ff2d78] flex items-center justify-center">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg text-white">Tidak Ada Data Ditemukan</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                  Tidak ditemukan item untuk kategori ini dengan awalan huruf &quot;
                  {search.letter}&quot;.
                </p>
                <button
                  type="button"
                  onClick={() => updateSearch({ letter: undefined, page: 1 })}
                  className="px-4 py-2 rounded-xl bg-[#ff2d78] text-white text-xs font-bold cursor-pointer hover:bg-[#e02068] transition-colors"
                >
                  Tampilkan Semua Huruf
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
