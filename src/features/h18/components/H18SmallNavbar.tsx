import { Link, useLocation } from '@tanstack/react-router'
import { BookOpen, Compass, Tag, Home, Timer } from 'lucide-react'
import { Activity } from 'react'

export default function H18SmallNavbar() {
  const location = useLocation()

  const isHidden =
    location.pathname.startsWith('/h-read') ||
    location.pathname.startsWith('/h18/read')

  return (
    <Activity mode={isHidden ? 'hidden' : 'visible'}>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="flex items-center justify-around h-16 px-2 bg-black/90 backdrop-blur-lg border-t border-[#ff2d78]/30">
          <Link
            to="/h18"
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
              location.pathname === '/h18'
                ? 'bg-[#ff2d78] text-white -translate-y-3 shadow-lg shadow-[#ff2d78]/40'
                : 'text-gray-300'
            }`}
          >
            <BookOpen size={20} />
            <span className={location.pathname === '/h18' ? 'sr-only' : 'text-[10px]'}>
              Katalog
            </span>
          </Link>

          <Link
            to="/h-explore"
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
              location.pathname === '/h-explore'
                ? 'bg-[#ff2d78] text-white -translate-y-3 shadow-lg shadow-[#ff2d78]/40'
                : 'text-gray-300'
            }`}
          >
            <Compass size={20} />
            <span className={location.pathname === '/h-explore' ? 'sr-only' : 'text-[10px]'}>
              Explore
            </span>
          </Link>

          <Link
            to="/h-genre"
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
              location.pathname.startsWith('/h-genre')
                ? 'bg-[#ff2d78] text-white -translate-y-3 shadow-lg shadow-[#ff2d78]/40'
                : 'text-gray-300'
            }`}
          >
            <Tag size={20} />
            <span className={location.pathname.startsWith('/h-genre') ? 'sr-only' : 'text-[10px]'}>
              Genre
            </span>
          </Link>

          <Link
            to="/h-history"
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
              location.pathname === '/h-history'
                ? 'bg-[#ff2d78] text-white -translate-y-3 shadow-lg shadow-[#ff2d78]/40'
                : 'text-gray-300'
            }`}
          >
            <Timer size={20} />
            <span className={location.pathname === '/h-history' ? 'sr-only' : 'text-[10px]'}>
              History
            </span>
          </Link>

          <Link
            to="/"
            className="flex flex-col items-center justify-center w-12 h-12 rounded-full text-gray-300 hover:text-white transition-all duration-300"
          >
            <Home size={20} />
            <span className="text-[10px]">Normal</span>
          </Link>
        </div>
      </nav>
    </Activity>
  )
}
