"use client";

import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube, FaShareAlt } from "react-icons/fa";
import Image from "next/image";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function About() {
  const sharePage = () => {
    if (navigator.share) {
      navigator.share({
        title: "Az Ácsi Kinizsi SC Története",
        url: window.location.href,
      });
    } else {
      alert("A megosztás nem támogatott ezen a böngészőn.");
    }
  };

  return (
    <section className="history py-8 bg-gradient-to-r from-accent/50 to-sndbg/10 relative">
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
            &quot;A múlt tisztelete, a jövő építése.&quot;
          </p>
        </motion.div>

        {/* Beágyazott videó */}
        <div className="flex justify-center mb-8">
          <ReactPlayer
            url="https://www.youtube.com/watch?v=-dVODPzYLVY"
            controls
            width="80%"
          />
        </div>

        {/* Idővonal - Két oszlopos grid */}
        <div className="timeline grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto max-w-5xl py-8">
          {[{
            year: "1927",
            text: "Az Ácsi Kinizsi SC megalakulása öt szakosztállyal.",
            image: "/history-1927.jpg",
          }, {
            year: "1945",
            text: "A második világháború után is fennmaradt a klub.",
            image: "/history-1945.jpg",
          }, {
            year: "2000",
            text: "A Hartmann Hungary Kft. támogatásával tovább fejlődik a sportélet.",
            image: "/history-2000.jpg",
          },
          {
            year: "2023",
            text: "Ifjúsági II. helyezett csapat!",
            image: "/history-2023.jpg",
          }].map((event, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center bg-bg/70 p-4 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.3 }}
            >
              <h3 className="text-2xl font-bold text-accent">{event.year}</h3>
              <Image
                src={event.image}
                alt={event.year}
                width={500}
                height={350}
                className="rounded-lg shadow-md my-4 object-cover"
              />
              <p className="text-gray-300 text-center px-4">{event.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="mb-6 ml-10 mr-10 text-gray-300 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
        >
          A sport club vezetői, sportolói azon munkálkodnak, hogy a gyengébb szerepléseket feledtessék, és maradandó élményeket nyújtsanak a szurkolóknak!
        </motion.p>

        <motion.p
          className="text-center font-bold text-xl text-accent mt-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          Hajrá Ácsi Kinizsi SC!
        </motion.p>

        {/* Közösségi Média */}
        <motion.div
          className="flex justify-center gap-6 mb-6 mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {[{
            href: "https://www.facebook.com/profile.php?id=100041322827349",
            Icon: FaFacebook,
            hoverColor: "hover:text-blue-600"
          }, {
            href: "https://www.instagram.com/kinizsi_handball/",
            Icon: FaInstagram,
            hoverColor: "hover:text-pink-600"
          }, {
            href: "https://www.youtube.com/@acskinizsisckezilabda5429",
            Icon: FaYoutube,
            hoverColor: "hover:text-red-600"
          }].map(({ href, Icon, hoverColor }, index) => (
            <motion.a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`text-3xl text-accent transition ${hoverColor}`}
            >
              <Icon />
            </motion.a>
          ))}

          <motion.button
            onClick={sharePage}
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-3xl text-accent hover:text-gray-500 transition"
          >
            <FaShareAlt />
          </motion.button>
        </motion.div>
      </div>

      {/* Impresszum */}
      <footer className="impresszum bg-accent/20 py-4 mt-12">
        <div className="max-w-7xl mx-auto text-center text-lg text-gray-200">
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <p className="text-gray-300 mb-2">
              <strong>Cég neve:</strong> Ácsi Kinizsi SC
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Székhely:</strong> 2941 Ács, Gyár utca 81., Magyarország
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Kapcsolat:</strong> <a href="mailto:acs.sportcsarnok@gmail.com" className="text-accent">email</a>
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Telefon:</strong> +36 20 340 0898
            </p>
          </motion.div>

          <motion.div
            className="mt-4 text-sm text-gray-400"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <p>&copy; 2025 Ácsi Kinizsi SC. Minden jog fenntartva.</p>
            {/* Hiperhivatkozás a sütikhez */}
            <p className="mt-2">
              <a href="https://www.cookiebot.com/en/privacy-policy/" className="text-accent hover:text-accent/80">Süti politika</a>
            </p>
          </motion.div>
        </div>
      </footer>

    </section>
  );
}
