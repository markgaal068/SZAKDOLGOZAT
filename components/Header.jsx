"use client";

import Link from "next/link"
import { motion } from "framer-motion"

//COMPONENTS
import Nav from "./Nav"
import MobileNav from "./MobileNav"

const Header = () => {
    return (
        <motion.header
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-0 z-50 py-4 xl:py-5 text-white bg-sndbg/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/10"
        >
            <div className="container mx-auto flex justify-between items-center">

                <Link href="/" className="transition-opacity hover:opacity-90">
                    <h1 className="text-2xl xl:text-3xl font-bold">Ácsi <span className="text-accent">Kinizsi</span> SC</h1>
                </Link>


                <div className="hidden xl:flex items-center gap-8">
                    <Nav />
                </div>


                <div className="xl:hidden">
                    <MobileNav />
                </div>

            </div>
        </motion.header>
    )
}

export default Header
