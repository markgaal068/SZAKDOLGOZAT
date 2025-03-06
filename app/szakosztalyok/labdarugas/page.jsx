"use client"
import { useEffect } from 'react';
import Link from 'next/link';

export default function Construction() {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-bg via-sndbg to-accent text-white text-center p-4 relative overflow-hidden">
      {/* Kép háttérként, opacityval */}
      <div className="absolute inset-0 flex justify-center items-center">
        <img src="/kinizsicimer.png" alt="Kinizsi Címer" className="opacity-30 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl" />
      </div>

      <div className="max-w-2xl z-10 px-4 sm:px-8 md:px-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Üdvözlünk a Kinizsi Labdarúgó Szakosztályánál!</h1>
        <p className="text-base sm:text-lg md:text-xl mb-8">
          A Kinizsi labdarúgó szakosztálya több évtizedes múltra tekint vissza. 
          Az oldalunk jelenleg fejlesztés alatt áll, de hamarosan rengeteg 
          információval várunk, hogy te is részese lehess a csapatunknak!
        </p>
        <p className="text-base sm:text-lg md:text-xl font-semibold mb-6">
          Az adatok feltöltése folyamatban, kérlek, tarts velünk türelemmel!
        </p>
        <div className="space-x-4">
          <Link href="/">
            <button className="bg-accent/70 hover:bg-accent text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300">
              Vissza a kezdőlapra
            </button>
          </Link>
        </div>
        <div className="mt-8">
          <p className="text-sm italic">Köszönjük, hogy érdeklődsz a Kinizsi Labdarúgó szakosztálya iránt!</p>
        </div>
      </div>
    </div>
  );
}