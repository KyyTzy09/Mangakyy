import type React from "react"

export type GenreMode = "include" | "exclude"
export interface SelectedGenreMode {
    name: string
    slug: string
    type: GenreMode
}

export const useGenreMode = (selectedMode: SelectedGenreMode, setSelectedMode: React.Dispatch<React.SetStateAction<SelectedGenreMode>>) => {
    function isSelected(slug: string, type: GenreMode) {
        return selectedMode?.slug === slug && selectedMode?.type === type
    }

    function selectType(name: string, slug: string, type: GenreMode) {
        setSelectedMode((prev) => {
            if (prev.slug === slug && prev.type === type) {
                return { name: "", slug: "", type: "include" }
            }

            return { name, slug, type }
        })
    }

    return { selectType, isSelected }
}