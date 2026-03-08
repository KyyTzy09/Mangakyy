import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ComicType } from "@/shared/interfaces";
import { cleanText } from "@/shared/utils/cleaner";
import { Button } from "@/shared/shadcn/button";
import { useNavigate } from "@tanstack/react-router";
import { Book, Crown, Star } from "lucide-react";

interface Props {
    recommendations: ComicType[]
}

export default function CarouselSection({ recommendations }: Props) {
    const [[index, direction], setSlide] = useState([0, 0]);
    const navigate = useNavigate()

    const paginate = (newIndex: number) => {
        const newDirection = newIndex > index ? 1 : -1;
        setSlide([newIndex, newDirection]);
    };

    // autoplay
    useEffect(() => {
        const interval = setInterval(() => {
            setSlide(([prev]) => [
                (prev + 1) % recommendations.length,
                1
            ]);
        }, 5000);

        return () => clearInterval(interval);
    }, [recommendations.length]);

    const slide = recommendations[index];

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0
        })
    };

    return (
        <div className="relative flex flex-col w-full gap-2">
            {/* animated area */}
            <div className="relative h-[230px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-2xl bg-zinc-900 mb-1 sm:mb-0">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={index}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0"
                    >
                        {/* background */}
                        <img
                            src={slide?.cover_image_url}
                            alt="no-image"
                            className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl scale-110"
                        />

                        {/* content */}
                        <div className="relative flex h-full items-center gap-8 px-5 md:px-10">

                            <img
                                src={slide?.cover_image_url}
                                alt="no-image"
                                className="w-auto h-[70%] md:w-55 md:h-75 object-cover rounded-xl shadow-lg"
                            />

                            <div className="flex flex-col max-w-xl gap-2">
                                <div className="hidden gap-2 md:flex">
                                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full text-[10px] md:text-md">
                                        TRENDING
                                    </span>

                                    {slide?.taxonomy?.Genre.map(({ name, slug }) => (
                                        <span key={slug} className="bg-zinc-700 text-white text-[10px] md:text-xs px-3 py-1 rounded-full">
                                            {name}
                                        </span>
                                    ))}
                                </div>

                                <h1 className="text-lg line-clamp-1 md:line-clamp-none md:text-4xl font-bold text-white">
                                    {slide?.title}
                                </h1>

                                <p className="text-zinc-400 line-clamp-2 md:line-clamp-3">
                                    {cleanText(slide?.description)}
                                </p>

                                <div className="flex gap-6 text-sm text-zinc-300">
                                    <span className="flex gap-1"><Star className="w-4 h-4 fill-yellow-400 text-white" /> {slide?.user_rate}</span>
                                    <span className="flex gap-1"><Book className="w-4 h-4 text-white" /> {slide?.latest_chapter_number} Chapters</span>
                                    <span className="hidden md:flex gap-1"><Crown className="w-4 h-4 fill-yellow-400" /> Rank #{slide?.rank}</span>
                                </div>
                                <div className="flex items-center justify-start w-full">
                                    <Button
                                        onClick={() => navigate({ to: `/detail/$mangaId`, params: { mangaId: slide?.manga_id! } })}
                                        className="w-auto bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-medium">
                                        Read Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* dots (OUTSIDE motion div, jadi gak ikut geser) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {recommendations.map((_, i) => (
                    <button
                        title="Y"
                        key={i}
                        onClick={() => paginate(i)}
                        className={`h-2 rounded-full transition-all duration-300 ${i === index
                            ? "w-6 bg-blue-500"
                            : "w-2 bg-zinc-500"
                            }`}
                    />
                ))}
            </div>

        </div >
    );
}