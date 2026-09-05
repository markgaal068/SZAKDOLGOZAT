import React, { useState, useEffect } from "react";
import AddNewsForm from "@/components/AddNewsForm";
import EditNewsForm from "@/components/EditNewsForm";
import { useSession } from "next-auth/react"; // NextAuth session hook
import { fileToCompressedDataUrl } from "@/lib/image";

const AdminNews = () => {
    const { data: session } = useSession(); // Session lekérése
    const [newsData, setNewsData] = useState([]);
    const [editingNews, setEditingNews] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/api/news');
            const data = await response.json();
            // Valódi dátum szerinti rendezés, ne csak a beszúrási sorrend megfordítása
            const sorted = [...data].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setNewsData(sorted);
        } catch (error) {
            console.error('Hiba történt a hírek betöltésekor:', error);
        }
    };

    const handleAddNews = async (newTitle, newDescription, newContent, newImages) => {
        if (!session?.user) {
            console.error("Nincs bejelentkezve felhasználó!");
            return;
        }

        setErrorMessage(null);

        const author = session.user.fullname; // Szerző neve
        const createdAt = new Date().toISOString(); // Aktuális dátum

        const newNewsItem = {
            title: newTitle,
            description: newDescription,
            content: newContent,
            images: await Promise.all(newImages.map((file) => fileToCompressedDataUrl(file))),
            author, // Szerző hozzáadása
            createdAt, // Dátum hozzáadása
        };

        try {
            const response = await fetch('/api/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNewsItem),
            });

            if (response.ok) {
                fetchNews();
            } else if (response.status === 413) {
                setErrorMessage("A feltöltött kép(ek) mérete túl nagy. Próbálj kisebb fájlokat feltölteni.");
            } else {
                const data = await response.json().catch(() => ({}));
                setErrorMessage(data.error || "Hiba történt a hír hozzáadásakor.");
            }
        } catch (error) {
            console.error('Hiba történt a hír hozzáadásakor:', error);
            setErrorMessage("Hiba történt a hír hozzáadásakor.");
        }
    };

    const handleDeleteNews = async (id) => {
        try {
            const response = await fetch('/api/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (response.ok) {
                fetchNews();
            }
        } catch (error) {
            console.error('Hiba történt a törlés során:', error);
        }
    };

    const handleEditNews = async (updatedNews) => {
        try {
            const response = await fetch('/api/edit', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedNews),
            });

            if (response.ok) {
                setEditingNews(null);
                fetchNews();
            }
        } catch (error) {
            console.error('Hiba történt a szerkesztés során:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-center mb-6"><span className="text-accent">Hírek</span> Kezelése</h2>

            {errorMessage && (
                <p className="text-center text-red-400 bg-red-950/40 border border-red-500/40 rounded-lg py-2 px-4 mb-4">
                    {errorMessage}
                </p>
            )}

            {!editingNews ? (
                <AddNewsForm handleAddNews={handleAddNews} session={session} /> 
            ) : (
                <EditNewsForm news={editingNews} handleEditNews={handleEditNews} />
            )}

            <div className="overflow-x-auto mt-8">
                <table className="min-w-full border-collapse border border-accent">
                    <thead>
                        <tr className="bg-accent">
                            <th className="border border-sndbg/60 px-4 py-2">Cím</th>
                            <th className="border border-sndbg/60  px-4 py-2">Leírás</th>
                            <th className="border border-sndbg/60  px-4 py-2">Kép</th>
                            <th className="border border-sndbg/60  px-4 py-2">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newsData.map((news) => (
                            <tr key={news._id} className="text-center">
                                <td className="border border-sndbg/60  px-4 py-2">{news.title}</td>
                                <td className="border border-sndbg/60  px-4 py-2">{news.description}</td>
                                <td className="border border-sndbg/60  px-4 py-2">
                                    {news.images.length > 0 && (
                                        <img src={news.images[0]} alt="Hír kép" className="w-20 h-20 object-cover mx-auto" />
                                    )}
                                </td>
                                <td className="border border-sndbg/60 px-4 py-2 space-x-2">
                                    <button className="bg-accent/70 hover:bg-accent text-white px-3 py-1 rounded" onClick={() => setEditingNews(news)}>Szerkesztés</button>
                                    <button className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDeleteNews(news._id)}>Törlés</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminNews;