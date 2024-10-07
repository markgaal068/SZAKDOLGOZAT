"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef } from "react"

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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const timeoutRef = useRef(null)

    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current) 
        setIsDropdownOpen(true) 
    }

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false) 
        }, 100) 
    }

    return (
        <nav className="flex gap-8 relative">
            {links.map((link, index) => (
                <div 
                    key={index} 
                    className="relative"
                    onMouseEnter={link.dropdown ? handleMouseEnter : null}
                    onMouseLeave={link.dropdown ? handleMouseLeave : null}
                >
                    {link.dropdown ? (
                        <div 
                            className="relative" 
                            onMouseEnter={handleMouseEnter} 
                        >
                            <Link 
                                href={link.path} 
                                className={`${link.path === pathname && "text-accent border-b-2 border-accent"} capitalize font-medium hover:text-accent transition-all`}
                            >
                                {link.name}
                            </Link>

                            {/* Dropdown menu for departments */}
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
        </nav>
    )
}

export default Nav
