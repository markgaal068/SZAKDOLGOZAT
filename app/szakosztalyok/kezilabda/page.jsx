"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { isKinizsiTeam } from "@/lib/utils";

const TEAMS = [
    {
        title: "Férfi felnőtt",
        image: "/kezi.webp",
        tableLink: "/SPORTOK/kezilabda/ferfifelnott",
        tableFile: "/teamdatas/kezilabda/ffifelnott/mkszffifelnott.json",
    },
    {
        title: "Női felnőtt",
        image: "/kezi.webp",
        tableLink: "/SPORTOK/kezilabda/noifelnott",
        tableFile: "/teamdatas/kezilabda/noifelnott/mksznoifelnott.json",
    },
    {
        title: "Leány serdülő",
        image: "/kezi.webp",
        tableLink: "/SPORTOK/kezilabda/leanyseri",
        tableFile: "/teamdatas/kezilabda/leanyseri/mkszleanyseri.json",
    },
];

// A csapatunk sorának megkeresése a tabellában, hogy egy gyors
// "hányadikok vagyunk" infó is kiférjen a kártyára.
function findOwnStanding(rows) {
    const row = rows?.find((r) => isKinizsiTeam(r[1]));
    return row ? { place: row[0], points: row[9] } : null;
}

export default function Teams() {
    const [standings, setStandings] = useState({});

    useEffect(() => {
        TEAMS.forEach((team) => {
            fetch(team.tableFile)
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    if (!data) return;
                    const standing = findOwnStanding(data.slice(1));
                    if (standing) {
                        setStandings((prev) => ({ ...prev, [team.title]: standing }));
                    }
                })
                .catch(() => {});
        });
    }, []);

    return (
        <section className="pb-20">
            <div className="mx-4 xl:mx-16">
                <div className="pt-12 pb-10">
                    <h2 className="text-3xl xl:text-5xl font-bold">
                        <span className="text-accent">Kézilabda</span> Szakosztály <span className="text-accent">2025</span> - 2026
                    </h2>
                    <p className="mt-2 text-gray-400">
                        Válaszd ki a csapatot a tabelláért, a góllövőlistáért és a keretért.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TEAMS.map((team, index) => {
                        const standing = standings[team.title];
                        return (
                            <Link href={team.tableLink} key={team.title} className="group block">
                                <motion.div
                                    className="relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.15 * index }}
                                >
                                    <Image
                                        src={team.image}
                                        alt={team.title}
                                        fill
                                        sizes="(min-width: 768px) 33vw, 100vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                                    {standing && (
                                        <span className="absolute top-4 right-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-bg">
                                            {standing.place} hely
                                        </span>
                                    )}

                                    <div className="absolute inset-x-0 bottom-0 p-6">
                                        <h3 className="text-2xl xl:text-3xl font-bold text-white">
                                            {team.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-300">
                                            {standing
                                                ? `${standing.points} pont a bajnokságban`
                                                : "Tabella, góllövőlista, keret"}
                                        </p>
                                        <span className="mt-3 inline-flex items-center gap-1 text-accent text-sm font-semibold opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                                            Megnyitás →
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
