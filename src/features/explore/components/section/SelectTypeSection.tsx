
import type { SearchTaxonomyType } from '@/shared/interfaces/search'
import { Badge } from '@/shared/shadcn/badge'
import React, { useState } from 'react'
import { useSelectGenre } from '../../hooks/useSelectGenre'
import { ChevronDown } from 'lucide-react'
import { Label } from '@/shared/shadcn/label'

interface Props {
    selectedTypes: SearchTaxonomyType
    setSelectedTypes: React.Dispatch<React.SetStateAction<SearchTaxonomyType>>
}

const typeItems = [
    { name: "Project", slug: "project" },
    { name: "Mirror", slug: "mirror" },
]

export default function SelectTypesection({ selectedTypes, setSelectedTypes }: Props) {
    const [open, setOpen] = useState(false)
    const { isSelected, selectType } = useSelectGenre(selectedTypes, setSelectedTypes)

    return (
        <section className="flex flex-col w-full gap-3">
            {/* TITLE */}
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between cursor-pointer select-none"
            >
                <Label className="text-sm font-semibold">Type</Label>

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
                {/* Format LIST */}
                <div className="flex flex-wrap gap-2 max-h-50 overflow-y-auto pr-1">
                    {typeItems?.map(({ name, slug }, i) => (
                        <Badge
                            key={i}
                            onClick={() => selectType(name, slug, "type")}
                            className={`
              px-3 py-1.5 rounded-md text-xs border cursor-pointer transition
              ${isSelected(slug, "type")
                                    ? "border-primary bg-primary/20 text-white"
                                    : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"}
              `}
                        >
                            {name}
                        </Badge>
                    ))}
                </div>
            </div>
        </section>
    )
}