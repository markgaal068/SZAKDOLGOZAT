"use client"; 

import Image from "next/image"; 
import { Button } from "@/components/ui/button"; 

export default function Loveszet() {
  return (
    <section>
      <div className="mx-4 xl:mx-16">
        <h2 className="heading text-center text-3xl xl:text-6xl font-bold mb-12 mt-12"> 
            <span className="text-accent">Lovas</span> Szakosztály
        </h2>

        <div className="teams-container grid grid-cols-1 xl:grid-cols-2">
          {teamData.map((team, index) => (
            <div className="rounded-[40px] bg-sndbg border border-bg p-6 flex flex-col items-center m-10 hover:border-accent border-2" key={index}>
              <Image src={team.image} alt={team.title} width={300} height={200} className="rounded-md mb-4" />
              <h3 className="text-xl font-semibold text-center">{team.title}</h3>
              <p className="text-center mb-4">{team.description}</p>
              <Button>A Csapat</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

//ÁTÍRANDÓ CSAPATOKRA!!!
const teamData = [
  {
    image: "/kep.jpg",
    title: "Labdarúgás",
    description: "Lorem lorem lorem lorem",
    tableLink: "https://www.mksz.hu/versenyek/upNoiVersenyek/32021930/320216840",
  },
  {
    image: "/kep.jpg",
    title: "Kézilabda",
    description: "Lorem lorem lorem lorem",
    tableLink: "https://www.mksz.hu/versenyek/upNoiVersenyek/32021918/320216813",
  },
  {
    image: "/kep.jpg",
    title: "Asztalitenisz",
    description: "Lorem lorem lorem lorem",
    tableLink: "https://www.mksz.hu/versenyek/felnottNoiVersenyek/32021963/320217258",
  },
  {
    image: "/kep.jpg", 
    title: "Sakk",
    description: "Lorem lorem lorem lorem",
    tableLink: "https://www.mksz.hu/versenyek/felnottNoiVersenyek/32021902/320216604",
  },
  {
    image: "/kep.jpg",
    title: "Tenisz",
    description: "Lorem lorem lorem lorem",
    tableLink: "https://www.mksz.hu/versenyek/upFerfiVersenyek/32021915/320216798",
  },
  {
    image: "/kep.jpg",
    title: "Lovas",
    description: "Lorem lorem lorem lorem",
    tableLink: "https://www.mksz.hu/versenyek/felnottFerfiVersenyek/32021900/320216591",
  },
];
