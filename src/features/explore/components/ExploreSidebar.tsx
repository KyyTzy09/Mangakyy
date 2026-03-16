import type { TaxonomyItem } from '@/shared/interfaces'
import type { SearchTaxonomyType } from '@/shared/interfaces/search'
import React from 'react'
import type { SelectedGenreMode } from '../hooks/useGenreMode'
import GenreListSection from './section/GenreListSection'
import SelectFormatSection from './section/SelectFormatSection'
import SelectTypesection from './section/SelectTypeSection'
import SelectStatussection from './section/SelectStatusSection'

interface Props {
    genres: TaxonomyItem[]
    selectedSearch: SearchTaxonomyType
    inclusionMode: SelectedGenreMode
    exclusionMode: SelectedGenreMode
    setSelectedSearch: React.Dispatch<React.SetStateAction<SearchTaxonomyType>>
    setInclusionMode: React.Dispatch<React.SetStateAction<SelectedGenreMode>>
    setExclusionMode: React.Dispatch<React.SetStateAction<SelectedGenreMode>>
}

export default function ExploreSidebar({ genres, selectedSearch: selectedSearch, inclusionMode, exclusionMode, setSelectedSearch, setInclusionMode, setExclusionMode }: Props) {
    return (
        <aside className="hidden md:flex flex-col w-70 h-fit max-h-[85vh] sticky top-24 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 gap-5 overflow-y-auto">
            <GenreListSection
                selectedGenres={selectedSearch}
                inclusionMode={inclusionMode}
                exclusionMode={exclusionMode}
                setInclusionMode={setInclusionMode}
                setExclusionMode={setExclusionMode}
                setSelectedGenres={setSelectedSearch}
                data={genres || []}
            />
            <SelectFormatSection
                selectedFormats={selectedSearch}
                setSelectedFormats={setSelectedSearch}
            />
            <SelectTypesection
                selectedTypes={selectedSearch}
                setSelectedTypes={setSelectedSearch}
            />
            <SelectStatussection
                selectedStatus={selectedSearch}
                setSelectedStatus={setSelectedSearch}
            />
        </aside>
    )
}
