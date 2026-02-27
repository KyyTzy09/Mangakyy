import { slides } from "@/shared/dummy/carouselDummy";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react"

export default function CarouselSection() {
    const [index, setIndex] = useState(0);

    // autoplay
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const slide = slides[index];

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={index}
                className="relative w-full h-95 rounded-2xl bg-zinc-900 overflow-hidden"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
            >
                {/* background blur */}
                <img
                    src={slide.image}
                    alt="no-image"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl scale-110"
                />
                {/* content */}
                <div className="relative flex h-full items-center gap-8 px-10">
                    {/* image */}
                    <img
                        src={slide.image}
                        alt="no-image"
                        className="w-55 h-75 object-cover rounded-xl shadow-lg"
                    />

                    {/* text */}
                    <div className="max-w-xl">
                        <div className="flex gap-2 mb-2">
                            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                TRENDING
                            </span>
                            <span className="bg-zinc-700 text-white text-xs px-3 py-1 rounded-full">
                                {slide.genre}
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold text-white mb-3">
                            {slide.title}
                        </h1>

                        <p className="text-zinc-400 mb-4">
                            {slide.description}
                        </p>

                        <div className="flex gap-6 text-sm text-zinc-300 mb-6">
                            <span>⭐ {slide.rating}</span>
                            <span>📖 {slide.chapters} Chapters</span>
                            <span>🏆 Rank #{slide.rank}</span>
                        </div>

                        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-medium">
                            Read Now
                        </button>

                    </div>
                </div>

                {/* dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {slides.map((_, i) => (
                        <button
                            title={"button" + i}
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-2 rounded-full transition-all ${i === index
                                ? "w-6 bg-blue-500"
                                : "w-2 bg-zinc-500"
                                }`}
                        />
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}