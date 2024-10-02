"use client";

export default function About() {
  return (
    <section className="history py-8 bg-sndbg/50 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-20 z-0"></div>

      <div className="relative z-10 text-lg leading-relaxed text-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-4xl xl:text-5xl font-bold text-accent mb-4">
            Az Ácsi Kinizsi SC Története
          </h2>
          <div className="mx-auto w-1/4 h-1 bg-accent mb-2"></div>
          <p className="italic text-gray-400">
            "A múlt tisztelete, a jövő építése."
          </p>
        </div>

        <p className="mb-6 ml-10 mr-10 text-gray-300">
          Az Ácsi Kinizsi SC 1927. február 27-én alakult ötvenhárom ácsi sportszerető polgár összefogásával. A sport club első elnöke Persik István volt.
        </p>

        <div className="bg-sndbg p-6 rounded-lg shadow-lg my-8">
        <p className="mb-6 ml-10  mr-10 text-gray-300">
          Az újonnan alakult club öt szakosztállyal kezdte meg működését:
        </p>


        <ul className="list-decimal list-inside pl-6 mb-6 ml-10 space-y-2">
          <li className="text-accent font-semibold">Football</li>
          <li className="text-accent font-semibold">Kerékpár</li>
          <li className="text-accent font-semibold">Atlétika</li>
          <li className="text-accent font-semibold">Közművelődési alosztály</li>
          <li className="text-accent font-semibold">Turisztikai alosztály</li>
        </ul>
        </div>

        <p className="mb-6 ml-10 mr-10 text-gray-300">
          A sport club mindig fontos szerepet töltött be a község, majd később a városi rangra emelkedett Ács életében. Az Ácsi Kinizsi SC-t a második világháború vihara sem tudta eltüntetni a megyei sport történetéből.
        </p>

        <p className="mb-6 ml-10 mr-10 text-gray-300">
          A Kinizsi fejlődésének, fennmaradásának záloga a lelkes, segítőkész, tenni vágyó ácsi lakosok összefogásának köszönhető. Meg kell említeni a volt Ácsi Cukorgyár fontos szerepét, amelyre talán nem túlzás az Ácsi Kinizsi SC „főszponzoraként” emlékezni.
        </p>

        <p className="mb-6 ml-10 mr-10 text-gray-300">
          Az Ácsi Kinizsi SC szakosztályai mindig fontos és meghatározó szerepet töltöttek be a megye és helyenként az ország sportéletében. Szakosztályaink és sportolóink a Megyei III-tól az NBII-es bajnokságig mérethették meg magukat.
        </p>

        <div className="bg-sndbg p-6 rounded-lg shadow-lg my-8">
          <h3 className="text-xl font-semibold text-accent mb-4">
            A Kinizsi Sport Club jelenleg működő szakosztályai:
          </h3>
          <ul className="list-disc list-inside pl-6 space-y-2 text-gray-200">
            <li>Labdarúgás</li>
            <li>Kézilabda</li>
            <li>Asztalitenisz</li>
            <li>Sakk</li>
            <li>Tenisz</li>
            <li>Lovas szakosztály</li>
          </ul>
        </div>

        <p className="mb-6 ml-10 mr-10 text-gray-300">
          A sport club vezetői, a szakosztályok vezetői, sportolói azon munkálkodnak, hogy az esetlegesen gyengébb szerepléseket feledtessék! Az Ácsi Kinizsi SC szurkolóinak maradandó élményeket nyújtsanak!
        </p>

        <p className="text-center font-bold text-xl text-accent mt-12">
          Hajrá Ácsi Kinizsi SC!
        </p>
      </div>
    </section>
  );
}
