import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AddNewsForm({ handleAddNews, session }) {
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newImages, setNewImages] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(files);
    };

    const handleSubmit = () => {
        if (!session?.user) {
            console.error("Nincs bejelentkezve felhasználó!");
            return;
        }

        handleAddNews(newTitle, newDescription, newContent, newImages);

        // Űrlap törlése a hozzáadás után
        setNewTitle("");
        setNewDescription("");
        setNewContent("");
        setNewImages([]);
    };

    const handleInsertTag = () => {
        if (!selectedTag) return;
        setNewContent((prev) => `${prev}<${selectedTag}></${selectedTag}>`);
    };

    const htmlTags = [
        { name: "Bekezdés", tag: "p"},
        { name: "Félkövér", tag: "strong"},
        { name: "Dőlt", tag: "em"},
        { name: "Aláhúzott", tag: "u"},
        { name: "Sortörés", tag: "br"},
        { name: "Idézet", tag: "blockquote"},
        { name: "Kódrészlet", tag: "code"},
        { name: "Kiemelés", tag: "mark"},
        { name: "Áthúzott", tag: "del"},
        { name: "Címsor 1", tag: "h1"},
        { name: "Címsor 2", tag: "h2"},
        { name: "Felsorolás", tag: "ul"},
        { name: "Számozott lista", tag: "ol"},
        { name: "Listaelem", tag: "li"},
        { name: "Táblázat", tag: "table"},
        { name: "Táblázat sor", tag: "tr"},
        { name: "Táblázat fejléc", tag: "th"},
        { name: "Táblázat cella", tag: "td"},
        { name: "Kép", tag: "img src=''"},
        { name: "Link", tag: "a href=''"},
        { name: "Szöveg külön", tag: "span"},
        { name: "Blokk külön", tag: "div"},
    ];

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

            <div className="flex items-center gap-2 w-full mt-4">
                <select
                    className="border rounded p-2 flex-1 text-accent"
                    onChange={(e) => setSelectedTag(e.target.value)}
                >
                    <option value="">Formázási típus</option>
                    {htmlTags.map((tag) => (
                        <option key={tag.tag} value={tag.tag}>{tag.name}</option>
                    ))}
                </select>
                <Button className="bg-accent text-white" onClick={handleInsertTag}>
                    Beszúrás
                </Button>
            </div>

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
