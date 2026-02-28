import CarouselSection from '@/features/index/sections/carouselSection'
import { createFileRoute } from '@tanstack/react-router'
import RecommendationSection from '@/features/index/sections/recommendationSection'
import PopularSection from '@/features/index/sections/popularSection'
import LatestSection from '@/features/index/sections/latestSection'
import { getPopularManga, getRecommendationManga, getUpdateManga } from '@/api/server/manga'
import type { ComicType } from '@/shared/interfaces'

export const Route = createFileRoute('/')({
  component: App,
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
        title: "Mangakyy - Home",
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
        content: "Mangakyy - Baca Manga, Manhwa, dan Manhua Gratis",
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

      // Twitter card
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Mangakyy - Baca Manga, Manhwa, dan Manhua Gratis",
      },
      {
        name: "twitter:description",
        content:
          "Platform baca manga, manhwa, dan manhua gratis dengan update cepat dan kualitas terbaik.",
      },
    ]
  }),
  loader: async () => {
    const recommendation = await getRecommendationManga()
    return {
      recommendation,
      popular: await getPopularManga(),
      update: await getUpdateManga()
    }
  }
})

function App() {
  const { recommendation, popular, update } = Route.useLoaderData()
  return (
    <div className='font-primary flex flex-col w-full min-h-screen px-5 md:px-20 pt-20'>
      <div className='flex flex-col w-full h-full gap-10 bg-linear-to-b from-transparent via-black to-primary px-5 pt-14 overflow-hidden'>
        <div className='w-full'>
          <CarouselSection recommendations={recommendation || []} />
        </div>
        <div className='flex flex-col items-start justify-between lg:flex-row w-full h-auto gap-5'>
          <div className='flex flex-col w-[100%] lg:w-[68%] min-h-screen gap-5'>
            <RecommendationSection recommendation={recommendation as ComicType[]} />
            <PopularSection popular={popular!} />
          </div>
          <div className=' lg:w-[32%] h-full bg-[#232323] text-white rounded-md'>
            <LatestSection latest={update?.data || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
