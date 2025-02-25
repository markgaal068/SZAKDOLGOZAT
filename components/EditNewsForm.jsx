import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditNewsForm({ news, handleEditNews, cancelEdit }) {
    const [title, setTitle] = useState(news.title);
    const [description, setDescription] = useState(news.description);
    const [content, setContent] = useState(news.content);
    const [images, setImages] = useState(news.images || []);

    // Új képek feltöltése
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => URL.createObjectURL(file));
        setImages([...images, ...newImages]);
    };

    // Kép törlése
    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Hír szerkesztése
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedNews = {
            id: news._id,
            title,
            description,
            content,
            images, // Szerveroldalon is kezelni kell
        };

        try {
            const response = await fetch('/api/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedNews),
            });

            if (response.ok) {
                handleEditNews(updatedNews); // Frissítjük a híreket a fő komponensben
                cancelEdit(); // Kilépünk a szerkesztőből
            } else {
                console.error('Hiba történt a hír frissítésekor:', response.statusText);
            }
        } catch (error) {
            console.error('Hiba történt a hír frissítésekor:', error);
        }
    };

    return (
        <div className="rounded-lg bg-sndbg shadow-md p-6 flex flex-col items-center">
            <h3 className="text-2xl font-semibold text-center mb-4">Hír szerkesztése</h3>

            <form onSubmit={handleSubmit} onCancel={cancelEdit}  className="flex w-full flex-col space-y-4">
                {/* Cím */}
                <label className="text-accent font-semibold">Cím:</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="border rounded p-2 w-full text-accent"/>

                {/* Leírás */}
                <label className="text-accent font-semibold">Leírás:</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="border rounded p-2 w-full text-accent"/>

                {/* Tartalom */}
                <label className="text-accent font-semibold">Tartalom:</label>
                <Textarea value={content} onChange={(e) => setContent(e.target.value)} required className="border rounded p-2 w-full text-accent"/>

                {/* Képek */}
                <label className="text-accent font-semibold">Képek:</label>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="text-white" />

                {/* Képek előnézete és törlés gomb */}
                <div className="flex flex-wrap gap-2">
                    {images.map((img, index) => (
                        <div key={index} className="relative">
                            <img src={img} alt={`Hír kép ${index}`} className="w-24 h-24 object-cover rounded-md shadow-md" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                {/* Gombok */}
                <div className="flex justify-between mt-4">
                    <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                        Mentés
                    </Button>
                    <Button type="cancel" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                        Mégse
                    </Button>
                </div>
            </form>
        </div>
    );
}
