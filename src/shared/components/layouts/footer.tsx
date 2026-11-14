import { Separator } from '@/shared/shadcn/separator'
import { Link, useLocation } from '@tanstack/react-router'
import { Activity } from 'react'
import { FaGithub, FaInstagram, FaTiktok } from 'react-icons/fa'

export default function Footer() {
  const location = useLocation()
  const isH18Mode =
    location.pathname.startsWith('/h18') || location.pathname.startsWith('/h-')

  const linkItems = [
    {
      href: 'https://www.instagram.com/kyyntseph?igsh=MTI5NDN1MDF5bXNtYg%3D%3D',
      icon: <FaInstagram />,
      label: 'Instagram',
    },
    {
      href: 'https://www.tiktok.com/@razzkyy.98',
      icon: <FaTiktok />,
      label: 'TikTok',
    },
    {
      href: 'https://github.com/KyyTzy09',
      icon: <FaGithub />,
      label: 'GitHub',
    },
  ]

  const hideFooter =
    location.pathname.startsWith('/chapter') ||
    location.pathname.startsWith('/h-read') ||
    location.pathname.startsWith('/h18/read')

  return (
    <Activity mode={hideFooter ? 'hidden' : 'visible'}>
      <footer
        className={`w-full mt-auto relative z-20 pb-16 md:pb-0 transition-colors ${
          isH18Mode
            ? 'bg-gradient-to-t from-[#0e0713] via-[#08050a]/90 to-transparent border-t border-[#ff2d78]/20 text-slate-200'
            : 'bg-gradient-to-t from-[#0b101c] via-[#080C14]/90 to-transparent border-t border-white/5 text-slate-300'
        }`}
      >
        <div className="flex flex-col w-full max-w-7xl mx-auto p-6 gap-4">
          <div className="md:flex md:justify-between">
            <div className="mb-4 md:mb-2">
              <Link to={isH18Mode ? '/h18' : '/'} className="flex items-center">
                <span className="text-white font-bold text-lg">MANGA</span>
                <span
                  className={`font-primary font-bold text-lg ml-1 ${
                    isH18Mode ? 'text-[#ff2d78]' : 'text-primary'
                  }`}
                >
                  KYY{isH18Mode ? ' H18' : ''}
                </span>
              </Link>
            </div>
          </div>

          <Separator
            className={isH18Mode ? 'border-[#ff2d78]/25' : 'border-white/10'}
          />

          <div className="sm:flex sm:items-center sm:justify-between text-xs text-slate-400">
            <span className="sm:text-center">
              © {new Date().getFullYear()}{' '}
              <Link
                to={isH18Mode ? '/h18' : '/'}
                className={`hover:underline ${
                  isH18Mode ? 'hover:text-[#ff2d78]' : 'hover:text-primary'
                }`}
              >
                MangaKyy.com
              </Link>
              . All Rights Reserved.
            </span>

            <div className="flex mt-3 gap-2 sm:justify-center sm:mt-0">
              {linkItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Kunjungi MangaKyy di ${item.label}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition-all text-base ${
                    isH18Mode
                      ? 'hover:bg-[#ff2d78]/20 hover:text-[#ff2d78]'
                      : 'hover:bg-primary/20 hover:text-primary'
                  }`}
                >
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </Activity>
  )
}
