import CarouselSection from '@/features/index/sections/carouselSection'
import { createFileRoute } from '@tanstack/react-router'
import comics from "@/shared/dummy/comic-dummy.json"
import RecommendationSection from '@/features/index/sections/recommendationSection'
import PopularSection from '@/features/index/sections/popularSection'
import LatestSection from '@/features/index/sections/latestSection'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className='font-primary flex flex-col w-full min-h-screen px-5 md:px-20'>
      <div className='flex flex-col w-full h-full gap-10 bg-linear-to-b from-transparent via-black to-primary px-5'>
        <div className='w-full'>
          <CarouselSection />
        </div>
        <div className='flex flex-col items-start justify-between md:flex-row w-full h-auto gap-5'>
          <div className='flex flex-col w-[68%] min-h-screen gap-5'>
            <RecommendationSection recommendation={comics?.data} />
            <PopularSection popular={comics.data} />
          </div>
          <div className='w-[32%] h-full bg-[#232323] text-white rounded-md'>
            <LatestSection latest={comics.data} />
          </div>
        </div>
      </div>
    </div>
  )
}
