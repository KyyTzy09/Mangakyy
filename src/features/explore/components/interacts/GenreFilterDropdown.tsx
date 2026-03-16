import { Label } from '@/shared/shadcn/label'
import { Separator } from '@/shared/shadcn/separator'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import GenreListSection from '../section/GenreListSection'
import { Button } from '@/shared/shadcn/button'
import type { TaxonomyItem } from '@/shared/interfaces'
import { useEffect, useState } from 'react'
import type { SearchTaxonomyType } from '@/shared/interfaces/search'
import SelectStatussection from '../section/SelectStatusSection'
import SelectTypesection from '../section/SelectTypeSection'
import SelectFormatSection from '../section/SelectFormatSection'
import type { SelectedGenreMode } from '../../hooks/useGenreMode'
interface Props {
    genres: TaxonomyItem[]
    isOpen: boolean
    selectedSearch: SearchTaxonomyType
    inclusionMode: SelectedGenreMode
    exclusionMode: SelectedGenreMode
    setInclusionMode: React.Dispatch<React.SetStateAction<SelectedGenreMode>>
    setExclusionMode: React.Dispatch<React.SetStateAction<SelectedGenreMode>>
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedSearch: React.Dispatch<React.SetStateAction<SearchTaxonomyType>>
}

export default function GenreFilterDropdown({ isOpen, selectedSearch, inclusionMode, exclusionMode, setExclusionMode, setInclusionMode, setIsOpen, setSelectedSearch, genres }: Props) {
    const [tempSelectedSearch, setTempSelectedSearch] = useState<SearchTaxonomyType>([])
    const [tempInclusionMode, setTempInclusionMode] = useState<SelectedGenreMode>(inclusionMode)
    const [tempExclusionMode, setTempExclusionMode] = useState<SelectedGenreMode>(exclusionMode)

    const handleFilter = () => {
        setSelectedSearch(tempSelectedSearch)
        setInclusionMode(tempInclusionMode)
        setExclusionMode(tempExclusionMode)
        setIsOpen(false)
    }

    useEffect(() => {
        setTempSelectedSearch(selectedSearch)
    }, [selectedSearch])

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
                        className='fixed flex flex-col items-center justify-between md:hidden w-full h-screen max-h-[90vh] bottom-0 left-0 right-0 z-60 bg-[#111]/90 backdrop-blur-xl p-5 gap-5 overflow-y-auto rounded-tl-lg rounded-tr-lg'>
                        <div className='flex flex-col w-full items-center justify-start gap-5'>
                            <section className='flex items-center justify-between w-full gap-2'>
                                <Label className="text-lg font-semibold">Filter</Label>
                                <button onClick={() => setIsOpen(false)}>
                                    <X className='w-5 h-5 cursor-pointer' />
                                </button>
                            </section>
                            <Separator className='bg-gray-400/40' />
                            <section className='flex flex-col w-full items-center justify-start gap-4'>
                                <GenreListSection
                                    selectedGenres={tempSelectedSearch}
                                    inclusionMode={tempInclusionMode}
                                    exclusionMode={tempExclusionMode}
                                    setInclusionMode={setTempInclusionMode}
                                    setExclusionMode={setTempExclusionMode}
                                    setSelectedGenres={setTempSelectedSearch}
                                    data={genres || []}
                                />
                                <SelectFormatSection
                                    selectedFormats={tempSelectedSearch}
                                    setSelectedFormats={setTempSelectedSearch}
                                />
                                <SelectTypesection
                                    selectedTypes={tempSelectedSearch}
                                    setSelectedTypes={setTempSelectedSearch}
                                />
                                <SelectStatussection
                                    selectedStatus={tempSelectedSearch}
                                    setSelectedStatus={setTempSelectedSearch}
                                />
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
