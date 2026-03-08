import { Label } from '@/shared/shadcn/label'
import { Separator } from '@/shared/shadcn/separator'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import GenreListSection from '../section/GenreListSection'
import { Button } from '@/shared/shadcn/button'
import type { TaxonomyItem } from '@/shared/interfaces'
import { useEffect, useState } from 'react'
interface Props {
    genres: TaxonomyItem[]
    isOpen: boolean
    selectedGenres: TaxonomyItem[]
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedGenres: React.Dispatch<React.SetStateAction<TaxonomyItem[]>>
}

export default function GenreFilterDropdown({ isOpen, setIsOpen, selectedGenres, setSelectedGenres, genres }: Props) {
    const [tempSelectedGenres, setTempSelectedGenres] = useState<TaxonomyItem[]>([])
    const handleFilter = () => {
        setSelectedGenres(tempSelectedGenres)
        setIsOpen(false)
    }

    useEffect(() => {
        setTempSelectedGenres(selectedGenres)
    }, [selectedGenres])
    
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ translateY: 200, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        exit={{ translateY: 200, opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="top-0 left-0 fixed w-full h-full bg-black/60 z-50"
                    />
                    <motion.div
                        initial={{ translateY: 200, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        exit={{ translateY: 200, opacity: 0 }}
                        className='fixed flex flex-col items-center justify-between md:hidden w-full h-screen max-h-[90vh] bottom-0 left-0 right-0 z-60 bg-[#111]/90 backdrop-blur-xl p-5 gap-5'>
                        <div className='flex flex-col w-full items-center justify-start gap-5'>
                            <section className='flex items-center justify-between w-full gap-2'>
                                <Label className="text-lg font-semibold">Filter</Label>
                                <button onClick={() => setIsOpen(false)}>
                                    <X className='w-5 h-5 cursor-pointer' />
                                </button>
                            </section>
                            <Separator className='bg-gray-400/40' />
                            <section className='flex flex-col w-full items-center justify-start gap-4'>
                                <GenreListSection selectedGenres={tempSelectedGenres} setSelectedGenres={setTempSelectedGenres} data={genres || []} />
                            </section>
                        </div>
                        <section className='flex w-full'>
                            <Button onClick={handleFilter} className='w-full'>
                                Lanjutkan
                            </Button>
                        </section>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
