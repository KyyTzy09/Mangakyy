import { LayoutGrid, List } from "lucide-react"
import { useState } from "react"

type ViewMode = "grid" | "list"

interface Props {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

export function CardLayoutSwitcher({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-[#1e1e1e] p-1 rounded-xl">

      <button
        onClick={() => onChange("grid")}
        className={`p-2 rounded-lg transition ${value === "grid"
            ? "bg-primary text-white"
            : "text-gray-400 hover:text-white"
          }`}
      >
        <LayoutGrid size={18} />
      </button>

      <button
        onClick={() => onChange("list")}
        className={`p-2 rounded-lg transition ${value === "list"
            ? "bg-primary text-white"
            : "text-gray-400 hover:text-white"
          }`}
      >
        <List size={18} />
      </button>

    </div>
  )
}