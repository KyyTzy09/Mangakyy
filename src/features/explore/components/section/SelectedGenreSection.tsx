import type { SearchTaxonomyType, SearchType } from '@/shared/interfaces/search'
import { Badge } from '@/shared/shadcn/badge'
import { X } from 'lucide-react'
import React from 'react'

interface Props {
    selectedGenres: SearchTaxonomyType
    setSelectedGenres: React.Dispatch<React.SetStateAction<SearchTaxonomyType>>
    unselectGenres: (slug: string) => void
    isSelected: (slug: string, type: SearchType) => boolean
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
                            ${isSelected(slug, "genre")
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
