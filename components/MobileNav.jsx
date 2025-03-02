"use client";

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { CiMenuFries, CiLogin, CiLogout } from 'react-icons/ci';

const links = [
    { name: "főoldal", path: "/" },
    { name: "hírek", path: "/news" },
    { name: "szakosztályok", path: "/departments" },
    { name: "rólunk", path: "/about" },
    { name: "kapcsolat", path: "/contact" },
];

const MobileNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className='flex justify-center items-center' onClick={() => setIsOpen(true)}>
                <CiMenuFries className='text-[32px] text-accent' />
            </SheetTrigger>
            <SheetContent className="flex flex-col max-h-screen overflow-y-auto pb-16">
                {/* Logo */}
                <div className='mt-32 mb-20 text-center text-2xl'>
                    <Link href="/" onClick={closeSheet}>
                        <h1 className='text-4xl font-bold'>Ácsi <span className='text-accent'>Kinizsi</span> SC</h1>
                    </Link>
                </div>

                {/* Navbar */}
                <nav className='flex flex-col justify-center items-center gap-8 font-bold mb-12'>
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

                {/* Bejelentkezés vagy Admin Panel + Kijelentkezés */}
                {session ? (
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <Link href="/admin" className="text-xl font-bold text-white hover:text-accent transition-all" onClick={closeSheet}>
                            Admin Panel
                        </Link>
                        <button
                            className="flex items-center gap-2 text-xl font-bold text-white hover:text-accent transition-all"
                            onClick={() => {
                                signOut();
                                closeSheet();
                                router.push("/");
                            }}
                        >
                            Kijelentkezés <CiLogout className="text-2xl" />
                        </button>
                    </div>
                ) : (
                    <button
                        className="flex items-center justify-center gap-2 text-xl font-bold text-white hover:text-accent transition-all mx-auto mt-8"
                        onClick={() => {
                            closeSheet();
                            router.push("/loginpage");
                        }}
                    >
                        Bejelentkezés <CiLogin className="text-2xl" />
                    </button>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default MobileNav;
