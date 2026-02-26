import RecomendationCard from '@/features/view-comic/recomendationCard'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import type { ComicType } from '@/shared/types/comicResponse.type'
import { TrendingUp } from 'lucide-react'

interface Props {
    recommendation: ComicType[]
}

export default function RecommendationSection({ recommendation }: Props) {
    return (
        <section className='flex flex-col justify-center w-full h-full text-white gap-5'>
            <header className='flex items-center justify-between w-full'>
                <Label className='text-white font-semibold text-2xl'>
                    <TrendingUp className='w-6 h-6 text-red-500' />
                    Rekomendasi Teratas
                </Label>
                <div className='flex items-center justify-between bg-gray-600/20 backdrop-blur-sm w-auto h-auto p-2 rounded-full gap-2'>
                    {Array.from({ length: 3 }).map(() => {
                        return (
                            <Button className='bg-transparent hover:bg-primary rounded-full transition duration-700 font-semibold'>
                                Tombol
                            </Button>
                        )
                    })}
                </div>
            </header>
            <div className='grid grid-cols-5 w-full gap-3'>
                {recommendation?.map((data) => {
                    return (
                        <RecomendationCard data={data} />
                    )
                })}
            </div>
        </section>
    )
}
