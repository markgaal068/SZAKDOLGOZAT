"use client"

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { CiMenuFries } from 'react-icons/ci'
import { useState } from 'react'

const links = [
    {
        name: "főoldal",
        path: "/",
    },
    {
        name: "hírek",
        path: "/news",
    },
    {
        name: "szakosztályok",
        path: "/departments",
    },
    {
        name: "rólunk",
        path: "/about",
    },
    {
        name: "kapcsolat",
        path: "/contact",
    },
]

const MobileNav = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false); 

    const closeSheet = () => {
        setIsOpen(false); 
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}> 
            <SheetTrigger className='flex justify-center items-center' onClick={() => setIsOpen(true)}>
                <CiMenuFries className='text-[32px] text-accent' />
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                {/* logo */}
                <div className='mt-32 mb-40 text-center text-2xl'>
                    <Link href="/" onClick={closeSheet}>
                        <h1 className='text-4xl font-bold'>Ácsi <span className='text-accent'>Kinizsi</span> SC</h1>
                    </Link>
                </div>

                {/* navbar */}
                <nav className='flex flex-col justify-center items-center gap-8 font-bold'>
                    {links.map((link, index) => (
                        <Link
                            href={link.path}
                            key={index}
                            onClick={closeSheet} 
                            className={`${link.path === pathname ? "text-accent border-b-2 border-accent" : ""} text-xl capitalize hover:text-accent transition-all`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export default MobileNav;
