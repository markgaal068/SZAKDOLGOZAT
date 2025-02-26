"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // NextAuth signIn használata közvetlenül a bejelentkezéshez
        const res = await signIn("credentials", {
            redirect: false, // Ne irányítson át automatikusan
            username,
            password,
        });
        
        if (res?.error) {
            console.log("Bejelentkezési hiba:", res.error);
            setError(res.error || "Hibás felhasználónév vagy jelszó");
        } else {
            console.log("Sikeres bejelentkezés");
            router.push("/admin");
        }
    };

    return (
        <div className="relative flex items-center justify-center h-screen bg-gradient-to-b from-primary to-secondary">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Image
                    src="/kinizsicimer.png"
                    alt="Egyesület címere"
                    width={800}
                    height={800}
                    className="object-contain"
                />
            </div>

            {/* Bejelentkezési panel */}
            <div className="relative z-10 bg-transparent p-10 rounded-3xl shadow-2xl w-[600px] flex flex-col items-center">
                <h2 className="text-6xl font-bold text-accent mb-6">Bejelentkezés</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Felhasználónév"
                        className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-accent text-lg text-accent"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Jelszó"
                        className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-accent text-lg text-accent"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-accent text-white py-3 rounded-lg font-semibold text-lg hover:bg-accent-dark transition-all shadow-md"
                    >
                        Bejelentkezés
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
