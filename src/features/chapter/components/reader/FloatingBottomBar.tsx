import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Settings, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/shadcn/button';
import SpeedSlider from './SpeedSlider';

interface FloatingBottomBarProps {
  isVisible: boolean;
  isSpeedMode: boolean;
  isAutoScrolling: boolean;
  scrollSpeed: number;
  prevChapterId: string | null;
  prevChapterNumber: number | null;
  nextChapterId: string | null;
  nextChapterNumber: number | null;
  onPrev: () => void;
  onNext: () => void;
  onToggleAutoScroll: () => void;
  onEnterSpeedMode: () => void;
  onExitSpeedMode: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function FloatingBottomBar({
  isVisible,
  isSpeedMode,
  isAutoScrolling,
  scrollSpeed,
  prevChapterId,
  prevChapterNumber,
  nextChapterId,
  nextChapterNumber,
  onPrev,
  onNext,
  onToggleAutoScroll,
  onEnterSpeedMode,
  onExitSpeedMode,
  onSpeedChange,
}: FloatingBottomBarProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-[#111]/90 backdrop-blur-xl z-50 rounded-t-xl p-4 text-white"
        >
          <AnimatePresence mode="wait">
            {isSpeedMode ? (
              <SpeedSlider
                speed={scrollSpeed}
                onSpeedChange={onSpeedChange}
                onDone={onExitSpeedMode}
              />
            ) : (
              <motion.div
                key="normal-mode"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between gap-2"
              >
                {/* Previous Chapter Button */}
                <Button
                  variant="ghost"
                  onClick={onPrev}
                  disabled={prevChapterId === null}
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Ch.{prevChapterNumber ?? '-'}
                </Button>

                {/* Center Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleAutoScroll}
                    className="text-white hover:bg-white/10 hover:text-white rounded-full w-12 h-12"
                  >
                    {isAutoScrolling ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onEnterSpeedMode}
                    className="text-white hover:bg-white/10 hover:text-white rounded-full w-12 h-12"
                  >
                    <Settings className="w-6 h-6" />
                  </Button>
                </div>

                {/* Next Chapter Button */}
                <Button
                  variant="ghost"
                  onClick={onNext}
                  disabled={nextChapterId === null}
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  Ch.{nextChapterNumber ?? '-'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
