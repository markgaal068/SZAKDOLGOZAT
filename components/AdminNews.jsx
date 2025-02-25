import React, { useState, useEffect } from "react";
import AddNewsForm from "@/components/AddNewsForm";
import EditNewsForm from "@/components/EditNewsForm";

const AdminNews = () => {
    const [newsData, setNewsData] = useState([]);
    const [editingNews, setEditingNews] = useState(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/api/news');
            const data = await response.json();
            setNewsData(data.reverse());
        } catch (error) {
            console.error('Hiba történt a hírek betöltésekor:', error);
        }
    };

    const handleAddNews = async (newTitle, newDescription, newContent, newImages) => {
        const newNewsItem = {
            title: newTitle,
            description: newDescription,
            content: newContent,
            images: await Promise.all(newImages.map(convertToBase64)),
        };

        try {
            const response = await fetch('/api/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNewsItem),
            });

            if (response.ok) {
                fetchNews();
            }
        } catch (error) {
            console.error('Hiba történt a hír hozzáadásakor:', error);
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

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-center mb-6"><span className="text-accent">Hírek</span> Kezelése</h2>

            {!editingNews ? (
                <AddNewsForm handleAddNews={handleAddNews} />
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
