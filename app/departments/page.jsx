"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Teams() {
  return (
    <section className="pb-16">
      <div className="mx-4 xl:mx-20">
        {/* Főcím */}
        <motion.h2 
          className="heading text-center text-3xl xl:text-6xl font-semibold mb-12 mt-16 text-white"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Ácsi <span className="text-accent">Kinizsi</span> SC <span className="text-accent">Szakosztályok</span>
        </motion.h2>

        {/* Szakosztályok rácsos elrendezése */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {departmentData.map((department, index) => (
            <Link href={department.tableLink} key={index} className="relative group block">
              <motion.div 
                className="relative w-full h-72 xl:h-96 overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform group-hover:scale-105"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 * index }}
              >
                {/* Háttérkép */}
                <Image
                  src={department.background}
                  alt={department.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-300 transform group-hover:scale-110"
                />
                {/* Zöld overlay csak desktop nézetben */}
                <div className="absolute inset-0 bg-green-700 opacity-70 group-hover:opacity-50 transition-opacity duration-300" />
                {/* Szakosztály neve a kép közepén */}
                <div className="absolute inset-0 flex items-center justify-center text-white text-3xl xl:text-5xl font-bold text-center opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {department.title}
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
const departmentData = [
  { title: "Labdarúgás", tableLink: "/szakosztalyok/labdarugas", background: "/foca.webp" },
  { title: "Kézilabda", tableLink: "/szakosztalyok/kezilabda", background: "/kezi.webp" },
  { title: "Asztalitenisz", tableLink: "/szakosztalyok/asztalitenisz", background: "/pingpong.webp" },
  { title: "Sakk", tableLink: "/szakosztalyok/sakk", background: "/sakk.webp" },
  { title: "Tenisz", tableLink: "/szakosztalyok/tenisz", background: "/tennis.webp" },
  { title: "Lovas", tableLink: "/szakosztalyok/lovas", background: "/lovaglas.webp" },
  { title: "Lövészet", tableLink: "/szakosztalyok/loveszet", background: "/loveszet.webp" },
  { title: "Ritmikus Gimnasztika", tableLink: "/szakosztalyok/rg", background: "/rg.webp" },
];
