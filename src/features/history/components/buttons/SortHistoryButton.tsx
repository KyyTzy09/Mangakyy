import { Button } from "@/shared/shadcn/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/shadcn/dropdown-menu"
import { useState } from "react"

export type SortType = "newest" | "oldest"

interface Props {
    onChange?: (sort: SortType) => void
}

interface Props {
    onChange?: (sort: SortType) => void
}

export default function SortHistoryButton({ onChange }: Props) {
    const [sort, setSort] = useState<SortType>("newest")

    const handleSort = (value: SortType) => {
        setSort(value)
        onChange?.(value)
    }

    const label: Record<SortType, string> = {
        newest: "Terbaru",
        oldest: "Terlama",
    }

    const dropDownItems = [
        { label: "Terbaru", value: "newest" },
        { label: "Terlama", value: "oldest" },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="bg-primary focus:bg-primary hover:bg-primary/80 text-white">
                <Button variant="outline">
                    Sort: {label[sort]}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="flex flex-col bg-primary/10 text-white gap-1" align="end">
                {dropDownItems.map(({ value, label }, i) => (
                    <DropdownMenuItem key={i} className="bg-primary focus:bg-primary/50" onSelect={() => handleSort(value as SortType)}>
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}