import { Link, useLocation } from '@tanstack/react-router'
import { Home, Search, Star, Timer, Flame } from 'lucide-react'
import { Activity } from 'react'
import { openH18Modal } from '@/features/h18/hooks/useH18Auth'

const navbarItems = [
  {
    to: '/',
    icon: <Home size={20} />,
    label: 'Home',
  },
  {
    to: '/explore',
    icon: <Search size={20} />,
    label: 'Explore',
  },
  {
    to: '/popular',
    icon: <Star size={20} />,
    label: 'Populer',
  },
  {
    to: '/update',
    icon: <Timer size={20} />,
    label: 'Update',
  },
]

export default function SmallNavbar() {
  const location = useLocation()

  const isHidden =
    location.pathname.startsWith('/detail') ||
    location.pathname.startsWith('/chapter')

  return (
    <Activity mode={isHidden ? 'hidden' : 'visible'}>
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="flex items-center justify-around h-16 px-2 bg-black/85 backdrop-blur-lg border-t border-white/10">
          {navbarItems.map(({ to, icon, label }, i) => (
            <Link
              key={i}
              to={to}
              aria-label={label}
              className={`
                ${
                  location.pathname === to
                    ? 'bg-primary text-white -translate-y-4 shadow-lg shadow-primary/40'
                    : 'text-gray-300'
                }
                flex flex-col items-center justify-center
                w-12 h-12
                rounded-full
                transition-all duration-300
              `}
            >
              {icon}
              <span className={location.pathname === to ? 'sr-only' : 'text-[10px]'}>
                {label}
              </span>
            </Link>
          ))}

          {/* H18 Trigger Button */}
          <button
            type="button"
            onClick={() => openH18Modal()}
            aria-label="Mode H18"
            className="text-[#ff2d78] hover:text-white flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer"
          >
            <Flame size={20} />
            <span className="text-[10px] font-bold">H18</span>
          </button>
        </div>
      </nav>
    </Activity>
  )
}
