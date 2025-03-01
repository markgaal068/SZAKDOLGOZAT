"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import AdminLanding from "@/components/AdminLanding";
import AdminNews from "@/components/AdminNews";
import AdminUsers from "@/components/AdminUsers";
import AdminTools from "@/components/AdminTools";
import { CiMenuFries } from "react-icons/ci";
import { GrUserAdmin } from "react-icons/gr";

export default function AdminPage() {
  const [activeComponent, setActiveComponent] = useState("AdminLanding"); 
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession(); 

  const renderComponent = () => {
    switch (activeComponent) {
      case "AdminLanding":
        return <AdminLanding />;
      case "AdminUsers":
        return <AdminUsers />;
      case "AdminNews":
        return <AdminNews />;
      case "AdminTools":
        return <AdminTools />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg">
      {/* Mobil menü gomb */}
      <button 
        className="md:hidden p-4 text-white text-3xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <GrUserAdmin />
      </button>

      {/* Sidebar */}
      <div className={`bg-sndbg text-white w-64 p-6 absolute md:relative transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}>
        <h1 className="text-2xl font-bold mb-4">
          <span className="text-accent">Admin</span> Panel
        </h1>
        <nav className="flex flex-col space-y-2">
          {[
            { label: "Áttekintés", id: "AdminLanding" },
            { label: "Felhasználók", id: "AdminUsers" },
            { label: "Hírek szerkesztése", id: "AdminNews" },
            { label: "Formázási tagek", id: "AdminTools" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveComponent(item.id);
                setMenuOpen(false); 
              }}
              className="block py-2.5 px-4 rounded hover:bg-accent transition duration-200 font-bold"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {session?.user && (
          <div className="bg-gradient-to-r from-sndbg to-accent text-white rounded-xl p-6 shadow-lg mt-6 hover:scale-105 transition-transform">
            <h2 className="text-2xl font-bold mb-4">Bejelentkezve</h2>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold">Üdv, <span className="font-bold">{session.user.fullname}</span>!</p>
                <p className="text-sm text-white text-opacity-80">{session.user.role} szerepkörben</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tartalom */}
      <div className="flex-1 p-8">{renderComponent()}</div>
    </div>
  );
}
