import RecommendationCard from '@/features/view-comic/recommendationCard'
import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import type { ComicType } from '@/shared/interfaces'
import { TrendingUp } from 'lucide-react'
import { useState } from 'react'

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
    const [selectedType, setSelectedType] = useState<"manhwa" | "manga" | "manhua">("manga")
    const handleRecommendationClick = (v: "manhwa" | "manga" | "manhua") => {
        setSelectedType(v)
    }

    return (
        <section className='flex flex-col justify-center w-full h-full text-white gap-5'>
            <header className='flex items-center justify-between w-full'>
                <Label className='text-white font-semibold text-2xl'>
                    <TrendingUp className='w-6 h-6 text-red-500' />
                    Rekomendasi Teratas
                </Label>
                <div className='flex items-center justify-between bg-gray-600/20 backdrop-blur-sm w-auto h-auto p-2 rounded-full gap-2'>
                    {recommendationButton.map(({ title, value },i) => {
                        return (
                            <Button
                                key={i}
                                onClick={() => handleRecommendationClick(value as "manhwa" | "manga" | "manhua")}
                                className={`${value === selectedType ? "bg-primary text-white" : "bg-transparent text-gray-400"} rounded-full transition duration-700 font-semibold hover:text-white hover:bg-transparent`}>
                                {title}
                            </Button>
                        )
                    })}
                </div>
            </header>
            <div className='grid grid-cols-5 w-full gap-3'>
                {recommendation?.map((data, i) => {
                    return (
                        <RecommendationCard key={i} data={data} index={i} />
                    )
                })}
            </div>
        </section>
    )
}
