import { useState, useEffect } from 'react'
import { Link, useLoaderData, useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import {
  ArrowLeft,
  Home,
  Play,
  Star,
  Eye,
  Trophy,
  BookOpen,
  Bookmark,
} from 'lucide-react'
import type { ComicType } from '@/shared/interfaces'
import { Button } from '@/shared/shadcn/button'
import { displayComicType } from '@/shared/utils/countryConverter'
import { formatCompactNumber } from '@/shared/utils/formater'
import type { NewChapterHistory } from '@/shared/utils/history'
import { getLatestChapterHistory } from '@/shared/utils/history'
import { useGetChapterList } from '@/features/chapter/hooks/chapterQuery'
import ChapterHistoryCard from '@/features/chapter/components/cards/ChapterHistoryCard'
import ChapterList from '@/features/chapter/components/cards/chapterList'
import ChapterGridCard from '@/features/chapter/components/cards/ChapterGridCard'
import ChapterPagination from '@/features/chapter/components/ChapterPagination'
import ChapterListDropdown from '@/features/chapter/components/interacts/ChapterListDropdown'
import CardLayoutSwitcher from '@/features/manga/components/interacts/CardLayoutSwitcher'
import type { ViewMode } from '@/features/manga/components/interacts/CardLayoutSwitcher'

export default function DetailPage() {
  const { detail, chapters } = useLoaderData({ from: '/detail/$mangaId' })
  const navigate = useNavigate()
  const router = useRouter()

  const [history, setHistory] = useState<NewChapterHistory | null>(null)
  const [open, setOpen] = useState(false)
  const [isDescExpanded, setIsDescExpanded] = useState(false)

  const search = useSearch({ from: '/detail/$mangaId' })
  const page = Number(search?.page) > 0 ? Number(search.page) : 1

  const setPage = (target: number | ((prev: number) => number)) => {
    const newPage = typeof target === 'function' ? target(page) : target
    navigate({
      search: (prev) => ({ ...prev, page: newPage }),
    })
  }

  // Layout switcher state (default grid for large screens)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isMobile, setIsMobile] = useState(false)

  const mangaId = detail?.data?.manga_id || ''

  const { data: chapterList } = useGetChapterList(
    chapters!,
    mangaId,
    page,
  )

  // Mobile detection for forcing list mode on small screens
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load history
  useEffect(() => {
    if (!mangaId) return
    const h = getLatestChapterHistory(mangaId)
    setHistory(h)
  }, [mangaId])

  const comic = detail?.data
  const activeView = isMobile ? 'list' : viewMode

  const coverUrl = comic?.cover_portrait_url || comic?.cover_image_url || ''
  const statusText =
    comic?.status === 1
      ? 'Ongoing'
      : comic?.status === 2
        ? 'Hiatus'
        : 'Completed'

  const formatText =
    comic?.taxonomy?.Format?.[0]?.name ||
    displayComicType(comic?.country_id || '') ||
    'Comic'

  const typeText = comic?.taxonomy?.Type?.[0]?.name || 'Project'

  const authors = comic?.taxonomy?.Author || []
  const artists = comic?.taxonomy?.Artist || []
  const genres = comic?.taxonomy?.Genre || []

  // Safe back navigation handler
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.history.back()
    } else {
      navigate({ to: '/' })
    }
  }

  // Read action target
  const handleStartRead = () => {
    const targetChapterId =
      history?.chapter_id || comic?.latest_chapter_id || ''
    if (targetChapterId) {
      navigate({
        to: '/chapter/$chapterId',
        params: { chapterId: targetChapterId },
      })
    }
  }

  const totalChapters =
    comic?.latest_chapter_number || chapterList?.meta?.total_record || chapterList?.data?.length || 0

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#080C14] text-slate-100 overflow-x-hidden pb-16">
      {/* Fixed Ambient Watermark Logo (Pure GPU composited, static on scroll, zero rerender) */}
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

      {/* 1. Hero Detail Section with Blurred Cover Background & Top Navigation */}
      <section className="relative z-10 w-full overflow-hidden bg-[#080C14]">
        {/* Background Comic Cover Blurred */}
        <div className="absolute inset-0 z-0">
          <img
            src={coverUrl}
            alt=""
            className="w-full h-full object-cover blur-md scale-110 opacity-70 select-none"
            loading="eager"
            decoding="async"
          />
          {/* Dark Overlay fading smoothly into #080C14 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#080C14]/85 to-[#080C14]" />
        </div>

        {/* Top Navigation Bar: Tombol Kembali (Kiri) & Home (Kanan) */}
        <header className="relative z-30 flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/85 hover:bg-slate-800 text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95 backdrop-blur-md group"
            title="Kembali"
            aria-label="Kembali ke halaman sebelumnya"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/85 hover:bg-slate-800 text-white border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95 backdrop-blur-md group"
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
        </header>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-12 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 md:gap-10">
            {/* Comic Cover Poster */}
            <div className="shrink-0 w-44 sm:w-52 md:w-60 lg:w-68 aspect-[3/4.2] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/80 bg-slate-900">
              <img
                src={coverUrl}
                alt={comic?.title || 'Cover'}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            </div>

            {/* Comic Details Info */}
            <div className="flex flex-col w-full flex-1 gap-4 text-center md:text-left">
              {/* Title & Native/Alternative Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-heading text-white tracking-tight leading-tight">
                  {comic?.title}
                </h1>
                {comic?.alternative_title && (
                  <p className="text-slate-400 text-xs sm:text-sm md:text-base font-medium mt-1">
                    {comic.alternative_title}
                  </p>
                )}
              </div>

              {/* Action Button & Quick Stats Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 pt-1">
                {/* Primary Read Button */}
                <button
                  type="button"
                  onClick={handleStartRead}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm sm:text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {history ? `Lanjut Ch. ${history.chapter_number}` : 'Baca'}
                </button>

                {/* Quick Stats Badges */}
                <div className="flex items-center gap-3 sm:gap-4 px-3.5 py-2 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-semibold text-slate-300">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                    <span>{comic?.user_rate ? comic.user_rate.toFixed(1) : '0.0'}</span>
                  </div>

                  <span className="w-1 h-1 rounded-full bg-slate-600" />

                  {/* Bookmark Count */}
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Bookmark className="w-3.5 h-3.5 fill-cyan-400/20 text-cyan-400" />
                    <span>{formatCompactNumber(comic?.bookmark_count || 0)}</span>
                  </div>

                  <span className="w-1 h-1 rounded-full bg-slate-600" />

                  {/* Views */}
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatCompactNumber(comic?.view_count || 0)}</span>
                  </div>

                  {comic?.rank ? (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-600" />
                      <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                        <Trophy className="w-3.5 h-3.5 text-purple-400" />
                        <span>#{comic.rank}</span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Synopsis / Description with Read More */}
              <div className="mt-1">
                <p
                  className={`text-slate-300 text-sm sm:text-base leading-relaxed text-left transition-all ${
                    !isDescExpanded ? 'line-clamp-3 sm:line-clamp-4' : ''
                  }`}
                >
                  {comic?.description || 'Tidak ada deskripsi tersedia.'}
                </p>
                {comic?.description && comic.description.length > 180 && (
                  <div className="text-left mt-1">
                    <button
                      type="button"
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                      className="text-primary hover:text-blue-400 font-semibold text-xs sm:text-sm cursor-pointer transition-colors"
                    >
                      {isDescExpanded ? 'Tutup' : '... Baca Selengkapnya'}
                    </button>
                  </div>
                )}
              </div>

              {/* Metadata Badges Rows (Genre, Author, Artist, Format, Type, Status) */}
              <div className="flex flex-col gap-2.5 pt-2 text-left">
                {/* Row 1: Genres */}
                {genres.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-white min-w-14 shrink-0">
                      Genre
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {genres.map((g, i) => (
                        <Link
                          key={i}
                          to="/explore"
                          search={{ genre: g.slug }}
                          className="px-2.5 py-1 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                          {g.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Row 2: Author & Artist */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                  {authors.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white min-w-14 shrink-0">
                        Author
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {authors.map((a, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300"
                          >
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {artists.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white shrink-0">
                        Artist
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {artists.map((art, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300"
                          >
                            {art.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Row 3: Format, Type, Status, Rilis */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white min-w-14 shrink-0">
                      Format
                    </span>
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300">
                      {formatText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white shrink-0">
                      Type
                    </span>
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300">
                      {typeText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white shrink-0">
                      Status
                    </span>
                    <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300">
                      {statusText}
                    </span>
                  </div>

                  {comic?.release_year && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white shrink-0">
                        Rilis
                      </span>
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300">
                        {comic.release_year}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Chapter List Section with Grid/List Layout Switcher (Transparent so watermark logo is visible) */}
      <section className="relative z-10 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 gap-6 bg-transparent">
        {/* Section Header */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Daftar Chapter
              </h2>
              <span className="text-xs text-slate-400">
                Total {totalChapters} Chapter
              </span>
            </div>
          </div>

          {/* Layout Switcher: Only displayed on sm: and up. On mobile, strictly locked to List mode */}
          <div className="hidden sm:flex items-center gap-2">
            <CardLayoutSwitcher value={viewMode} onChange={setViewMode} />
          </div>
        </header>

        {/* History indicator card */}
        {history && <ChapterHistoryCard history={history} />}

        {/* Chapters Cards View (Enlarged 3 columns in grid mode, enlarged list mode on mobile/switch) */}
        {activeView === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4 w-full">
            {chapterList?.data?.map((chapter, i) => (
              <ChapterGridCard
                key={chapter.chapter_id || i}
                index={i}
                chapter={chapter}
                comic={comic as ComicType}
                isLastRead={history?.chapter_id === chapter.chapter_id}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {chapterList?.data?.map((chapter, i) => (
              <ChapterList
                key={chapter.chapter_id || i}
                index={i}
                chapter={chapter}
                comic={comic as ComicType}
                isLastRead={history?.chapter_id === chapter.chapter_id}
              />
            ))}
          </div>
        )}

        {/* Pagination & Modal selector */}
        <ChapterPagination
          page={page}
          setPage={setPage}
          chapters={chapterList}
          setOpen={setOpen}
        />
      </section>

      {/* Chapter Dropdown Search Modal */}
      <ChapterListDropdown
        comic={comic as ComicType}
        chapters={chapters?.data || []}
        isOpen={open}
        setIsOpen={setOpen}
      />
    </main>
  )
}
