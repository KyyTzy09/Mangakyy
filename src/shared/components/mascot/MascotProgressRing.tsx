import { motion } from 'motion/react'

export interface MascotProgressRingProps {
  type: 'welcome' | 'loading' | 'error'
  progress?: number // 0 to 100 (for determinate mode)
  size?: 'sm' | 'md' | 'lg'
  showPulse?: boolean
  className?: string
}

const SIZES = {
  sm: {
    container: 'w-36 h-36',
    mascot: 'w-22 h-22',
    radius: 64,
    strokeWidth: 5,
    viewBoxSize: 150,
  },
  md: {
    container: 'w-48 h-48 sm:w-56 sm:h-56',
    mascot: 'w-28 h-28 sm:w-36 sm:h-36',
    radius: 86,
    strokeWidth: 6,
    viewBoxSize: 200,
  },
  lg: {
    container: 'w-60 h-60 sm:w-72 sm:h-72',
    mascot: 'w-38 h-38 sm:w-48 sm:h-48',
    radius: 112,
    strokeWidth: 7,
    viewBoxSize: 260,
  },
}

export default function MascotProgressRing({
  type,
  progress,
  size = 'md',
  showPulse = true,
  className = '',
}: MascotProgressRingProps) {
  const isIndeterminate = progress === undefined
  const config = SIZES[size]
  const center = config.viewBoxSize / 2
  const circumference = 2 * Math.PI * config.radius
  const strokeDashoffset = isIndeterminate
    ? circumference * 0.7
    : circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference

  const mascotSrc =
    type === 'welcome'
      ? '/mascots/welcome.webp'
      : type === 'error'
        ? '/mascots/error.webp'
        : '/mascots/loading.webp'
  const mascotAlt =
    type === 'welcome'
      ? 'MangaKyy Welcome Mascot'
      : type === 'error'
        ? 'MangaKyy Error Mascot'
        : 'MangaKyy Loading Mascot'

  return (
    <div
      className={`relative flex items-center justify-center select-none ${config.container} ${className}`}
      aria-label={`${type} mascot progress`}
    >
      {/* Ambient Pulsing Glow behind Mascot */}
      {showPulse && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-sky-500/15 to-purple-500/20 blur-xl pointer-events-none"
          animate={{
            scale: [0.92, 1.08, 0.92],
            opacity: [0.35, 0.7, 0.35],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Circular Progress Ring SVG */}
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none ${
          isIndeterminate ? 'animate-spin' : ''
        }`}
        style={isIndeterminate ? { animationDuration: '1.4s' } : undefined}
        viewBox={`0 0 ${config.viewBoxSize} ${config.viewBoxSize}`}
      >
        <defs>
          <linearGradient id={`ring-gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#1978e5" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id={`ring-glow-${type}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Track Circle */}
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={config.strokeWidth}
          className="transition-colors"
        />

        {/* Outer subtle decorative dashed ring */}
        <circle
          cx={center}
          cy={center}
          r={config.radius + config.strokeWidth + 3}
          fill="none"
          stroke="rgba(56, 189, 248, 0.12)"
          strokeWidth={1}
          strokeDasharray="4 6"
        />

        {/* Foreground Animated Progress Circle */}
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke={`url(#ring-gradient-${type})`}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter={`url(#ring-glow-${type})`}
          className={
            !isIndeterminate
              ? 'transition-[stroke-dashoffset] duration-200 ease-out -rotate-90 origin-center'
              : '-rotate-90 origin-center'
          }
        />
      </svg>

      {/* Mascot Image with Gentle Floating Animation */}
      <motion.div
        className="relative z-10 flex items-center justify-center"
        animate={{
          y: [0, -6, 0],
          rotate: isIndeterminate ? [0, -1.5, 0, 1.5, 0] : [0, -2, 0, 2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img
          src={mascotSrc}
          alt={mascotAlt}
          className={`${config.mascot} object-contain filter drop-shadow-xl select-none pointer-events-none transform-gpu will-change-transform`}
          loading="eager"
          decoding="async"
        />
      </motion.div>
    </div>
  )
}
