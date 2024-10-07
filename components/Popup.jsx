import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Popup({ news, closePopup }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden'; 

        return () => {
            document.body.style.overflow = 'auto'; 
        };
    }, []);

    return (
        <div className="popup fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
            <div
                className="bg-sndbg p-6 rounded-lg shadow-lg w-full max-w-5xl relative"
                style={{ height: '90vh', overflowY: 'auto', margin: '20px' }} 
            >
                <Button onClick={closePopup} className="absolute top-2 right-2 text-white z-50">
                    X
                </Button>

                {/* Add margin to create space above the first element */}
                <div className="mt-10"> {/* Adjust this value as needed */}
                    {news.images && news.images.length > 0 ? (
                        <div className="mb-4 flex justify-center"> 
                            <Image
                                src={news.images[0]} 
                                alt="Hír kép"
                                width={300} 
                                height={200}
                                className="w-[60%] rounded-lg opacity-90"
                            />
                        </div>
                    ) : null}

                    <h3 className="text-3xl font-bold text-accent text-center uppercase mb-4">
                        {news.title}
                    </h3>
                </div>

                <div className="mb-4 text-white text-justify" dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>
        </div>
    );
}
