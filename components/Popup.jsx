import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Popup({ news, closePopup }) {
    return (
        <div className="popup fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div
                className="bg-sndbg p-6 rounded shadow-lg w-full max-w-5xl max-h-screen overflow-y-auto relative"
                style={{ height: '90vh' }} 
            >
                
                <Button onClick={closePopup} className="absolute top-2 right-2 text-white">
                    Bezárás
                </Button>

               
                <h3 className="text-xl font-bold mb-4">{news.title}</h3>

               
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: news.content }} />

                
                <div className="images flex overflow-x-auto mt-4 space-x-4 snap-x justify-start"> 
                    {news.images && news.images.length > 0 ? (
                        news.images.map((image, index) => (
                            <Image
                                key={index}
                                src={typeof image === 'object' ? URL.createObjectURL(image) : image}
                                alt={`Hír kép ${index}`}
                                width={300}
                                height={300}
                                className="w-32 h-auto snap-center flex-shrink-0"
                                style={{ cursor: 'pointer' }}
                            />
                        ))
                    ) : (
                        <p>Nincsenek képek</p>
                    )}
                </div>
            </div>
        </div>
    );
}
