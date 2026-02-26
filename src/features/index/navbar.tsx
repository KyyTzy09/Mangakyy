import { Link } from '@tanstack/react-router'
import { Bell, Search, User } from 'lucide-react'

export default function Navbar() {
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

    return (
        <header className='fixed top-0 w-full h-18 bg-black/20 backdrop-blur-sm p-4'>
            <div className='flex w-full h-full items-center justify-between'>
                <section className='w-1/2 flex items-center gap-6'>
                    <div className='text-xl'>
                        <Link to={"/"} class>
                            <span className='text-white font-bold'>
                                BLUE
                            </span>
                            <span className='font-primary font-bold bg-linear-to-r from-blue-400 via-primary to-primary text-transparent bg-clip-text'>
                                COMIC
                            </span>
                        </Link>
                    </div>
                    <div className='flex gap-6 text-md text-white font-primary'>
                        {menus.map(({ title, link }) => {
                            return (
                                <Link to={link}>
                                    <span className={``}>
                                        {title}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </section>
                <section className='w-1/2 h-full flex items-center justify-between text-white'>
                    <div className='sm:hidden text-gray-400 flex items-center justify-between w-75 h-full rounded-full bg-gray-600/20 backdrop-blur-sm pl-2 gap-2'>
                        <div className='flex items-center justify-start w-[80%] gap-2'>
                            <Search className='w-4 h-4' />
                            <input placeholder="Cari komik" className='w-[70%] h-full' />
                        </div>
                        <button className='flex items-center justify-center w-10 h-full rounded-full bg-primary text-white'>
                            <Search className='w-4 h-4' />
                        </button>
                    </div>
                    <div className='flex items-center justify-center w-auto h-full gap-5'>
                        <button className='flex items-center justify-center w-10 h-full rounded-full bg-transparent text-white'>
                            <Bell className='w-4 h-4' />
                        </button>
                        <button className='flex items-center justify-center w-10 h-full rounded-full bg-primary text-white'>
                            <User className='w-4 h-4' />
                        </button>
                    </div>
                </section>
            </div>
        </header>
    )
}
