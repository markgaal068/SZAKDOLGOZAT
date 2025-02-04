"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="history py-8 bg-sndbg/50 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-20 z-0"></div>

      <div className="relative z-10 text-lg leading-relaxed text-gray-200">
        {/* Főcím */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl xl:text-5xl font-bold text-accent mb-4">
            Az Ácsi Kinizsi SC Története
          </h2>
          <div className="mx-auto w-1/4 h-1 bg-accent mb-2"></div>
          <p className="italic text-gray-400">
            &quot;A múlt tisztelete, a jövő építése. &quot;
          </p>
        </motion.div>

        {/* Történet */}
        <motion.p 
          className="mb-6 ml-10 mr-10 text-gray-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Az Ácsi Kinizsi SC 1927. február 27-én alakult ötvenhárom ácsi sportszerető polgár összefogásával. A sport club első elnöke Persik István volt.
        </motion.p>

        <div className="bg-sndbg p-6 rounded-lg shadow-lg my-8">
          <motion.p
            className="mb-6 ml-10 mr-10 text-gray-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Az újonnan alakult club öt szakosztállyal kezdte meg működését:
          </motion.p>

          <motion.ul 
            className="list-decimal list-inside pl-6 mb-6 ml-10 space-y-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <li className="text-accent font-semibold">Football</li>
            <li className="text-accent font-semibold">Kerékpár</li>
            <li className="text-accent font-semibold">Atlétika</li>
            <li className="text-accent font-semibold">Közművelődési alosztály</li>
            <li className="text-accent font-semibold">Turisztikai alosztály</li>
          </motion.ul>
        </div>

        <motion.p 
          className="mb-6 ml-10 mr-10 text-gray-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          A sport club mindig fontos szerepet töltött be a község, majd később a városi rangra emelkedett Ács életében. Az Ácsi Kinizsi SC-t a második világháború vihara sem tudta eltüntetni a megyei sport történetéből.
        </motion.p>

        <motion.p 
          className="mb-6 ml-10 mr-10 text-gray-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          A Kinizsi fejlődésének, fennmaradásának záloga a lelkes, segítőkész, tenni vágyó ácsi lakosok összefogásának köszönhető. Meg kell említeni a volt Ácsi Cukorgyár fontos szerepét, amelyre talán nem túlzás az Ácsi Kinizsi SC „főszponzoraként” emlékezni.
        </motion.p>

        <motion.p 
          className="mb-6 ml-10 mr-10 text-gray-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Az Ácsi Kinizsi SC szakosztályai mindig fontos és meghatározó szerepet töltöttek be a megye és helyenként az ország sportéletében. Szakosztályaink és sportolóink a Megyei III-tól az NBII-es bajnokságig mérethették meg magukat.
        </motion.p>

        <motion.p 
          className="mb-6 ml-10 mr-10 text-gray-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          A közelmúlt és a jelen egy megváltozott képet mutat, az Ácsi Cukorgyár megszűnése komoly űrt hagyott az egyesület támogatottságát illetően. Ezt a hiányt betölteni a Hartmann Hungary Kft. tudta, amely Ács legnagyobb vállalata, és részt vállal a sport club támogatásából.
        </motion.p>

        <motion.p 
          className="mb-6 ml-10 mr-10 text-gray-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          A Kinizsi SC szakosztályai, sportolói a Megyei III-tól az NBII-ig mérethették meg magukat, de mindig fontos szereplők voltak a sportéletben. A jelenlegi helyzetben az utánpótlás-nevelés kiemelt szerepet kap, különösen a sakk, asztalitenisz, kézilabda és labdarúgás területén.
        </motion.p>

        <div className="bg-sndbg p-6 rounded-lg shadow-lg my-8">
          <motion.h3 
            className="text-xl font-semibold text-accent mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            A Kinizsi Sport Club jelenleg működő szakosztályai:
          </motion.h3>
          <motion.ul 
            className="list-disc list-inside pl-6 space-y-2 text-gray-200"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <li>Labdarúgás</li>
            <li>Kézilabda</li>
            <li>Asztalitenisz</li>
            <li>Sakk</li>
            <li>Tenisz</li>
            <li>Lovas szakosztály</li>
          </motion.ul>
        </div>

        <motion.p 
          className="mb-6 ml-10 mr-10 text-gray-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          A sport club vezetői, sportolói azon munkálkodnak, hogy a gyengébb szerepléseket feledtessék, és maradandó élményeket nyújtsanak a szurkolóknak!
        </motion.p>

        <motion.p 
          className="text-center font-bold text-xl text-accent mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.4 }}
        >
          Hajrá Ácsi Kinizsi SC!
        </motion.p>
      </div>
    </section>
  );
}
