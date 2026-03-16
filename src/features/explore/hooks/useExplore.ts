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


    const selectedGenres = selectedSearch.filter((g) => g.type === "genre").map((g) => g.slug)
    const selectedTypes = selectedSearch.filter((g) => g.type === "type").map((g) => g.slug)
    const selectedStatus = selectedSearch.filter((g) => g.type === "status").map((g) => g.slug)
    const selectedFormats = selectedSearch.filter((g) => g.type === "format").map((g) => g.slug)

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
        selectedGenres,
        selectedTypes,
        selectedStatus,
        selectedFormats
    }
}