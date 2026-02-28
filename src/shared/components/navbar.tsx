import { Button } from '@/shared/shadcn/button'
import { Input } from '@/shared/shadcn/input'
import { Link, useLocation } from '@tanstack/react-router'
import { Bell, Search, User } from 'lucide-react'
import { Activity } from 'react'

export default function Navbar() {
    const location = useLocation()

    const menus = [{
        title: "Home",
        link: "/"
    }, {
        title: "Populer",
        link: "/popular",
    }, {
        title: "Genre",
        link: "/genre"
    }, {
        title: "Update",
        link: "/update"
    }]

    const hideNavbar = location.pathname.startsWith("/chapter")
    return (
        <Activity mode={hideNavbar ? "hidden" : "visible"}>
            <header className='fixed top-0 w-full h-18 z-100 bg-black/20 backdrop-blur-sm p-4 border-b border-gray-500'>
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
                    <section className='w-1/2 h-full flex items-center justify-end text-white gap-5'>
                        <div className='hidden md:flex text-gray-400 items-center justify-between w-75 h-full rounded-full bg-gray-600/20 backdrop-blur-sm pl-2 gap-2'>
                            <div className='flex items-center justify-start w-[80%] gap-2'>
                                <Search className='w-4 h-4' />
                                <Input placeholder="Cari komik" className='w-[70%] h-full aria-selected:ring-0 focus-visible:ring-0 border-0' />
                            </div>
                            <Button className='flex items-center justify-center w-10 h-full rounded-full bg-primary text-white'>
                                <Search className='w-4 h-4' />
                            </Button>
                        </div>
                        <div className='flex items-center justify-center w-auto h-full gap-5'>
                            <Button className='flex items-center justify-center w-10 h-full rounded-full bg-transparent text-white'>
                                <Bell className='w-4 h-4' />
                            </Button>
                            <Button className='flex items-center justify-center w-10 h-full rounded-full bg-primary text-white'>
                                <User className='w-4 h-4' />
                            </Button>
                        </div>
                    </section>
                </div>
            </header>
        </Activity>
    )
}
