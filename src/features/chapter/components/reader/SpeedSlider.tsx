import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/shared/shadcn/button';

interface SpeedSliderProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  onDone: () => void;
}

export default function SpeedSlider({ speed, onSpeedChange, onDone }: SpeedSliderProps) {
  return (
    <motion.div
      key="speed-slider"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-4 w-full"
    >
      <div className="flex items-center gap-3 flex-1 text-white">
        <span className="text-sm font-medium w-8 text-right">0.1x</span>
        
        <div className="relative flex-1 flex items-center group">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {speed}x
          </div>
          <input
            type="range"
            min="0.1"
            max="2"
            step="0.1"
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer h-2 bg-white/20 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
        
        <span className="text-sm font-medium w-6">2x</span>
      </div>
      
      <Button 
        onClick={onDone} 
        variant="default"
        className="bg-primary text-white hover:bg-blue-400 shrink-0"
      >
        Selesai
      </Button>
    </motion.div>
  );
}
