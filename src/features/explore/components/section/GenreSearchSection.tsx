import { CardLayoutSwitcher } from '@/features/manga/components/interacts/CardLayoutSwitcher'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Filter, Search } from 'lucide-react'

interface Props {
    cardLayout: "grid" | "list"
    setCardLayout: (layout: "grid" | "list") => void
    setQuery: (query: string) => void
    setOpenFilter: (open: boolean) => void
}

export default function GenreSearchSection({ cardLayout, setCardLayout, setQuery, setOpenFilter }: Props) {
    return (
        <section className='flex flex-col items-center justify-between w-full gap-2'>
            {/* Medium and above */}
            <div className="hidden md:flex items-center justify-between w-full">
                <div className='flex text-gray-400 items-center justify-between w-40 md:w-60 h-full rounded-md bg-gray-600/20 backdrop-blur-sm pl-2 gap-1'>
                    <Button className='flex items-center justify-center w-5 h-full rounded-md bg-transparent hover:bg-transparent text-white px-0'>
                        <Search className='w-4 h-4' />
                    </Button>
                    <div className='flex items-center justify-start w-[95%] h-10'>
                        <Input onChange={(e) => setQuery(e.target.value)} placeholder="Cari Komik" className="w-full h-full aria-selected:ring-0 focus-visible:ring-0 border-0 pl-1 text-[12px] md:text-sm" />
                    </div>
                </div>
                <CardLayoutSwitcher value={cardLayout} onChange={setCardLayout} />
            </div>
            {/* Small */}
            <div className='md:hidden flex items-center justify-between w-full gap-2'>
                <CardLayoutSwitcher value={cardLayout} onChange={setCardLayout} />
                <Button
                    onClick={() => setOpenFilter(true)}
                >
                    <Filter className='w-5 h-5' />
                </Button>
            </div>
            <div className='flex md:hidden text-gray-400 items-center justify-between w-full h-full rounded-md bg-gray-600/20 backdrop-blur-sm pl-2 gap-1'>
                <Button className='flex items-center justify-center w-5 h-full rounded-md bg-transparent hover:bg-transparent text-white px-0'>
                    <Search className='w-4 h-4' />
                </Button>
                <div className='flex items-center justify-start w-full h-10'>
                    <Input onChange={(e) => setQuery(e.target.value)} placeholder="Cari Komik" className="w-full h-full aria-selected:ring-0 focus-visible:ring-0 border-0 pl-1 text-[12px] md:text-sm" />
                </div>
            </div>
        </section>
    )
}
