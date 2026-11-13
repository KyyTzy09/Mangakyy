import CarouselSection from '@/features/manga/components/sections/CarouselSection'
import GenreSection from '@/features/manga/components/sections/GenreSection'
import LatestSection from '@/features/manga/components/sections/LatestSection'
import PopularSection from '@/features/manga/components/sections/PopularSection'
import RecommendationSection from '@/features/manga/components/sections/RecommendationSection'
import type { ComicType } from '@/shared/interfaces'
import { useLoaderData } from '@tanstack/react-router'

export default function HomePage() {
  const { topWeekly, recommendation, popular, update } = useLoaderData({
    from: '/',
  })

  return (
    <div className="relative flex flex-col w-full min-h-screen text-slate-100 bg-[#080C14] pb-16 md:pb-10 overflow-x-hidden">
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

      {/* 1. Full-width Hero Carousel Section (Edge-to-Edge) - Top Weekly */}
      <div className="relative z-10 w-full">
        <CarouselSection items={topWeekly?.data || []} />
      </div>

      {/* 2. Lower Content Section (Centered max-w Container) */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-12">
        {/* 3 Section Utama: Rekomendasi & Populer (Kiri), Update Terbaru (Kanan) */}
        <div className="flex flex-col items-start justify-between lg:flex-row w-full h-auto gap-8">
          <div className="flex flex-col w-full lg:w-[65%] gap-10">
            <RecommendationSection
              recommendation={recommendation?.data as ComicType[]}
            />
            <PopularSection popular={popular?.data as ComicType[]} />
          </div>
          <aside className="w-full lg:w-[35%] bg-[#111622]/80 border border-white/5 backdrop-blur-md text-white rounded-2xl p-4 sm:p-5 shadow-xl">
            <LatestSection latest={update?.data || []} initialResponse={update} />
          </aside>
        </div>

        {/* Section Genre Baru: Full width di bawah 3 section utama */}
        <GenreSection />
      </main>
    </div>
  )
}
