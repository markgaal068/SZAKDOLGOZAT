"use client"; 

import Image from "next/image"; 
import { FaFemale, FaMale } from "react-icons/fa"; 
import { Button } from "@/components/ui/button"; 
import Link from "next/link";

export default function Teams() {
  return (
    <section>
      <div className="mx-4 xl:mx-16">
        <h2 className="heading text-center text-3xl xl:text-6xl font-bold mb-12 mt-12">
          Ácsi <span className="text-accent">Kinizsi</span> SC<span> Szakosztályok</span>
        </h2>

        <div className="teams-container grid grid-cols-1 xl:grid-cols-2">
          {departmentData.map((department, index) => (
            <div
              className="rounded-[40px] bg-sndbg border border-bg p-6 flex flex-col hover:border-accent border-2 xl:gap-10 m-5 h-[350px]" 
              key={index}
              style={{
                backgroundImage: department.background ? `url(${department.background})` : 'none',
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
              }}
            >
              <div className="bg-sndbg rounded-[20px] w-full p-4 h-32 flex flex-col justify-center items-center mb-4"> 
                <h3 className="text-xl font-semibold text-center">{department.title}</h3>
                <p className="text-center mb-2">{department.description}</p>
              </div>
              <div className="flex-grow" /> 
              <div className="flex justify-center">
                <Link href={department.tableLink}>
                  <Button className="mt-4">Továbbiak</Button> 
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Team data
const departmentData = [
  {
    title: "labdarúgás",
    description: "Lorem lorem lorem lorem",
    tableLink: "./szakosztalyok/labdarugas",
    background: "./foca.webp",
  },
  {
    title: "Kézilabda",
    description: "Lorem lorem lorem lorem",
    tableLink: "./szakosztalyok/kezilabda",
    background: "./kezi.webp",
  },
  {
    title: "Asztalitenisz",
    description: "Lorem lorem lorem lorem",
    tableLink: "./szakosztalyok/asztalitenisz",
  },
  {
    title: "Sakk",
    description: "Lorem lorem lorem lorem",
    tableLink: "./szakosztalyok/sakk",
  },
  {
    title: "Tenisz",
    description: "Lorem lorem lorem lorem",
    tableLink: "./szakosztalyok/tenisz",
  },
  {
    title: "Lovas",
    description: "Lorem lorem lorem lorem",
    tableLink: "./szakosztalyok/lovas",
  },
  {
    title: "Lövészet",
    description: "Lorem lorem lorem lorem",
    tableLink: "./szakosztalyok/loveszet",
  },
  {
    title: "Ritmikus Gimnasztika",
    description: "Lorem lorem lorem lorem",
    tableLink: "./szakosztalyok/rg",
  },
];
