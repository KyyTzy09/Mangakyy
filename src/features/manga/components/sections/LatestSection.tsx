import { Button } from '@/shared/shadcn/button'
import { Label } from '@/shared/shadcn/label'
import type { UpdateComic } from '@/shared/interfaces'
import { useNavigate } from '@tanstack/react-router'
import { LucideTimer } from 'lucide-react'
import React from 'react'
import LatestCard from '@/features/manga/components/cards/LatestCard'

interface Props {
    latest: UpdateComic[]
}

export default function LatestSection({ latest }: Props) {
    const navigate = useNavigate()
    return (
        <section className='flex flex-col w-full gap-2 p-2 rounded-md'>
            <header className='flex items-center justify-between w-full'>
                <Label className='text-white font-semibold text-2xl'>
                    <LucideTimer className='w-6 h-6 text-primary' />
                    Update Terbaru
                </Label>
            </header>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 w-full h-full gap-2'>
                {latest?.map((data, i) => {
                    return (
                        <LatestCard key={i} data={data} index={i} />
                    )
                }).slice(0, 5)}
            </div>
            <Button onClick={() => navigate({ to: "/update" })} className='flex items-center justify-center w-full bg-gray-600 transition duration-700'>
                {" Selengkapnya >"}
            </Button>
        </section>
    )
}
