import type { TaxonomyItem } from '@/shared/interfaces'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Label } from '@/shared/shadcn/label'
import { ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'
import { useSelectGenre } from '../../hooks/useSelectGenre'
import type { SearchTaxonomyType } from '@/shared/interfaces/search'
import GenreModeDropdown from '../interacts/GenreModeDropdown'
import type { SelectedGenreMode } from '../../hooks/useGenreMode'

interface Props {
    data: TaxonomyItem[]
    selectedGenres: SearchTaxonomyType
    inclusionMode: SelectedGenreMode
    exclusionMode: SelectedGenreMode
    setSelectedGenres: React.Dispatch<React.SetStateAction<SearchTaxonomyType>>
    setInclusionMode: React.Dispatch<React.SetStateAction<SelectedGenreMode>>
    setExclusionMode: React.Dispatch<React.SetStateAction<SelectedGenreMode>>
}

/**
 * GenreListSection is a component that displays a list of genres
 * @param {Props} props - props object
 * @param {SearchTaxonomyType} props.data - list of taxonomy items
 * @returns {JSX.Element} - JSX element
 * @example
 * <GenreListSection data={[{name: "Adventure"}, {name: "Romance"}]} />
 */
export default function GenreListSection({ data, selectedGenres, setSelectedGenres, exclusionMode, inclusionMode, setExclusionMode, setInclusionMode }: Props) {
    const [open, setOpen] = useState(true)
    const { isSelected, selectType } = useSelectGenre(selectedGenres, setSelectedGenres)
    const [search, setSearch] = useState<string>("")
    const filteredData = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

    const handleSearchGenre = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    return (
        <section className="flex flex-col w-full gap-3">
            {/* TITLE */}
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between cursor-pointer select-none"
            >
                <Label className="text-sm font-semibold">Genre</Label>

                <ChevronDown
                    className={`
            w-4 h-4 text-gray-400 transition-transform duration-300
            ${open ? "rotate-180" : ""}
          `}
                />
            </div>

            {/* CONTENT */}
            <div
                className={`
        flex flex-col gap-3
        transition-all duration-300
        ${open ? "opacity-100 max-h-100" : "opacity-0 max-h-0 overflow-hidden"}
        `}
            >

                {/* SEARCH */}
                <div className="flex items-center w-full h-10 rounded-lg bg-white/5 border border-white/10 px-2">
                    <Input
                        onChange={handleSearchGenre}
                        placeholder="Search Genre"
                        className="flex-1 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    />

                    <Search className="w-4 h-4 text-gray-400" />
                </div>

                {/* GENRE LIST */}
                <div className="flex flex-wrap gap-2 max-h-50 overflow-y-auto pr-1">
                    {filteredData?.map(({ name, slug }, i) => (
                        <Badge
                            key={i}
                            onClick={() => selectType(name, slug, "genre")}
                            className={`
              px-3 py-1.5 rounded-md text-xs border cursor-pointer transition
              ${isSelected(slug, "genre")
                                    ? "border-primary bg-primary/20 text-white"
                                    : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"}
              `}
                        >
                            {name}
                        </Badge>
                    ))}
                </div>
                <div className='flex flex-col w-full gap-2 text-gray-400'>
                    <section className='flex flex-col w-full gap-1 '>
                        <Label className='text-sm font-semibold'>Inclusion Mode</Label>
                        <GenreModeDropdown genreMode={inclusionMode} setGenreMode={setInclusionMode} mode='include' />
                    </section>
                    <section className='flex flex-col w-full gap-1 '>
                        <Label className='text-sm font-semibold'>Exclusion Mode</Label>
                        <GenreModeDropdown genreMode={exclusionMode} setGenreMode={setExclusionMode} mode='exclude' />
                    </section>
                </div>
            </div>
        </section>
    )
}
