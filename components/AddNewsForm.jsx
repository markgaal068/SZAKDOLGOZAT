import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AddNewsForm({
    isCodeCorrect,
    enteredCode,
    setEnteredCode,
    handleCodeSubmit,
    handleAddNews,
    handleDeleteSelectedNews,
    handleCancelAddNews 
}) {
    const [newImages, setNewImages] = useState([]);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file instanceof File);
        console.log('Uploaded Files:', validFiles); // Debugging line
        setNewImages((prevImages) => [...prevImages, ...validFiles]);
    };
   

    return (
        <div className="rounded-[40px] bg-sndbg border border-bg p-6 flex flex-col items-center hover:border-accent border-2 xl:gap-10 m-5">
            {!isCodeCorrect ? (
                <>
                    <h3 className="text-xl font-semibold text-center">Hír hozzáadása</h3>
                    <input
                        type="text"
                        className="border border-accent rounded p-2 mt-4 text-center text-accent bg-bg"
                        placeholder="Jelszó..."
                        value={enteredCode}
                        onChange={(e) => setEnteredCode(e.target.value)}
                    />
                    <Button className="mt-4" onClick={handleCodeSubmit}>
                        Kód ellenőrzése
                    </Button>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-semibold text-center text-accent">Új hír hozzáadása</h3>
                    <input type="text" className="border border-accent rounded p-2 mt-4 bg-bg text-accent" placeholder="Hír címe" id="newTitle" />
                    <input type="text" className="border border-accent bg-bg rounded p-2 mt-4 text-accent" placeholder="Hír leírása" id="newDescription" />
                    <textarea className="border border-accent bg-bg rounded p-2 mt-4 text-accent h-32" placeholder="Hír tartalma" id="newContent" />
                    <input type="file" className="border border-accent bg-bg rounded p-2 mt-4 text-accent" multiple accept="image/*" onChange={handleImageUpload} />
                    
                    
                    <Button
                        className="mt-4"
                        onClick={() => handleAddNews(
                            document.getElementById("newTitle").value,
                            document.getElementById("newDescription").value,
                            document.getElementById("newContent").value,
                            newImages
                        )}
                    >
                        Hír hozzáadása
                    </Button>

                    
                    <Button className="mt-4 bg-red-500 text-white" onClick={handleDeleteSelectedNews}>
                        Kiválasztott hírek törlése
                    </Button>

                    
                    <Button className="mt-4 bg-gray-500 text-white" onClick={handleCancelAddNews}>
                        Mégse
                    </Button>
                </>
            )}
        </div>
    );
}
