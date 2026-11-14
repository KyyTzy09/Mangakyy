import { useRef, useEffect } from 'react'

interface Props {
  value: string
  onChange: (val: string) => void
  disabled?: boolean
  autoFocus?: boolean
}

export default function H18PasscodeInput({
  value,
  onChange,
  disabled = false,
  autoFocus = true,
}: Props) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])
  const chars = Array.from({ length: 11 }, (_, i) => value[i] || '')

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus()
    }
  }, [autoFocus])

  const handleInputChange = (index: number, char: string) => {
    if (char.length > 1) {
      char = char.slice(-1)
    }

    const nextChars = [...chars]
    nextChars[index] = char
    const nextVal = nextChars.join('').slice(0, 11)
    onChange(nextVal)

    // Move to next input if char is entered
    if (char && index < 10) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!chars[index] && index > 0) {
        inputsRef.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 10) {
      e.preventDefault()
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').trim().slice(0, 11)
    if (!pasted) return

    onChange(pasted)
    const focusIndex = Math.min(pasted.length, 10)
    inputsRef.current[focusIndex]?.focus()
  }

  return (
    <div className="flex items-center justify-between gap-1 sm:gap-1.5 w-full max-w-full overflow-x-auto py-1">
      {Array.from({ length: 11 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el
          }}
          type="text"
          inputMode="text"
          maxLength={1}
          value={chars[i] || ''}
          disabled={disabled}
          onChange={(e) => handleInputChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-7 h-10 sm:w-9 sm:h-12 text-center text-sm sm:text-base font-mono font-bold text-white bg-black/60 border border-white/20 focus:border-[#ff2d78] focus:ring-1 focus:ring-[#ff2d78] rounded-lg outline-none transition-all selection:bg-[#ff2d78] selection:text-white"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  )
}
