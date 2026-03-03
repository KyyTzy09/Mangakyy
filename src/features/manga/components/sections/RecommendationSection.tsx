import RecommendationCard from '@/features/manga/components/cards/RecommendationCard'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import type { ComicType } from '@/shared/interfaces'
import { TrendingUp } from 'lucide-react'
import { useState } from 'react'
import Selector from '@/shared/components/selector'

interface Props {
    recommendation: ComicType[]
}

const recommendationButton = [
    {
        title: "Manga",
        value: "manga"
    },
    {
        title: "Manhua",
        value: "manhua"
    },
    {
        title: "Manhwa",
        value: "manhwa"
    },
]

export default function RecommendationSection({ recommendation }: Props) {
    const [selectedType, setSelectedType] = useState<string>("manga")

    return (
        <section className='flex flex-col justify-center w-full h-full text-white gap-5'>
            <header className='flex flex-col md:flex-row items-center justify-between w-full gap-2'>
                <Label className='text-white font-semibold text-2xl'>
                    <TrendingUp className='w-6 h-6 text-red-500' />
                    Rekomendasi Teratas
                </Label>
                <Selector items={recommendationButton} selectedValue={selectedType} setSelectedValue={setSelectedType} />
            </header>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-full gap-3'>
                {recommendation?.map((data, i) => {
                    return (
                        <RecommendationCard key={i} data={data} index={i} />
                    )
                })}
            </div>
        </section>
    )
}
