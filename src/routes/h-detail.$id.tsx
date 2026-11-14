import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft, Home, BookOpen, Heart, Calendar, BookText, AlertCircle, RefreshCw } from 'lucide-react'
import { getH18Detail } from '@/api/server/h18'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import { getH18ImageUrl } from '@/features/h18/utils/imageUrl'
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

        {/* Top Navigation Bar: Back & Home */}
        <header className="relative z-30 flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/85 hover:bg-[#ff2d78] text-white border border-white/15 hover:border-[#ff2d78] flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95 backdrop-blur-md group"
            title="Kembali"
            aria-label="Kembali ke halaman sebelumnya"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          <Link
            to="/h18"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/85 hover:bg-[#ff2d78] text-white border border-white/15 hover:border-[#ff2d78] flex items-center justify-center transition-all cursor-pointer shadow-xl active:scale-95 backdrop-blur-md group"
            title="Kembali ke Katalog H18"
            aria-label="Kembali ke Katalog H18"
          >
            <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
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

            {/* Tags Pills linked to Genre Detail */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-1">
              {detail.tags.map((tag) => {
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

            {/* Big Action Button: Baca Sekarang in Solid Pink */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleStartRead}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#ff2d78] hover:bg-[#e02068] text-white font-bold text-sm sm:text-base transition-all shadow-xl shadow-[#ff2d78]/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <BookText className="w-5 h-5" />
                <span>Baca Komik Sekarang</span>
              </button>
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
