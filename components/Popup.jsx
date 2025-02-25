import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Popup({ news, closePopup }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % news.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + news.images.length) % news.images.length);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4">
            <div className="bg-sndbg p-8 rounded-3xl shadow-xl w-full max-w-3xl relative flex flex-col items-center" style={{ maxHeight: "85vh", overflow: "hidden" }}>
                <Button onClick={closePopup} className="absolute top-4 right-4 text-accent bg-transparent hover:bg-accent hover:text-sndbg transition-all rounded-full p-2 border-none">✕</Button>

                {news.images && news.images.length > 0 && (
                    <div className="relative mb-6 w-full flex justify-center">
                        <Image src={news.images[currentImageIndex]} alt="Hír kép" width={400} height={250} className="w-[80%] max-h-[250px] object-cover rounded-xl shadow-md" />
                        {news.images.length > 1 && (
                            <>
                                <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full" onClick={prevImage}>{"<"}</button>
                                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full" onClick={nextImage}>{">"}</button>
                            </>
                        )}
                    </div>
                )}

                <h3 className="text-4xl font-semibold text-accent text-center uppercase mb-4">{news.title}</h3>

                <div className="text-white text-lg leading-relaxed overflow-y-auto px-4" style={{ maxHeight: "50vh", scrollbarWidth: "thin", scrollbarColor: "#3cba54 #323946" }} dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>
        </div>
    );
}
