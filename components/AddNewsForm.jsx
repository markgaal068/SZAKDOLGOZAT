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
    
        const author = session.user.name;  // Bejelentkezett felhasználó neve
        const createdAt = new Date().toISOString(); // Létrehozási dátum
    
        handleAddNews(newTitle, newDescription, newContent, newImages, author, createdAt);
    
        // Űrlap törlése a hozzáadás után
        setNewTitle("");
        setNewDescription("");
        setNewContent("");
        setNewImages([]);
    };
    

    const handleInsertTag = () => {
        if (!selectedTag) return;
        setNewContent((prev) => `${prev}${selectedTag}`);
    };

    const htmlTags = [
        { name: "Alcím", tag: "<h3></h3>"},
        { name: "Áthúzott", tag: "<del></del>"},
        { name: "Bevezető", tag: "<section class='intro'></section>"},
        { name: "Blokk külön", tag: "<div></div>"},
        { name: "Cikk cím", tag: "<header><h1></h1></header>"},
        { name: "Cikkek közötti hivatkozás", tag: "<a href=''></a>"},
        { name: "Cikk vége", tag: "<footer><p>Vége</p></footer>"},
        { name: "Citált szöveg", tag: "<cite></cite>"},
        { name: "Dőlt", tag: "<em></em>"},
        { name: "Félkövér", tag: "<strong></strong>"},
        { name: "Felsorolás", tag: "<ul></ul>"},
        { name: "Források", tag: "<aside><p>Forrás: </p></aside>"},
        { name: "Idézet", tag: "<blockquote></blockquote>"},
        { name: "Képaláírás", tag: "<figcaption></figcaption>"},
        { name: "Kép", tag: "<img src=''>"},
        { name: "Kiemelés", tag: "<mark></mark>"},
        { name: "Kódrészlet", tag: "<code></code>"},
        { name: "Link", tag: "<a href=''></a>"},
        { name: "Listaelem", tag: "<li></li>"},
        { name: "Oldalsáv", tag: "<aside></aside>"},
        { name: "Számozott lista", tag: "<ol></ol>"},
        { name: "Szöveg külön", tag: "<span></span>"},
        { name: "Szöveg kiemelés (citálás)", tag: "<q></q>"},
        { name: "Sortörés", tag: "<br>"},
        { name: "Táblázat", tag: "<table></table>"},
        { name: "Táblázat cella", tag: "<td></td>"},
        { name: "Táblázat fejléc", tag: "<th></th>"},
        { name: "Táblázat sor", tag: "<tr></tr>"},
        { name: "Videó", tag: "<video controls><source src=''></video>"},
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
