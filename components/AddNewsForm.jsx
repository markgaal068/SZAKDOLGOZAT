import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddNewsForm({ handleAddNews }) {
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newImages, setNewImages] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);
    };

    // Hír hozzáadása
    const handleSubmit = () => {
        handleAddNews(newTitle, newDescription, newContent, newImages);

        // Űrlap törlése a hozzáadás után
        setNewTitle("");
        setNewDescription("");
        setNewContent("");
        setNewImages([]);
    };

    return (
        <div className="rounded-lg bg-sndbg shadow-md p-6 flex flex-col items-center">
            <h3 className="text-2xl font-semibold text-center mb-4">Hír hozzáadása</h3>
            <input
                type="text"
                className="border rounded p-2 w-full text-accent"
                placeholder="Cím"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
                type="text"
                className="border rounded p-2 w-full mt-4 text-accent"
                placeholder="Leírás"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
            />
            <textarea
                className="border rounded p-2 w-full mt-4 h-32 text-accent"
                placeholder="Tartalom"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
            />
            <input
                type="file"
                className="border rounded p-2 w-full mt-4"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
            />

            <Button className="mt-4 bg-accent text-white" onClick={handleSubmit}>
                Hír hozzáadása
            </Button>
        </div>
    );
}
