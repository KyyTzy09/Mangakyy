import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseChapterReaderReturn {
  isBarsVisible: boolean;
  isAutoScrolling: boolean;
  scrollSpeed: number;
  isSpeedMode: boolean;
  isChapterEnd: boolean;
  tapProps: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
  };
  toggleAutoScroll: () => void;
  setScrollSpeed: (speed: number) => void;
  enterSpeedMode: () => void;
  exitSpeedMode: () => void;
  dismissChapterEnd: () => void;
}

/**
 * Custom hook untuk mengatur state dan interaksi pada halaman baca (Chapter Reader).
 * Menangani floating navigation bars, auto-scroll, dan tap/hold interactions.
 */
export function useChapterReader(): UseChapterReaderReturn {
  // --- States ---
  const [isBarsVisible, setIsBarsVisible] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [isSpeedMode, setIsSpeedMode] = useState(false);
  const [isChapterEnd, setIsChapterEnd] = useState(false);

  // --- Refs ---
  // Digunakan agar callback dan listener selalu mendapatkan nilai terbaru tanpa memicu re-render
  const isAutoScrollingRef = useRef(false);
  const scrollSpeedRef = useRef(scrollSpeed);
  const rafRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef(false);

  useEffect(() => {
    isAutoScrollingRef.current = isAutoScrolling;
  }, [isAutoScrolling]);

  useEffect(() => {
    scrollSpeedRef.current = scrollSpeed;
  }, [scrollSpeed]);

  // --- Interaction Handlers ---
  const handleTap = useCallback(() => {
    if (isAutoScrollingRef.current) {
      setIsAutoScrolling(false);
      setIsBarsVisible(true);
    } else {
      setIsBarsVisible((prev) => !prev);
    }
  }, []);

  const handleHold = useCallback(() => {
    setIsBarsVisible(false);
  }, []);

  // --- Tap/Hold Detection ---
  const pointerDownRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointerDownRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerDownRef.current) return;

      const { x, y, time } = pointerDownRef.current;
      const duration = Date.now() - time;
      const distanceX = Math.abs(e.clientX - x);
      const distanceY = Math.abs(e.clientY - y);

      // Reset pointer setelah diproses
      pointerDownRef.current = null;

      // Jika perpindahan kurang dari 10px, anggap sebagai tap atau hold (bukan swipe/scroll)
      if (distanceX < 10 && distanceY < 10) {
        if (duration < 200) {
          handleTap(); // Cepat = Tap
        } else {
          handleHold(); // Lama = Hold
        }
      }
    },
    [handleTap, handleHold]
  );

  // --- Auto-Scroll Logic ---
  const performAutoScroll = useCallback(() => {
    if (!isAutoScrollingRef.current) return;

    // Deteksi jika sudah sampai paling bawah halaman
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50) {
      setIsChapterEnd(true);
      setIsAutoScrolling(false);
      return;
    }

    // Hitung pergerakan pixel per frame (1x speed ~ 1.5px per frame)
    const pixelsPerFrame = scrollSpeedRef.current * 1.5;
    
    // Tandai bahwa ini adalah scroll dari sistem agar tidak di-pause oleh manual scroll detector
    isProgrammaticScrollRef.current = true;
    window.scrollBy(0, pixelsPerFrame);
    
    rafRef.current = requestAnimationFrame(performAutoScroll);
  }, []);

  // Manage RequestAnimationFrame lifecycle
  useEffect(() => {
    if (isAutoScrolling) {
      rafRef.current = requestAnimationFrame(performAutoScroll);
    } else if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Cleanup saat unmount atau isAutoScrolling berubah
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isAutoScrolling, performAutoScroll]);

  const toggleAutoScroll = useCallback(() => {
    setIsAutoScrolling((prev) => {
      const next = !prev;
      if (next) {
        setIsBarsVisible(false);
        setIsChapterEnd(false);
      }
      return next;
    });
  }, []);

  // --- Manual Scroll Detection ---
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      // Abaikan scroll yang diakibatkan oleh window.scrollBy (auto-scroll)
      if (isProgrammaticScrollRef.current) {
        isProgrammaticScrollRef.current = false;
        return;
      }

      // Throttle untuk mendeteksi manual scroll (supaya tidak berat & mencegah false pause)
      if (scrollTimeout) return;
      
      scrollTimeout = setTimeout(() => {
        setIsBarsVisible(false);
        
        // Jika auto-scroll jalan dan user scroll manual, pause auto-scroll
        if (isAutoScrollingRef.current) {
          setIsAutoScrolling(false);
        }
        scrollTimeout = null;
      }, 100); // Debounce/Throttle 100ms
    };

    // Tambahan untuk antisipasi event yang lebih agresif dari user saat scrolling manual
    const handleManualInterrupt = () => {
      setIsBarsVisible(false);
      if (isAutoScrollingRef.current) {
        setIsAutoScrolling(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleManualInterrupt, { passive: true });
    window.addEventListener('touchmove', handleManualInterrupt, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleManualInterrupt);
      window.removeEventListener('touchmove', handleManualInterrupt);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  // --- Utilities ---
  const enterSpeedMode = useCallback(() => setIsSpeedMode(true), []);
  const exitSpeedMode = useCallback(() => setIsSpeedMode(false), []);
  const dismissChapterEnd = useCallback(() => setIsChapterEnd(false), []);
  
  const handleSetScrollSpeed = useCallback((speed: number) => {
    // Batasi speed pada range 0.1 hingga 2.0
    setScrollSpeed(Math.min(Math.max(speed, 0.1), 2.0));
  }, []);

  return {
    isBarsVisible,
    isAutoScrolling,
    scrollSpeed,
    isSpeedMode,
    isChapterEnd,
    tapProps: {
      onPointerDown,
      onPointerUp,
    },
    toggleAutoScroll,
    setScrollSpeed: handleSetScrollSpeed,
    enterSpeedMode,
    exitSpeedMode,
    dismissChapterEnd,
  };
}
