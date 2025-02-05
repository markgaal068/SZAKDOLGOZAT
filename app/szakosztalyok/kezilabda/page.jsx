"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Teams() {
  return (
    <section className="pb-12">
      <div className="mx-4 xl:mx-16">
        {/* Főcím */}
        <motion.h2
          className="heading text-center text-3xl xl:text-6xl font-bold mb-12 mt-12 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <span className="text-accent">Kézilabda</span><span> Szakosztály</span>
        </motion.h2>

        {/* Szakosztályok rácsos elrendezése */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamData.map((team, index) => (
            <Link href={team.tableLink} key={index} className="relative group block">
              <motion.div
                className="relative w-full h-64 xl:h-96 overflow-hidden rounded-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 * index }}
              >
                {/* Háttérkép */}
                <Image
                  src={team.image}
                  alt={team.title}
                  layout="fill"
                  objectFit="cover"
                />
                {/* Zöld overlay csak desktop nézetben */}
                <div className="absolute inset-0 bg-green-700 opacity-70 md:group-hover:opacity-0 transition-opacity duration-300" />
                {/* Szakosztály neve a kép közepén */}
                <div className="absolute inset-0 flex items-center justify-center text-white lg:text-5xl font-bold text-center md:group-hover:opacity-0 transition-opacity duration-300">
                  {team.title}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Szakosztály adatok
const teamData = [
  {
    title: "Női felnőtt",
    image: "/kezi.webp", // Placeholder kép
    tableLink: "/SPORTOK/kezilabda/noifelnott", // Vak link
  },
  {
    title: "Férfi Felnőtt",
    image: "/kezi.webp", // Placeholder kép
    tableLink: "/SPORTOK/kezilabda/ferfifelnott", // Vak link
  },
  {
    title: "Leány Ifjúsági",
    image: "/kezi.webp", // Placeholder kép
    tableLink: "#", // Vak link
  },
  {
    title: "Leány Serdülő",
    image: "/kezi.webp", // Placeholder kép
    tableLink: "#", // Vak link
  },
];
