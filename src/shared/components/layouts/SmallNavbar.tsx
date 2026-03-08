import { Link, useLocation } from '@tanstack/react-router'
import { Home, Search, Star, Timer } from 'lucide-react'
import { Activity } from 'react'

const navbarItems = [
    {
        to: "/home",
        icon: <Home size={22} />,
        label: "Home"
    },
    {
        to: "/explore",
        icon: <Search size={22} />,
        label: "Explore"
    },
    {
        to: "/popular",
        icon: <Star size={22} />,
        label: "Populer"
    },
    {
        to: "/update",
        icon: <Timer size={22} />,
        label: "Update"
    },
]

export default function SmallNavbar() {
    const location = useLocation()
    return (
        <Activity mode={location.pathname.startsWith("/detail") || location.pathname.startsWith("/chapter") || location.pathname === "/" ? "hidden" : "visible"}>
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
                <div className="flex items-center justify-around h-16 px-2 
      bg-black/80 backdrop-blur-lg border-t border-white/10">
                    {navbarItems.map(({ to, icon, label }, i) => (
                        <Link
                            key={i}
                            to={to}
                            className={`
                                ${location.pathname === to
                                    ? "bg-primary text-white -translate-y-5 shadow-lg shadow-primary/40"
                                    : "text-gray-300"}
                                flex flex-col items-center justify-center
                                w-14 h-14
                                rounded-full
                                transition-all duration-300
                                `}
                        >
                            {icon}
                            <span className={`${location.pathname === to ? "hidden" : "text-[11px]"}`}>
                                {label}
                            </span>
                        </Link>
                    ))}
                </div>
            </nav>
        </Activity>
    )
}