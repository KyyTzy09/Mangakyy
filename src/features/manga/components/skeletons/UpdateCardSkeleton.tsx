import React from 'react'

interface Props {
    count: number
}

export default function UpdateCardSkeleton({ count }: Props) {
    return (
        <>
            {Array.from({ length: count }).map(() => (
                <div className="w-full h-full border border-gray-400/60 rounded-sm overflow-hidden animate-pulse">
                    <div className="relative w-full h-60 sm:h-64 md:h-60 bg-gray-700" />

                    <div className="p-3 flex flex-col gap-2">
                        <div className="h-4 w-3/4 bg-gray-600 rounded" />

                        <div className="h-3 w-1/2 bg-gray-600 rounded" />

                        <div className="flex gap-2 mt-1">
                            <div className="h-4 w-10 bg-gray-600 rounded" />
                            <div className="h-4 w-10 bg-gray-600 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
