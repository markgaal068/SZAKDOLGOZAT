"use client";

import Image from "next/image";
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="h-screen fixed flex items-center justify-center"> {/* Center content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 h-full gap-0 overflow-hidden"> {/* Adjust gap here */}
        {/* RIGHT SIDE with Floating Animation - Set to appear first on mobile */}
        <motion.div 
          className="flex items-center justify-center p-4 order-2 xl:order-2" // Order changes based on screen size
          initial={{ y: 0 }} 
          animate={{ y: [0, -50, 0] }} 
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }} // Adjust duration and easing
        >
          <Image
            src="/kinizsicimer.png" // Automatically searches in the public folder
            alt="Címer"
            width={600} // Adjust to desired size
            height={600} // Adjust to desired size
            className="items-center justify-center"
          />
        </motion.div>

        {/* LEFT SIDE */}
        <div className="flex flex-col items-center justify-center h-full order-1 xl:order-1"> {/* Full height for the left side */}
          <h1 className="text-2xl xl:text-6xl font-bold mb-4 text-center">
            Üdvözlünk az <span className="text-accent">Ácsi Kinizsi SC.</span> weboldalán!
          </h1>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" 
               className="flex items-center justify-center rounded-full border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-sndbg transition duration-300 p-4">
              <FaFacebook className="text-3xl" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" 
               className="flex items-center justify-center rounded-full border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-sndbg transition duration-300 p-4">
              <FaInstagram className="text-3xl" />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" 
               className="flex items-center justify-center rounded-full border-2 border-accent bg-transparent text-accent hover:bg-accent hover:text-sndbg transition duration-300 p-4">
              <FaYoutube className="text-3xl" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
