import CarouselSection from '@/features/index/sections/carouselSection'
import { createFileRoute } from '@tanstack/react-router'
import RecommendationSection from '@/features/index/sections/recommendationSection'
import PopularSection from '@/features/index/sections/popularSection'
import LatestSection from '@/features/index/sections/latestSection'
import { getPopularManga, getRecommendationManga, getUpdateManga } from '@/api/server/manga'
import type { ComicType } from '@/shared/interfaces'

export const Route = createFileRoute('/')({
  component: App,
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
