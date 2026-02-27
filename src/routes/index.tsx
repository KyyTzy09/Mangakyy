import CarouselSection from '@/features/index/sections/carouselSection'
import { createFileRoute } from '@tanstack/react-router'
import comics from "@/shared/dummy/comic-dummy.json"
import RecommendationSection from '@/features/index/sections/recommendationSection'
import PopularSection from '@/features/index/sections/popularSection'
import LatestSection from '@/features/index/sections/latestSection'
import { getPopularManga, getRecommendationManga } from '@/api/server/manga'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => {
    const recommendation = await getRecommendationManga()
    return {
      recommendation,
      popular: await getPopularManga()
    }
  }
})

function App() {
  const { recommendation, popular } = Route.useLoaderData()
  console.log(recommendation)
  return (
    <div className='font-primary flex flex-col w-full min-h-screen px-5 md:px-20'>
      <div className='flex flex-col w-full h-full gap-10 bg-linear-to-b from-transparent via-black to-primary px-5 pt-20 overflow-hidden'>
        <div className='w-full'>
          <CarouselSection recommendations={recommendation || []} />
        </div>
        <div className='flex flex-col items-start justify-between md:flex-row w-full h-auto gap-5'>
          {/* <div className='flex flex-col w-[68%] min-h-screen gap-5'>
            <RecommendationSection recommendation={recomendation!} />
            <PopularSection popular={popular!} />
          </div>
          <div className='w-[32%] h-full bg-[#232323] text-white rounded-md'>
            <LatestSection latest={[]} />
          </div> */}
        </div>
      </div>
    </div>
  )
}
