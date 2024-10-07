import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Popup({ news, closePopup }) {
    // Effect to disable scrolling when the popup is open
    useEffect(() => {
        document.body.style.overflow = 'hidden'; // Disable scrolling

        return () => {
            document.body.style.overflow = 'auto'; // Restore scrolling on cleanup
        };
    }, []);

    return (
        <div className="popup fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div
                className="bg-sndbg p-6 rounded-lg shadow-lg w-full max-w-5xl relative"
                style={{ height: '90vh', overflowY: 'auto', margin: '20px' }} // Add margins around the popup
            >
                <Button onClick={closePopup} className="absolute top-2 right-2 text-white z-50">
                    Bezárás
                </Button>

                {news.images && news.images.length > 0 ? (
                    <div className="mb-4 flex justify-center"> {/* Centering the image */}
                        <Image
                            src={news.images[0]} // Use the first image
                            alt="Hír kép"
                            width={300} // Adjusted width for a smaller image
                            height={200} // Adjusted height for a smaller image
                            className="w-[60%] rounded-lg opacity-90" // 50% width, auto height
                        />
                    </div>
                ) : null}

                <h3 className="text-3xl font-bold text-accent text-center uppercase mb-4">
                    {news.title}
                </h3>

                <div className="mb-4 text-white text-justify" dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>
        </div>
    );
}
