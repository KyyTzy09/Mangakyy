import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { Timer, Flame, Lock } from 'lucide-react'
import { Activity } from 'react'
import { useH18Auth } from '@/features/h18/hooks/useH18Auth'
import H18AuthModal from '@/features/h18/components/H18AuthModal'

export default function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isAuthenticated, isModalOpen, openModal, closeModal, logout } = useH18Auth()

    const isH18Mode = location.pathname.startsWith('/h18')

    const menus = [{
        title: "Home",
        link: "/"
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

    const handleH18Click = (e: React.MouseEvent) => {
        e.preventDefault()
        if (isAuthenticated) {
            navigate({ to: '/h18' })
        } else {
            openModal()
        }
    }

    const handleLockH18 = () => {
        logout()
        navigate({ to: '/' })
    }

    const hideNavbar =
        location.pathname.startsWith("/chapter") ||
        location.pathname.startsWith("/detail") ||
        location.pathname.startsWith("/h18/read")
    return (
        <Activity mode={hideNavbar ? "hidden" : "visible"}>
            <header className={`fixed top-0 w-full h-18 z-40 bg-black/40 backdrop-blur-md p-4 border-b ${isH18Mode ? 'border-[#ff2d78]/40' : 'border-gray-500'}`}>
                <div className='flex w-full h-full items-center justify-between px-5'>
                    <section className='w-1/2 flex items-center gap-6'>
                        <div className='text-xl'>
                            <Link to={isH18Mode ? "/h18" : "/"}>
                                <span className='text-white font-bold'>
                                    MANGA
                                </span>
                                <span className={`font-primary font-bold ${isH18Mode ? 'text-[#ff2d78]' : 'text-primary'}`}>
                                    KYY {isH18Mode ? 'H18' : ''}
                                </span>
                            </Link>
                        </div>
                        <div className='hidden md:flex gap-6 text-md text-white font-primary items-center'>
                            {menus.map(({ title, link }, i) => {
                                return (
                                    <Link key={i} to={link} className={`${location.pathname === link ? (isH18Mode ? "text-[#ff2d78]" : "text-primary") : "text-white hover:text-slate-200"}`}>
                                        {title}
                                    </Link>
                                )
                            })}
                            <button
                                type="button"
                                onClick={handleH18Click}
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold transition-all cursor-pointer ${
                                    isH18Mode
                                        ? 'bg-[#ff2d78] text-white shadow-md shadow-[#ff2d78]/40'
                                        : 'text-[#ff2d78] hover:bg-[#ff2d78]/15 border border-[#ff2d78]/40'
                                }`}
                                aria-label="Mode H18 Dewasa"
                            >
                                <Flame className="w-4 h-4 fill-current" />
                                <span>H18</span>
                            </button>
                        </div>
                    </section>
                    <div className='w-1/2 flex items-center justify-end gap-3'>
                        {isH18Mode && (
                            <button
                                type="button"
                                onClick={handleLockH18}
                                title="Kunci Sesi H18"
                                aria-label="Kunci Sesi H18"
                                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 rounded-lg transition-colors cursor-pointer"
                            >
                                <Lock className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Kunci H18</span>
                            </button>
                        )}
                        <Link to="/history" className={`flex items-center justify-center gap-1.5 text-sm font-bold px-3.5 ${isH18Mode ? 'bg-[#ff2d78] hover:bg-[#e02068] border-[#ff2d78]' : 'bg-primary hover:bg-primary/80 border-primary/50'} border text-white rounded-lg py-2 transition-colors shadow-sm`}>
                            <Timer className='w-4 h-4 mr-1' />
                            History
                        </Link>
                    </div>
                </div>
            </header>
            <H18AuthModal isOpen={isModalOpen} onClose={closeModal} />
        </Activity >
    )
}
