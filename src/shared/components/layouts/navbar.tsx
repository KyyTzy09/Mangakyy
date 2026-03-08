import { Button } from '@/shared/shadcn/button'
import { Link, useLocation } from '@tanstack/react-router'
import { Timer } from 'lucide-react'
import { Activity } from 'react'

export default function Navbar() {
    const location = useLocation()

    const menus = [{
        title: "Home",
        link: "/home"
    }, {
        title: "Populer",
        link: "/popular",
    }, {
        title: "Explore",
        link: "/explore"
    }, {
        title: "Update",
        link: "/update"
    }]

    const hideNavbar = location.pathname.startsWith("/chapter")
    return (
        <Activity mode={hideNavbar ? "hidden" : "visible"}>
            <header className='fixed top-0 w-full h-18 z-40 bg-black/20 backdrop-blur-sm p-4 border-b border-gray-500'>
                <div className='flex w-full h-full items-center justify-between px-5'>
                    <section className='w-1/2 flex items-center gap-6'>
                        <div className='text-xl'>
                            <Link to={"/"}>
                                <span className='text-white font-bold'>
                                    MANGA
                                </span>
                                <span className='font-primary font-bold bg-linear-to-r from-blue-400 via-primary to-primary text-transparent bg-clip-text'>
                                    KYY
                                </span>
                            </Link>
                        </div>
                        <div className='hidden md:flex gap-6 text-md text-white font-primary'>
                            {menus.map(({ title, link }, i) => {
                                return (
                                    <Link key={i} to={link} className={`${location.pathname === link ? "text-primary" : "text-white"}`}>
                                        {title}
                                    </Link>
                                )
                            })}
                        </div>
                    </section>
                </div>
            </header>
        </Activity>
    )
}
