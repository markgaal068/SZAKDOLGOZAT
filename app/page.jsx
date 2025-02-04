"use client";

import Image from "next/image";
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center relative overflow-hidden bg-sndbg/10">
      {/* Háttér animáció */}
      <motion.div 
        className="absolute inset-0 bg-gradient-radial from-transparent to-sndbg opacity-50"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 h-full gap-0">
        {/* Címer */}
        <motion.div 
          className="flex items-center justify-center p-4 order-2 xl:order-2" 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.div 
            animate={{ y: [0, -20, 0] }} 
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
            className="shadow-2xl rounded-full p-4 bg-accent"
          >
            <Image
              src="/kinizsicimer.png" 
              alt="Címer"
              width={500} 
              height={500} 
              className="rounded-full bg-sndbg"
            />
          </motion.div>
        </motion.div>

        {/* Szöveges rész */}
        <motion.div 
          className="flex flex-col items-center justify-center h-full text-white text-center p-8" 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-3xl xl:text-6xl font-extrabold mb-6">
            Üdvözlünk az <span className="text-green-400">Ácsi Kinizsi SC</span> weboldalán!
          </h1>
          <p className="text-lg xl:text-xl mb-8 text-gray-300">
            Csatlakozz közösségünkhöz és kövesd legfrissebb híreinket!
          </p>
          
          {/* Közösségi ikonok */}
          <div className="flex space-x-6">
            {[{
              href: "https://www.facebook.com/profile.php?id=100041322827349",
              icon: <FaFacebook className="text-4xl" />
            }, {
              href: "https://www.instagram.com/kinizsi_handball/",
              icon: <FaInstagram className="text-4xl" />
            }, {
              href: "https://www.youtube.com/@acskinizsisckezilabda5429",
              icon: <FaYoutube className="text-4xl" />
            }].map(({ href, icon }, index) => (
              <motion.a 
                key={index} 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center rounded-full border-4 border-green-400 bg-transparent text-green-400 hover:bg-green-400 hover:text-black transition duration-300 p-5 shadow-lg"
              >
                {icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}