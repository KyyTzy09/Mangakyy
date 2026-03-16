import type { SearchTaxonomyType } from '@/shared/interfaces/search'
import React, { useState } from 'react'
import { useSelectGenre } from '../../hooks/useSelectGenre'
import { Label } from '@/shared/shadcn/label'
import { ChevronDown } from 'lucide-react'
import { Badge } from '@/shared/shadcn/badge'

interface Props {
    selectedStatus: SearchTaxonomyType
    setSelectedStatus: React.Dispatch<React.SetStateAction<SearchTaxonomyType>>
}

const statusItems = [
    { name: "Completed", slug: "completed" },
    { name: "On Going", slug: "ongoing" },
    { name: "Hiatus", slug: "hiatus" },
]

export default function SelectStatussection({ selectedStatus, setSelectedStatus }: Props) {
    const [open, setOpen] = useState(false)
    const { isSelected, selectType } = useSelectGenre(selectedStatus, setSelectedStatus)

    return (
        <section className="flex flex-col w-full gap-3">
            {/* TITLE */}
            <div
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between cursor-pointer select-none"
            >
                <Label className="text-sm font-semibold">Status</Label>

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
                    {statusItems?.map(({ name, slug }, i) => (
                        <Badge
                            key={i}
                            onClick={() => selectType(name, slug, "status")}
                            className={`
              px-3 py-1.5 rounded-md text-xs border cursor-pointer transition
              ${isSelected(slug, "status")
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