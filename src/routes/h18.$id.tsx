import { createFileRoute, redirect, useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft, Home, BookOpen, Heart, Calendar, BookText } from 'lucide-react'
import { getClientCookie } from '@/shared/utils/cookie'
import { H18_COOKIE_NAME } from '@/features/h18/server/auth'
import { getH18DetailFn } from '@/features/h18/server/h18Service'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18LockedGate from '@/features/h18/components/H18LockedGate'

export const Route = createFileRoute('/h18/$id')({
  beforeLoad: async () => {
    if (typeof window !== 'undefined') {
      const token = getClientCookie(H18_COOKIE_NAME)
      if (!token) {
        throw redirect({
          to: '/',
          search: { auth_h18: true },
        })
      }
    }
  },
  loader: async ({ params: { id } }) => {
    try {
      const detail = await getH18DetailFn({ data: { id } })
      return { detail }
    } catch {
      throw redirect({ to: '/h18' })
    }
  },
  component: H18DetailPage,
})

function H18DetailPage() {
  const { detail } = Route.useLoaderData()
  const { isAuthenticated } = useH18Auth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <H18LockedGate onSuccess={() => window.location.reload()} />
  }

  const handleStartRead = () => {
    navigate({
      to: '/h18/read/$id',
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

  return (
    <main className="relative flex flex-col items-center justify-start min-h-screen bg-[#08050a] text-slate-100 overflow-x-hidden pb-16">
      {/* 1. Hero Detail Section with Blurred Cover Background */}
      <section className="relative z-10 w-full overflow-hidden bg-[#08050a]">
        {/* Background Blurred Cover */}
        <div className="absolute inset-0 z-0">
          <img
            src={detail.cover_url}
            alt=""
            className="w-full h-full object-cover blur-md scale-110 opacity-50 select-none"
            loading="eager"
            decoding="async"
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
              src={detail.cover_url}
              alt={detail.title}
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
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

            {/* Tags Pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 mt-1">
              {detail.tags.map((tag) => (
                <span
                  key={tag.name}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#ff2d78]/20 border border-white/10 text-xs text-slate-300 font-medium transition-colors"
                >
                  #{tag.name}
                </span>
              ))}
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
                src={img.thumbnail_url || img.url}
                alt={`Halaman ${img.page}`}
                loading="lazy"
                decoding="async"
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
