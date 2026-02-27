import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { ComicType } from "@/shared/interfaces";
import { cleanText } from "@/shared/utils/cleaner";

interface Props {
    recommendations: ComicType[]
}

export default function CarouselSection({ recommendations }: Props) {
    const [[index, direction], setSlide] = useState([0, 0]);

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
        <div className="relative w-full">

            {/* animated area */}
            <div className="relative h-[300px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-2xl bg-zinc-900">

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
                        <div className="relative flex h-full items-center gap-8 px-10">

                            <img
                                src={slide?.cover_image_url}
                                alt="no-image"
                                className="w-55 h-75 object-cover rounded-xl shadow-lg"
                            />

                            <div className="max-w-xl">

                                <div className="flex gap-2 mb-2">
                                    <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                        TRENDING
                                    </span>

                                    {slide?.taxonomy?.Genre.map(({ name, slug }) => (
                                        <span key={slug} className="bg-zinc-700 text-white text-xs px-3 py-1 rounded-full">
                                            {name}
                                        </span>
                                    ))}
                                </div>

                                <h1 className="text-4xl font-bold text-white mb-3">
                                    {slide?.title}
                                </h1>

                                <p className="text-zinc-400 mb-4 line-clamp-3">
                                    {cleanText(slide?.description)}
                                </p>

                                <div className="flex gap-6 text-sm text-zinc-300 mb-6">
                                    <span>⭐ {slide?.user_rate}</span>
                                    <span>📖 {slide?.latest_chapter_number} Chapters</span>
                                    <span>🏆 Rank #{slide?.rank}</span>
                                </div>

                                <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-medium">
                                    Read Now
                                </button>

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

        </div>
    );
}