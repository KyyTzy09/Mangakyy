import type { TaxonomyItem } from '@/shared/interfaces'
import { Badge } from '@/shared/shadcn/badge'
import { X } from 'lucide-react'
import React from 'react'

interface Props {
    selectedGenres: TaxonomyItem[]
    setSelectedGenres: React.Dispatch<React.SetStateAction<TaxonomyItem[]>>
    unselectGenres: (slug: string) => void
    isSelected: (slug: string) => boolean
}

export default function SelectedGenreSection({ selectedGenres, unselectGenres, isSelected }: Props) {
    return (
        <section className='flex flex-row w-full'>
            <div className='flex flex-wrap items-center justify-start w-full gap-2 max-h-32 overflow-y-auto'>
                {selectedGenres?.map(({ name, slug }, i) => (
                    <Badge
                        key={i}
                        onClick={() => unselectGenres(slug)}
                        className={`flex items-center justify-center h-10 rounded-md border cursor-pointer transition
                            ${isSelected(slug)
                                ? "border-primary bg-primary/20 text-white"
                                : "border-gray-400 bg-gray-600/20 text-gray-200 hover:opacity-75"}`
                        }
                    >
                        {name}
                        <X className='w-6 h-6' strokeWidth={3} />
                    </Badge>
                ))}
            </div>
        </section>
    )
}
