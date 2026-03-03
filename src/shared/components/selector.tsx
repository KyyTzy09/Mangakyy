import React from 'react'
import { Button } from '../shadcn/button'

interface Props {
    items: { title: string, value: string }[]
    selectedValue: string
    setSelectedValue: React.Dispatch<React.SetStateAction<"manga" | "manhua" | "manhwa">>
}

export default function Selector({ items, selectedValue, setSelectedValue }: Props) {
    return (
        <div className='flex items-center justify-between bg-gray-600/20 backdrop-blur-sm w-auto h-auto p-2 rounded-full gap-2'>
            {items.map(({ title, value }, i) => {
                return (
                    <Button
                        key={i}
                        onClick={() => setSelectedValue(value as "manga" | "manhua" | "manhwa")}
                        className={`${value === selectedValue ? "bg-primary text-white" : "bg-transparent text-gray-400"} rounded-full transition duration-700 font-semibold hover:text-white hover:bg-transparent`}>
                        {title}
                    </Button>
                )
            })}
        </div>
    )
}
