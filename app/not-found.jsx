"use client";

import { useRouter } from "next/navigation"; // Javított import
import Image from "next/image";
import Layout from "@/app/layout";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ErrorPage() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleClick = () => {
        window.location.href = "/" // Navigálás a főoldalra frissítéssel
    };

    if (!isClient) {
        return null; // Ne rendereljük a hibát szerver oldalon
    }

    return (
        <Layout pageMeta={{ title: 'Oops! Nem létező oldalt találtál..' }}>
            <div
                className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-bg via-sndbg to-accent cursor-pointer relative"
                onClick={handleClick}
            >
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center text-white z-50 font-bold">
                        <div className="flex justify-center">
                            <motion.h1
                                className="text-8xl font-bold mb-5"
                                initial={{ y: 0 }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    y: {
                                        duration: 2,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        delay: 0.3,
                                    },
                                }}
                            >
                                4
                            </motion.h1>
                            <motion.h1
                                className="text-8xl font-bold mb-5"
                                initial={{ y: 0 }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    y: {
                                        duration: 2,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        delay: 0.6,
                                    },
                                }}
                            >
                                0
                            </motion.h1>
                            <motion.h1
                                className="text-8xl font-bold mb-5"
                                initial={{ y: 0 }}
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    y: {
                                        duration: 2,
                                        ease: "easeInOut",
                                        repeat: Infinity,
                                        repeatType: "loop",
                                        delay: 0.9,
                                    },
                                }}
                            >
                                4
                            </motion.h1>
                        </div>
                        <h1 className="text-6xl font-bold mb-5">ERROR</h1>
                        <p className="text-4xl">AZ OLDAL NEM TALÁLHATÓ</p>
                        <p className="mt-4 text-2xl">
                            Vélhetően nem létező oldalra találtál.
                        </p>
                        <p className="mt-2 text-2xl">
                            Kattints, és visszaviszünk a főoldalra!
                        </p>
                    </div>
                    <Image
                        src="/kinizsicimer.png"
                        alt="Kinizsi Címer"
                        width={600}
                        height={600}
                        className="absolute opacity-30"
                    />
                </div>
            </div>
        </Layout>
    );
}