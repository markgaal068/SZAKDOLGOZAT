"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import AdminLanding from "@/components/AdminLanding";
import AdminNews from "@/components/AdminNews";
import AdminUsers from "@/components/AdminUsers";
import AdminTools from "@/components/AdminTools";

export default function AdminPage() {
  const [activeComponent, setActiveComponent] = useState("AdminLanding"); // Kezdeti komponens
  const { data: session } = useSession(); // Bejelentkezett felhasználó lekérése

  // Komponensek
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
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <div className="bg-sndbg text-white w-64 p-6">
        <h1 className="text-2xl font-bold mb-2">
          <span className="text-accent">Admin</span> Panel
        </h1>
        <nav>
          <button
            onClick={() => setActiveComponent("AdminLanding")}
            className="block py-2.5 px-4 rounded hover:bg-accent transition duration-200 font-bold"
          >
            Áttekintés
          </button>
          <button
            onClick={() => setActiveComponent("AdminUsers")}
            className="block py-2.5 px-4 rounded hover:bg-accent transition duration-200 font-bold"
          >
            Felhasználók
          </button>
          <button
            onClick={() => setActiveComponent("AdminNews")}
            className="block py-2.5 px-4 rounded hover:bg-accent transition duration-200 font-bold"
          >
            Hírek szerkesztése
          </button>
          <button
            onClick={() => setActiveComponent("AdminTools")}
            className="block py-2.5 px-4 rounded hover:bg-accent transition duration-200 font-bold"
          >
            Formázási tagek
          </button>
        </nav>

        {session?.user && (
          <div className="bg-gradient-to-r from-sndbg to-accent text-white rounded-xl p-6 shadow-lg mb-6 mt-6 transform transition-transform duration-200 hover:scale-105">
            <h2 className="text-2xl font-bold mb-4">Bejelentkezve</h2>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold">Üdvözöljük, <span className="font-bold">{session.user.fullname}</span>!</p>
                <p className="text-sm text-white text-opacity-80">{session.user.role} szerepkörben</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-white text-opacity-80 italic">Köszönjük, hogy velünk dolgozik!</p>
            </div>
          </div>
        )}

      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{renderComponent()}</div>
    </div>
  );
}
