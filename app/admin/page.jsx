"use client"

import { useState } from 'react';
import AdminLanding from '@/components/AdminLanding';
import AdminNews from '@/components/AdminNews';
import AdminUsers from '@/components/AdminUsers';

export default function AdminPage() {
  const [activeComponent, setActiveComponent] = useState('AdminLanding'); // Kezdeti komponens

  // Komponensek
  const renderComponent = () => {
    switch (activeComponent) {
      case 'AdminLanding':
        return <AdminLanding />;
      case 'AdminUsers':
        return <AdminUsers />;
      case 'AdminNews':
        return <AdminNews />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-sndbg flex">
      {/* Sidebar */}
      <div className="bg-bg/60 text-white w-64 p-6">
        <h1 className="text-2xl font-bold mb-8"><span className='text-accent'>Admin</span> Panel</h1>
        <nav>
          <button
            onClick={() => setActiveComponent('AdminLanding')}
            className="block py-2.5 px-4 rounded hover:bg-accent transition duration-200 font-bold"
          >
            Áttekintés
          </button>
          <button
            onClick={() => setActiveComponent('AdminUsers')}
            className="block py-2.5 px-4 rounded hover:bg-accent transition duration-200 font-bold"
          >
            Felhasználók
          </button>
          <button
            onClick={() => setActiveComponent('AdminNews')}
            className="block py-2.5 px-4 rounded hover:bg-accent transition duration-200 font-bold"
          >
            Hírek szerkesztése
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Main Component Display */}
        {renderComponent()}
      </div>
    </div>
  );
}
