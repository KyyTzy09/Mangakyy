import { Badge } from '@/shared/shadcn/badge'
import { Label } from '@/shared/shadcn/label'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { useSelectGenre } from '../../hooks/useSelectGenre'
import type { SearchTaxonomyType } from '@/shared/interfaces/search'

interface Props {
  selectedFormats: SearchTaxonomyType
  setSelectedFormats: React.Dispatch<React.SetStateAction<SearchTaxonomyType>>
}

const formatItems = [
  { name: "Manga", slug: "manga" },
  { name: "Manhwa", slug: "manhwa" },
  { name: "Manhua", slug: "manhua" },
]

export default function SelectFormatSection({ selectedFormats, setSelectedFormats }: Props) {
  const [open, setOpen] = useState(false)
  const { isSelected, selectType } = useSelectGenre(selectedFormats, setSelectedFormats)

  return (
    <section className="flex flex-col w-full gap-3">
      {/* TITLE */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <Label className="text-sm font-semibold">Format</Label>

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
          {formatItems?.map(({ name, slug }, i) => (
            <Badge
              key={i}
              onClick={() => selectType(name, slug, "format")}
              className={`
              px-3 py-1.5 rounded-md text-xs border cursor-pointer transition
              ${isSelected(slug, "format")
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

