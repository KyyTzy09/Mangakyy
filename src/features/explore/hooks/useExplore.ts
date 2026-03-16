import type { SearchTaxonomyType } from "@/shared/interfaces/search"
import { useState } from "react"
import type { SelectedGenreMode } from "./useGenreMode"

export const useExplore = () => {
    const [openFilter, setOpenFilter] = useState<boolean>(false)
    const [selectedSearch, setSelectedSearch] = useState<SearchTaxonomyType>([])
    const [query, setQuery] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [cardLayout, setCardLayout] = useState<'grid' | 'list'>('grid')
    const [inclusionMode, setInclusionMode] = useState<SelectedGenreMode>({ name: 'Or', slug: 'or', type: 'include' })
    const [exclusionMode, setExclusionMode] = useState<SelectedGenreMode>({ name: 'Or', slug: 'or', type: 'exclude' })

    return {
        openFilter,
        setOpenFilter,
        selectedSearch,
        setSelectedSearch,
        query,
        setQuery,
        currentPage,
        setCurrentPage,
        cardLayout,
        setCardLayout,
        inclusionMode,
        setInclusionMode,
        exclusionMode,
        setExclusionMode,
    }
}