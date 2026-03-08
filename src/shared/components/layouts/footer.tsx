import { Separator } from '@/shared/shadcn/separator';
import { Link, useLocation } from '@tanstack/react-router';
import { FaGithub, FaInstagram, FaTiktok } from "react-icons/fa"

export default function Footer() {
  const location = useLocation()
  const linkItems = [
    {
      href: "https://www.instagram.com/kyyntseph?igsh=MTI5NDN1MDF5bXNtYg%3D%3D",
      icon: <FaInstagram />,
      label: "Instagram",
    },
    {
      href: "https://www.tiktok.com/@razzkyy.98",
      icon: <FaTiktok />,
      label: "TikTok",
    },
    {
      href: "https://github.com/KyyTzy09",
      icon: <FaGithub />,
      label: "GitHub",
    },
  ];
  return (
    <footer
      className={`w-full mt-5 md:mt-10 bg-linear-to-br from-black via-primary/80 to-transparent text-white relative z-20 ${location.pathname.startsWith("/chapter") && "hidden"
        }`}>
      <div className="flex flex-col w-full p-6 gap-4">
        <div className="md:flex md:justify-between">
          <div className="mb-5 md:mb-2">
            <Link to={"/"} className="flex items-center">
              <span className='text-white font-bold'>
                MANGA
              </span>
              <span className='font-primary font-bold bg-linear-to-r from-blue-400 via-primary to-primary text-transparent bg-clip-text'>
                KYY
              </span>
            </Link>
          </div>
        </div>
        <Separator className="border-primary border" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-white sm:text-center">
            © {new Date().getFullYear()}{" "}
            <Link to='/' className="hover:underline">
              MangaKyy.com
            </Link>
            . All Rights Reserved.
          </span>
          <div className="flex mt-4 gap-3 sm:justify-center sm:mt-0">
            {linkItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-white hover:text-primary text-lg"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}