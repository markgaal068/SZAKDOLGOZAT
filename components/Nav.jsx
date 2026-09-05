"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { signOut, useSession } from "next-auth/react"
import { CiLogin, CiLogout } from "react-icons/ci"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

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

// Egy sima nav-link, ami az aktív állapotot egy framer-motion "pill"-lel
// jelzi - ha másik linkre lépünk, az aláhúzás átcsúszik rá.
const NavLink = ({ href, isActive, children }) => (
    <Link
        href={href}
        className={`relative px-3 py-2 capitalize font-medium transition-colors ${isActive ? "text-accent" : "text-white hover:text-accent"
            }`}
    >
        {children}
        {isActive && (
            <motion.span
                layoutId="nav-active-underline"
                className="absolute inset-x-3 -bottom-1 h-0.5 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
        )}
    </Link>
)

const Nav = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { data: session } = useSession()

    const isDepartmentsActive =
        pathname === "/departments" || pathname.startsWith("/szakosztalyok")

    return (
        <div className="flex items-center gap-6">
            <NavigationMenu>
                <NavigationMenuList>
                    {links.map((link) =>
                        link.dropdown ? (
                            <NavigationMenuItem key={link.path}>
                                <NavigationMenuTrigger
                                    className={isDepartmentsActive ? "text-accent" : undefined}
                                >
                                    {link.name}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[240px] gap-1 p-2">
                                        {link.dropdown.map((subLink) => (
                                            <li key={subLink.path}>
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={subLink.path}
                                                        className={`block rounded-lg px-3 py-2 text-sm capitalize transition-colors hover:bg-white/5 hover:text-accent ${pathname === subLink.path ? "text-accent" : "text-white/90"
                                                            }`}
                                                    >
                                                        {subLink.name}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </li>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        ) : (
                            <NavigationMenuItem key={link.path}>
                                <NavLink href={link.path} isActive={link.path === pathname}>
                                    {link.name}
                                </NavLink>
                            </NavigationMenuItem>
                        )
                    )}
                </NavigationMenuList>
            </NavigationMenu>

            {/* Ha be van jelentkezve, megjelenik az "Admin Panel" és a "Kijelentkezés" gomb */}
            {session ? (
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-white hover:text-accent transition-colors font-medium">
                        Admin Panel
                    </Link>
                    <button
                        className="text-white hover:text-accent transition-colors flex items-center gap-2"
                        onClick={() => signOut({ callbackUrl: "/" })}
                    >
                        Kijelentkezés <CiLogout className="text-2xl" />
                    </button>
                </div>
            ) : (
                // Ha nincs bejelentkezve, a "Bejelentkezés" gomb látszik
                <button
                    className="text-white hover:text-accent transition-colors flex items-center gap-2"
                    onClick={() => router.push("/loginpage")}
                >
                    Bejelentkezés <CiLogin className="text-2xl" />
                </button>
            )}
        </div>
    )
}

export default Nav
