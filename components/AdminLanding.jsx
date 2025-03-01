"use client"

import Image from "next/image";

const AdminLanding = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-b from-primary to-secondary">
            <div className="flex flex-col items-center justify-center">
                <Image 
                    src="/kinizsicimer.png" 
                    alt="Egyesület címere" 
                    width={400} 
                    height={400} 
                    className="object-contain"
                />
                <h1 className="text-4xl font-bold text-center text-accent mt-6">
                    Üdvözöljük az oldalon!
                </h1>
            </div>
        </div>
    );
};

export default AdminLanding;
