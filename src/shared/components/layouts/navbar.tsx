import { Link, useLocation } from '@tanstack/react-router'
import { Timer, Flame } from 'lucide-react'
import { Activity } from 'react'
import { openH18Modal } from '@/features/h18/hooks/useH18Auth'

export default function Navbar() {
  const location = useLocation()

  const menus = [
    { title: 'Home', link: '/' },
    { title: 'Populer', link: '/popular' },
    { title: 'Explore', link: '/explore' },
    { title: 'Update', link: '/update' },
  ]

  const hideNavbar =
    location.pathname.startsWith('/chapter') ||
    location.pathname.startsWith('/detail')

  return (
    <Activity mode={hideNavbar ? 'hidden' : 'visible'}>
      <header className="fixed top-0 w-full h-18 z-40 bg-black/40 backdrop-blur-md p-4 border-b border-gray-500">
        <div className="flex w-full h-full items-center justify-between px-5">
          <section className="w-1/2 flex items-center gap-6">
            <div className="text-xl">
              <Link to="/">
                <span className="text-white font-bold">MANGA</span>
                <span className="font-primary font-bold text-primary ml-1">KYY</span>
              </Link>
            </div>
            <div className="hidden md:flex gap-6 text-md text-white font-primary items-center">
              {menus.map(({ title, link }, i) => (
                <Link
                  key={i}
                  to={link}
                  className={
                    location.pathname === link
                      ? 'text-primary'
                      : 'text-white hover:text-slate-200'
                  }
                >
                  {title}
                </Link>
              ))}

              <button
                type="button"
                onClick={() => openH18Modal()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold text-[#ff2d78] hover:bg-[#ff2d78]/15 border border-[#ff2d78]/40 transition-all cursor-pointer"
                aria-label="Mode H18 Dewasa"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>H18</span>
              </button>
            </div>
          </section>

          <div className="w-1/2 flex items-center justify-end gap-4">
            <Link
              to="/history"
              className="flex items-center justify-center gap-1.5 text-sm font-bold px-3.5 bg-primary hover:bg-primary/80 border border-primary/50 text-white rounded-lg py-2 transition-colors shadow-sm"
            >
              <Timer className="w-4 h-4 mr-1" />
              History
            </Link>
          </div>
        </div>
      </header>
    </Activity>
  )
}
