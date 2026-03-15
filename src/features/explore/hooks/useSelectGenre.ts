
import type { SearchTaxonomyType, SearchType } from "@/shared/interfaces/search";

export const useSelectGenre = (selectedSearch: SearchTaxonomyType, setSelectedSearch: React.Dispatch<React.SetStateAction<SearchTaxonomyType>>) => {
    function isSelected(slug: string, type: SearchType) {
        return selectedSearch?.some((g) => g.slug === slug && g.type === type);
    }

    function selectType(name: string, slug: string, type: SearchType) {
        setSelectedSearch((prev) => {
            const exists = prev.some((g) => g.slug === slug)
            if (exists) {
                return prev.filter((g) => g.slug !== slug)
            }

            return [...prev, { name, slug, type }]
        });
    };

    function unselectGenres(slug: string) {
        setSelectedSearch((prev) => prev.filter((g) => g.slug !== slug));
    }

    return { selectType, unselectGenres, isSelected }
}