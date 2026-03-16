import { Button } from '@/shared/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/shadcn/dropdown-menu'
import React from 'react'
import { useGenreMode, type GenreMode, type SelectedGenreMode } from '../../hooks/useGenreMode'
import { ChevronDown } from 'lucide-react'

interface Props {
  genreMode: SelectedGenreMode
  setGenreMode: React.Dispatch<React.SetStateAction<SelectedGenreMode>>
  mode: GenreMode
}

const genreModeOptions: { label: string, value: string }[] = [
  { label: 'And', value: 'and' },
  { label: 'Or', value: 'or' },
]

export default function GenreModeDropdown({ genreMode, setGenreMode, mode }: Props) {
  const [open, setOpen] = React.useState(false)
  const { selectType, isSelected } = useGenreMode(genreMode, setGenreMode)

  return (
    <DropdownMenu open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DropdownMenuTrigger asChild className='bg-transparent focus:bg-transparent hover:text-white focus:ring-0 text-gray-400 border-gray-400'>
        <Button variant={"outline"} className='bg-transparent flex items-center justify-between w-full hover:bg-transparent focus:bg-transparent focus:ring-0 text-gray-400 border-gray-400'>
          {genreMode.name}
          <ChevronDown className={`${open ? 'rotate-0' : 'rotate-180'} w-4 h-4 ml-2 transition duration-500`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="flex flex-col 
  w-(--radix-dropdown-menu-trigger-width)
  text-gray-400 bg-black/70 backdrop-blur-md border-gray-400 gap-1 z-70"
      >
        {genreModeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            disabled={isSelected(option.value, mode)}
            onSelect={() => selectType(option.label, option.value, mode)}
            className={`${isSelected(option.value, mode) ? 'bg-primary text-white' : 'bg-transparent text-gray-400'} focus:bg-primary`}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
