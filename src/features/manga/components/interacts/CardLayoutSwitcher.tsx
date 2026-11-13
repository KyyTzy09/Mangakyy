import { LayoutGrid, List } from 'lucide-react'

export type ViewMode = 'grid' | 'list'

interface Props {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}

export function CardLayoutSwitcher({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 bg-[#111622]/90 border border-white/10 p-1 rounded-xl">
      <button
        type="button"
        onClick={() => onChange('grid')}
        aria-label="Grid layout"
        className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${
          value === 'grid'
            ? 'bg-primary text-white shadow-sm shadow-primary/30'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <LayoutGrid className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </button>

      <button
        type="button"
        onClick={() => onChange('list')}
        aria-label="List layout"
        className={`p-1.5 sm:p-2 rounded-lg transition-all cursor-pointer ${
          value === 'list'
            ? 'bg-primary text-white shadow-sm shadow-primary/30'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <List className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </button>
    </div>
  )
}

export default CardLayoutSwitcher
