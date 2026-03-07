import type { TaxonomyItem } from "@/shared/interfaces";
import { useState } from "react";

export const useSelectGenre = (selectedGenres: TaxonomyItem[], setSelectedGenres: React.Dispatch<React.SetStateAction<TaxonomyItem[]>>) => {
    function isSelectedGenre(slug: string) {
        return selectedGenres?.some((g) => g.slug === slug);
    }

    function selectGenres(name: string, slug: string) {
        setSelectedGenres((prev) => {
            const exists = prev.some((g) => g.slug === slug)
            if (exists) {
                return prev.filter((g) => g.slug !== slug)
            }

            return [...prev, { name, slug }]
        });
    };

    function unselectGenres(slug: string) {
        setSelectedGenres((prev) => prev.filter((g) => g.slug !== slug));
    }

    return { selectGenres, unselectGenres, isSelectedGenre }
}