import { useEffect, useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft, Home, BookOpen, Heart, Calendar, BookText, AlertCircle, RefreshCw } from 'lucide-react'
import { getH18Detail } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import { getH18ImageUrl } from '@/features/h18/utils/imageUrl'
import { saveH18History, getH18HistoryById } from '@/features/h18/utils/history'
import type { H18HistoryItem } from '@/features/h18/utils/history'
import H18LockedGate from '@/features/h18/components/H18LockedGate'

export const Route = createFileRoute('/h-detail/$id')({
  loader: async ({ params: { id } }) => {
    try {
      const cleanId = String(id).replace(/[^0-9]/g, '')
      const detail = await getH18Detail({ data: { id: cleanId || id } })
      return { detail, id: cleanId || id }
    } catch (err) {
      console.error('[H18Detail] Error loading detail:', err)
      return { detail: null, id }
    }
  },
  component: H18DetailPage,
})

function H18DetailPage() {
  const { detail, id } = Route.useLoaderData()
  const { isAuthenticated } = useH18Auth()
  const navigate = useNavigate()
  const [historyItem, setHistoryItem] = useState<H18HistoryItem | null>(null)

  useEffect(() => {
    if (detail && isAuthenticated) {
      const existing = getH18HistoryById(detail.id)
      setHistoryItem(existing)

      saveH18History({
        id: detail.id,
        title: detail.title,
        japanese_title: detail.japanese_title,
        media_id: detail.media_id,
        cover_url: detail.cover_url,
        thumbnail_url: detail.thumbnail_url,
        page_count: detail.page_count,
        progress: existing?.progress,
        last_page: existing?.last_page,
      })
    }
  }, [detail, isAuthenticated])

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  const handleStartRead = () => {
    if (!detail) return
    navigate({
      to: '/h-read/$id',
      params: { id: String(detail.id) },
    })
  }

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      navigate({ to: '/h18' })
    }
  }

  if (!detail) {
    return (
      <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#08050a] text-slate-100 p-4">
        <div className="flex flex-col items-center text-center max-w-md p-8 rounded-2xl bg-[#0f0913] border border-white/10 shadow-2xl gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#ff2d78]/15 border border-[#ff2d78] text-[#ff2d78] flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Komik Tidak Ditemukan</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Komik #{id} tidak dapat dimuat atau server data sedang sibuk. Silakan coba muat ulang.
          </p>
          <div className="flex items-center gap-3 mt-2 w-full">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 py-2.5 rounded-xl bg-[#ff2d78] hover:bg-[#e02068] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Coba Lagi</span>
            </button>
            <Link
              to="/h18"
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-colors text-center"
            >
              Ke Katalog
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Group tags by their authentic types
  const artists = detail.tags.filter((t) => t.type === 'artist')
  const groups = detail.tags.filter((t) => t.type === 'group')
  const parodies = detail.tags.filter((t) => t.type === 'parody')
  const characters = detail.tags.filter((t) => t.type === 'character')
  const genres = detail.tags.filter((t) => t.type === 'tag' || !t.type)
  const categories = detail.tags.filter((t) => t.type === 'category')
  const languages = detail.tags.filter((t) => t.type === 'language')

  const hasProgress = historyItem && historyItem.progress !== undefined && historyItem.progress > 0

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#08050a] text-slate-100 overflow-x-hidden pb-16">
      {/* 1. Hero Detail Section with Blurred Cover Background */}
      <section className="relative z-10 w-full overflow-hidden bg-[#08050a]">
        {/* Background Blurred Cover */}
        <div className="absolute inset-0 z-0">
          <img
            src={getH18ImageUrl(detail.cover_url)}
            alt=""
            className="w-full h-full object-cover blur-md scale-110 opacity-50 select-none"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget
              if (detail.cover_url && !target.src.includes(detail.cover_url)) {
                target.src = detail.cover_url
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#08050a]/85 to-[#08050a]" />
        </div>

        {/* Top Navigation Bar: Back & Home (Prominent & Clear) */}
        <header className="relative z-30 flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900/90 hover:bg-[#ff2d78] text-white border border-white/20 hover:border-[#ff2d78] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xl active:scale-95 backdrop-blur-md group"
            title="Kembali ke halaman sebelumnya"
            aria-label="Kembali ke halaman sebelumnya"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Kembali</span>
          </button>

          <Link
            to="/h18"
            className="flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-slate-900/90 hover:bg-[#ff2d78] text-white border border-white/20 hover:border-[#ff2d78] text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xl active:scale-95 backdrop-blur-md group"
            title="Kembali ke Katalog H18"
            aria-label="Kembali ke Katalog H18"
          >
            <Home className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Katalog</span>
          </Link>
        </header>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 md:gap-10">
          {/* Comic Cover Poster */}
          <div className="shrink-0 w-48 sm:w-56 md:w-64 aspect-[3/4.2] rounded-2xl overflow-hidden border-2 border-[#ff2d78] shadow-2xl shadow-[#ff2d78]/25 bg-slate-900">
            <img
              src={getH18ImageUrl(detail.cover_url)}
              alt={detail.title}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget
                if (detail.cover_url && !target.src.includes(detail.cover_url)) {
                  target.src = detail.cover_url
                }
              }}
            />
          </div>

          {/* Details & Info */}
          <div className="flex flex-col flex-1 gap-4 text-center md:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#ff2d78] text-white text-xs font-black shadow-md">
                18+ ADULT
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 text-slate-300 text-xs font-semibold">
                ID: #{detail.id}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-heading text-white leading-tight">
              {detail.title}
            </h1>

            {detail.japanese_title && (
              <p className="text-sm text-slate-400 font-medium">{detail.japanese_title}</p>
            )}

            {/* Meta Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-slate-300 py-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#ff2d78]">
                <BookOpen className="w-4 h-4" />
                <span>{detail.page_count} Halaman</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <div className="flex items-center gap-1.5 font-semibold text-rose-400">
                <Heart className="w-4 h-4 fill-current" />
                <span>{detail.favorite_count?.toLocaleString()} Favorit</span>
              </div>
              {detail.upload_date && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(detail.upload_date).toLocaleDateString('id-ID')}</span>
                  </div>
                </>
              )}
            </div>

            {/* Reading Progress Info & Progress Bar (with explicit percentage) */}
            {hasProgress && (
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-[#ff2d78]/15 via-purple-500/10 to-transparent border border-[#ff2d78]/35 max-w-lg mt-1 text-left">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff2d78] animate-pulse" />
                    Progress Membaca
                  </span>
                  <span className="text-[#ff2d78] text-sm font-black">
                    {historyItem.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-[#ff2d78] to-pink-400 rounded-full transition-all duration-300 shadow-sm shadow-[#ff2d78]/50"
                    style={{ width: `${historyItem.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Halaman {historyItem.last_page || 1} dari {detail.page_count}</span>
                  <span className="text-[#ff2d78] font-semibold">
                    {historyItem.progress >= 100 ? 'Selesai Dibaca' : 'Sedang Dibaca'}
                  </span>
                </div>
              </div>
            )}

            {/* Big Action Button: Baca Sekarang / Lanjutkan Membaca in Solid Pink */}
            <div className="mt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleStartRead}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#ff2d78] hover:bg-[#e02068] text-white font-bold text-sm sm:text-base transition-all shadow-xl shadow-[#ff2d78]/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <BookText className="w-5 h-5" />
                <span>
                  {hasProgress
                    ? `Lanjutkan Membaca (${historyItem.progress}%)`
                    : 'Baca Komik Sekarang'}
                </span>
              </button>
            </div>

            {/* Comprehensive Classified Metadata (Author, Group, Parody, Character, Genre, Format) */}
            <div className="flex flex-col gap-3 pt-3 text-left">
              {/* Authors / Artists */}
              {artists.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white min-w-16 shrink-0">
                    Author / Artist:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {artists.map((a) => (
                      <Link
                        key={a.name}
                        to="/h-explore"
                        search={{ artist: a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') }}
                        className="px-2.5 py-1 bg-[#ff2d78]/20 hover:bg-[#ff2d78]/35 border border-[#ff2d78]/50 hover:border-[#ff2d78] rounded-lg text-xs font-semibold text-pink-200 hover:text-white transition-all cursor-pointer shadow-xs"
                      >
                        {a.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Circles / Groups */}
              {groups.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white min-w-16 shrink-0">
                    Group:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {groups.map((g) => (
                      <Link
                        key={g.name}
                        to="/h-explore"
                        search={{ q: `group:"${g.name}"` }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all"
                      >
                        {g.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Parodies / Original Series */}
              {parodies.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white min-w-16 shrink-0">
                    Parodi:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {parodies.map((p) => (
                      <Link
                        key={p.name}
                        to="/h-explore"
                        search={{ q: `parody:"${p.name}"` }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all"
                      >
                        {p.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Characters */}
              {characters.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white min-w-16 shrink-0">
                    Karakter:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {characters.map((c) => (
                      <Link
                        key={c.name}
                        to="/h-explore"
                        search={{ q: `character:"${c.name}"` }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Genres & Tags */}
              {genres.length > 0 && (
                <div className="flex items-start gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-white min-w-16 shrink-0 pt-1">
                    Genre / Tag:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap flex-1">
                    {genres.map((tag) => {
                      const slug = tag.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                      return (
                        <Link
                          key={tag.name}
                          to="/h-genre-detail/$genre"
                          params={{ genre: slug }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#ff2d78]/25 border border-white/10 hover:border-[#ff2d78]/50 text-xs text-slate-300 hover:text-white font-medium transition-all"
                        >
                          #{tag.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Categories & Languages */}
              {(categories.length > 0 || languages.length > 0) && (
                <div className="flex items-center gap-4 flex-wrap pt-1 text-xs text-slate-400">
                  {categories.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-300">Format:</span>
                      {categories.map((cat) => (
                        <Link
                          key={cat.name}
                          to="/h-explore"
                          search={{ category: cat.name.toLowerCase() }}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  {languages.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-300">Bahasa:</span>
                      {languages.map((lang) => (
                        <span
                          key={lang.name}
                          className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-medium border border-white/10"
                        >
                          {lang.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Page Gallery Previews */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6 flex flex-col gap-4">
        <h2 className="text-lg sm:text-xl font-black font-heading text-white flex items-center gap-2">
          <span>Pratinjau Halaman</span>
          <span className="text-xs text-slate-400 font-normal">({detail.images.length} Halaman)</span>
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {detail.images.map((img) => (
            <div
              key={img.page}
              onClick={handleStartRead}
              className="group relative aspect-[3/4.2] rounded-lg overflow-hidden bg-slate-900 border border-white/10 hover:border-[#ff2d78] cursor-pointer transition-all shadow-sm hover:scale-105"
            >
              <img
                src={getH18ImageUrl(img.thumbnail_url || img.url)}
                alt={`Halaman ${img.page}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget
                  const fallback = img.thumbnail_url || img.url
                  if (fallback && !target.src.includes(fallback)) {
                    target.src = fallback
                  }
                }}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
                {img.page}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
