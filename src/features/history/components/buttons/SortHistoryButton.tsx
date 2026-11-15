import { Button } from '@/shared/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn/dropdown-menu'
import { ArrowUpDown } from 'lucide-react'
import { useState } from 'react'

export type SortType = 'newest' | 'oldest'

interface Props {
  onChange?: (sort: SortType) => void
}

export default function SortHistoryButton({ onChange }: Props) {
  const [sort, setSort] = useState<SortType>('newest')

  const handleSort = (value: SortType) => {
    setSort(value)
    onChange?.(value)
  }

  const label: Record<SortType, string> = {
    newest: 'Terbaru',
    oldest: 'Terlama',
  }

  const dropDownItems: { label: string; value: SortType }[] = [
    { label: 'Terbaru', value: 'newest' },
    { label: 'Terlama', value: 'oldest' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1.5 bg-primary/20 hover:bg-primary/30 text-primary border-primary/40 hover:border-primary/60 font-semibold cursor-pointer rounded-xl h-10 px-3.5 transition-all shadow-sm"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Urutkan: {label[sort]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex flex-col bg-slate-900/95 backdrop-blur-md border border-white/10 text-white rounded-xl p-1 min-w-[130px] z-50 shadow-2xl"
        align="end"
      >
        {dropDownItems.map(({ value, label: itemLabel }) => (
          <DropdownMenuItem
            key={value}
            className={`px-3 py-2 rounded-lg cursor-pointer text-sm font-medium transition-colors ${
              sort === value
                ? 'bg-primary text-white font-bold'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
            onSelect={() => handleSort(value)}
          >
            {itemLabel}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
