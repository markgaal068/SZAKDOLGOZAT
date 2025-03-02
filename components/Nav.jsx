"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { CiLogin, CiLogout } from "react-icons/ci"

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
        dropdown: [
            { name: "labdarúgás", path: "/szakosztalyok/labdarugas" },
            { name: "kézilabda", path: "/szakosztalyok/kezilabda" },
            { name: "asztalitenisz", path: "/szakosztalyok/asztalitenisz" },
            { name: "sakk", path: "/szakosztalyok/sakk" },
            { name: "tenisz", path: "/szakosztalyok/tenisz" },
            { name: "lovas", path: "/szakosztalyok/lovas" },
            { name: "löveszet", path: "/szakosztalyok/loveszet" },
            { name: "ritmikus gimnasztika", path: "/szakosztalyok/rg" },
        ]
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

const Nav = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const timeoutRef = useRef(null)


    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsDropdownOpen(true)
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setIsDropdownOpen(false), 100)
    }

    return (
        <nav className="flex items-center gap-8 relative">
            {links.map((link, index) => (
                <div
                    key={index}
                    className="relative"
                    onMouseEnter={link.dropdown ? handleMouseEnter : undefined}
                    onMouseLeave={link.dropdown ? handleMouseLeave : undefined}
                >
                    {link.dropdown ? (
                        <div className="relative">
                            <Link
                                href={link.path}
                                className={`${link.path === pathname && "text-accent border-b-2 border-accent"} capitalize font-medium hover:text-accent transition-all`}
                            >
                                {link.name}
                            </Link>

                            {isDropdownOpen && (
                                <div
                                    className="absolute top-full left-0 bg-sndbg shadow-lg rounded-md mt-2 z-50 border-b border-accent"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <ul className="flex flex-col">
                                        {link.dropdown.map((subLink, subIndex) => (
                                            <li key={subIndex} className="whitespace-nowrap px-4 py-2">
                                                <Link href={subLink.path} className="capitalize font-medium text-white hover:text-accent">
                                                    {subLink.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            href={link.path}
                            className={`${link.path === pathname && "text-accent border-b-2 border-accent"} capitalize font-medium hover:text-accent transition-all`}
                        >
                            {link.name}
                        </Link>
                    )}
                </div>
            ))}

            {/* Ha be van jelentkezve, megjelenik az "Admin Panel" és a "Kijelentkezés" gomb */}
            {session ? (
                <div className="ml-auto flex items-center gap-4">
                    <button
                        className="text-white hover:text-accent transition-all font-medium"
                        onClick={() => router.push("/admin")}
                    >
                        Admin Panel
                    </button>
                    {/* <Link href="/admin" className="text-white hover:text-accent transition-all font-medium">
                        Admin Panel
                    </Link> */}
                    <button
                        className="text-white hover:text-accent transition-all flex items-center gap-2"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        Kijelentkezés <CiLogout className="text-2xl" />
                    </button>

                </div>
            ) : (
                // Ha nincs bejelentkezve, a "Bejelentkezés" gomb látszik
                <button
                    className="ml-auto text-white hover:text-accent transition-all flex items-center gap-2"
                    onClick={() => router.push("/loginpage")}
                >
                    Bejelentkezés <CiLogin className="text-2xl" />
                </button>
            )}
        </nav>
    )
}

export default Nav
