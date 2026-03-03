import { Label } from '@/shared/shadcn/label'
import { motion } from 'motion/react'
import React from 'react'

interface Props {
    count: number
}

export default function RecommendationCardSkeleton({ count }: Props) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ translateY: 10 }}
                    animate={{ translateY: 0 }}
                    exit={{ translateY: 10 }}
                    transition={{ delay: index * 0.05 }}
                    className='group flex flex-col w-full h-auto font-primary text-white bg-black/30 gap-3 p-2 rounded-sm animate-pulse'>
                    <div className='relative w-full h-65 overflow-hidden rounded-md bg-gray-800' />
                    <div className='flex flex-col w-full font-semibold gap-1'>
                        <div className='h-4 w-3/4 bg-gray-700 rounded-sm' />
                        <div className='h-3 w-1/2 bg-gray-700 rounded-sm' />
                    </div>
                    <div className='flex w-full items-center justify-between text-gray-400 text-[10px]'>
                        <Label className='flex items-center justify-start gap-1'>
                            <div className='w-4 h-4 bg-gray-700 rounded-full' />
                        </Label>
                        <Label className='flex items-center justify-between'>
                            <div className='h-3 w-16 bg-gray-700 rounded-sm' />
                        </Label>
                    </div>
                </motion.div>
            ))}
        </>
    )
}
