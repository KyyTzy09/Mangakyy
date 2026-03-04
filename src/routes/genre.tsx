import { Badge } from '@/shared/shadcn/badge'
import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Label } from '@/shared/shadcn/label'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'

export const Route = createFileRoute('/genre')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex items-center justify-start min-h-screen bg-linear-to-br from-[#0f172a] via-[#0b1a33] to-black/80 text-slate-100 pt-24 p-4'>
      <aside className='flex flex-col items-center justify-start w-1/4 h-full min-h-screen border-gray-200/50 border rounded-md p-3 px-5 gap-2'>
        <section className='flex flex-col w-full gap-2'>
          <div className='flex items-center justify-between w-full'>
            <Label className='text-[14px]'>Genre</Label>
          </div>
          <div className='flex text-gray-400 items-center justify-between w-full h-full rounded-md bg-gray-600/20 backdrop-blur-sm pl-2 gap-2'>
            <div className='flex items-center justify-start w-[80%] gap-2'>
              <Input placeholder="Cari Genre" className='w-[70%] h-full aria-selected:ring-0 focus-visible:ring-0 border-0' />
            </div>
            <Button className='flex items-center justify-center w-10 h-full rounded-md bg-primary text-white px-2'>
              <Search className='w-4 h-4' />
            </Button>
          </div>
          <div className='flex flex-wrap items-center justify-start w-full gap-2 max-h-30 overflow-y-auto'>
            {Array.from({ length: 10 }).map((_, index) => (
              <Badge className='flex items-center justify-center h-10 rounded-md bg-transparent border border-gray-400 hover:border-primary hover:text-primary'>
                Genre {index + 1}
              </Badge>
            ))}
          </div>
        </section>
      </aside>
    </div>
  )
}
