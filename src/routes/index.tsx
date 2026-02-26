import CarouselSection from '@/features/index/sections/carouselSection'
import { createFileRoute } from '@tanstack/react-router'
import comics from "@/shared/dummy/comic-dummy.json"
import RecommendationSection from '@/features/index/sections/recommendationSection'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className='font-primary flex flex-col w-full min-h-screen px-5 md:px-20'>
      <div className='flex flex-col w-full h-full gap-10 bg-linear-to-b from-transparent via-black to-primary px-5'>
        <div className='w-full'>
          <CarouselSection />
        </div>
        <div className='w-full h-auto'>
          <div className='flex w-[68%] min-h-screen'>
            <RecommendationSection recommendation={comics?.data} />
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
