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
          Ácsi <span className="text-accent">Kinizsi</span> SC<span>. Szakosztályok</span>
        </h2>

        <div className="teams-container grid grid-cols-1 xl:grid-cols-2">
          {departmentData.map((department, index) => (
            <div className="rounded-[40px] bg-sndbg border border-bg p-6 flex flex-col items-center hover:border-accent border-2 xl:gap-10 m-5" key={index}>
              <h3 className="text-xl font-semibold text-center">{department.title}</h3>
              <p className="text-center mb-4">{department.description}</p>
              <Link href={department.tableLink}>
              <Button>Továbbiak</Button>
              </Link>
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
    title: "Labdarúgás",
    description: "Lorem lorem lorem lorem",
    tableLink: "./szakosztalyok/labdarugas",
  },
  {
    title: "Kézilabda",
    description: "Lorem lorem lorem lorem",
    tableLink: "./szakosztalyok/kezilabda",
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
];
