import { Link, useLocation } from '@tanstack/react-router'
import { Activity } from 'react'

export default function H18Navbar() {
  const location = useLocation()

  const hideNavbar =
    location.pathname.startsWith('/h-read') ||
    location.pathname.startsWith('/h18/read') ||
    location.pathname.startsWith('/h-detail') ||
    location.pathname.startsWith('/h18/detail')

  return (
    <Activity mode={hideNavbar ? 'hidden' : 'visible'}>
      <header className="fixed top-0 w-full h-18 z-40 bg-black/50 backdrop-blur-md p-4 border-b border-[#ff2d78]/40">
        <div className="flex w-full h-full items-center justify-between px-5">
          <section className="w-1/2 flex items-center gap-6">
            <div className="text-xl">
              <Link to="/h18">
                <span className="text-white font-bold">MANGA</span>
                <span className="font-primary font-bold text-[#ff2d78] ml-1">KYY H18</span>
              </Link>
            </div>
            <div className="hidden md:flex gap-6 text-sm text-white font-primary items-center">
              <Link
                to="/h18"
                className={`font-semibold transition-colors ${
                  location.pathname === '/h18'
                    ? 'text-[#ff2d78]'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                Katalog
              </Link>

              <Link
                to="/h-explore"
                className={`font-semibold transition-colors ${
                  location.pathname === '/h-explore'
                    ? 'text-[#ff2d78]'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                Explore
              </Link>

              <Link
                to="/h-genre"
                className={`font-semibold transition-colors ${
                  location.pathname.startsWith('/h-genre')
                    ? 'text-[#ff2d78]'
                    : 'text-white hover:text-slate-200'
                }`}
              >
                Genre
              </Link>

              {/* Redirect to Normal Mode Button (Text Only) */}
              <Link
                to="/"
                className="px-3 py-1 rounded-full text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              >
                Mode Biasa
              </Link>
            </div>
          </section>

          <div className="w-1/2 flex items-center justify-end gap-3">
            <Link
              to="/h-history"
              className={`flex items-center justify-center text-sm font-bold px-3.5 border rounded-lg py-2 transition-colors shadow-sm ${
                location.pathname === '/h-history'
                  ? 'bg-[#ff2d78] text-white border-[#ff2d78]'
                  : 'bg-[#ff2d78] hover:bg-[#e02068] border-[#ff2d78] text-white'
              }`}
            >
              History
            </Link>
          </div>
        </div>
      </header>
    </Activity>
  )
}
