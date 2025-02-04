import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Popup({ news, closePopup }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4">
            <div
                className="bg-sndbg p-8 rounded-3xl shadow-xl w-full max-w-3xl relative flex flex-col items-center"
                style={{
                    maxHeight: "85vh",
                    overflow: "hidden",
                }}
            >
                {/* Bezárás gomb */}
                <Button
                    onClick={closePopup}
                    className="absolute top-4 right-4 text-accent bg-transparent hover:bg-accent hover:text-sndbg transition-all rounded-full p-2 border-none"
                >
                    ✕
                </Button>

                {/* Kép */}
                {news.images && news.images.length > 0 && (
                    <div className="mb-6 w-full flex justify-center">
                        <Image
                            src={news.images[0]}
                            alt="Hír kép"
                            width={400}
                            height={250}
                            className="w-[80%] max-h-[250px] object-cover rounded-xl shadow-md"
                        />
                    </div>
                )}

                {/* Cím */}
                <h3 className="text-4xl font-semibold text-accent text-center uppercase mb-4">
                    {news.title}
                </h3>

                {/* Tartalom csúszkával */}
                <div
                    className="text-white text-lg leading-relaxed overflow-y-auto px-4"
                    style={{
                        maxHeight: "50vh",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#3cba54 #323946",
                    }}
                    dangerouslySetInnerHTML={{ __html: news.content }}
                />
            </div>
        </div>
    );
}
