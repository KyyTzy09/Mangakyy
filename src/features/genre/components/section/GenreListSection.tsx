import type { TaxonomyItem } from '@/shared/interfaces'
import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Label } from '@/shared/shadcn/label'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useSelectGenre } from '../../hooks/useSelectGenre'

interface Props {
    data: TaxonomyItem[]
    selectedGenres: TaxonomyItem[]
    setSelectedGenres: React.Dispatch<React.SetStateAction<TaxonomyItem[]>>
}

/**
 * GenreListSection is a component that displays a list of genres
 * @param {Props} props - props object
 * @param {TaxonomyItem[]} props.data - list of taxonomy items
 * @returns {JSX.Element} - JSX element
 * @example
 * <GenreListSection data={[{name: "Adventure"}, {name: "Romance"}]} />
 */
export default function GenreListSection({ data, selectedGenres, setSelectedGenres }: Props) {
    const { isSelectedGenre, selectGenres } = useSelectGenre(selectedGenres, setSelectedGenres)
    const [search, setSearch] = useState<string>("")
    const filteredData = data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

    const handleSearchGenre = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    return (
        <section className='flex flex-col items-start justify-center w-full gap-2 bg-bl'>
            <div className='flex items-center justify-between w-full'>
                <Label className='text-[14px]'>Genre</Label>
            </div>
            <div className='flex text-gray-400 items-center justify-between w-full h-full rounded-md bg-gray-600/20 backdrop-blur-sm pl-2 gap-2'>
                <div className='flex items-center justify-start w-[80%] gap-2'>
                    <Input onChange={handleSearchGenre} placeholder="Cari Genre" className='w-[70%] h-full aria-selected:ring-0 focus-visible:ring-0 border-0' />
                </div>
                <Button className='flex items-center justify-center w-10 h-full rounded-md bg-primary text-white px-2'>
                    <Search className='w-4 h-4' />
                </Button>
            </div>
            <div className='flex flex-wrap items-center justify-start w-full gap-2 max-h-32 overflow-y-auto'>
                {filteredData?.map(({ name, slug }, i) => (
                    <Badge
                        key={i}
                        onClick={() => selectGenres(name, slug)}
                        className={`flex items-center justify-center h-10 rounded-md border cursor-pointer transition
                                ${isSelectedGenre(slug)
                                ? "border-primary bg-primary/20 text-white"
                                : "border-gray-400 bg-gray-600/20 text-gray-200 hover:opacity-75"}`
                        }
                    >
                        {name}
                    </Badge>
                ))}
            </div>
        </section>
    )
}
