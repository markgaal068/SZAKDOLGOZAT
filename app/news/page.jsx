"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function News() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isAddingNews, setIsAddingNews] = useState(false);
    const [newsData, setNewsData] = useState([]); // Initialize with an empty array
    const [enteredCode, setEnteredCode] = useState("");
    const [isCodeCorrect, setIsCodeCorrect] = useState(false);
    const [newImages, setNewImages] = useState([]);
    const [selectedToDelete, setSelectedToDelete] = useState(new Set());
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Added to track current image index

    const newsPerPage = 8;
    const correctCode = "123456789Ab";

    useEffect(() => {
        const storedData = localStorage.getItem("newsData");
        if (storedData) {
            setNewsData(JSON.parse(storedData));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("newsData", JSON.stringify(newsData));
    }, [newsData]);

    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);
    const totalPages = Math.ceil(newsData.length / newsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openPopup = (news) => {
        setSelectedNews(news);
        setCurrentImageIndex(0); // Reset image index when opening the popup
    };

    const closePopup = () => {
        setSelectedNews(null);
    };

    useEffect(() => {
        if (selectedNews) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [selectedNews]);

    const handleCodeSubmit = () => {
        if (enteredCode === correctCode) {
            setIsCodeCorrect(true);
        } else {
            alert("Helytelen kód!");
            setEnteredCode(""); // Clear the password field on incorrect code
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => file instanceof File);
        setNewImages((prevImages) => [...prevImages, ...validFiles]);
    };

    const handleAddNews = (newTitle, newDescription, newContent) => {
        const newNewsItem = {
            title: newTitle,
            description: newDescription,
            content: newContent,
            images: newImages.map(image => URL.createObjectURL(image)), // Convert to base64
        };

        setNewsData((prevData) => [newNewsItem, ...prevData]);

        // Clear fields and reset states
        setIsAddingNews(false);
        setIsCodeCorrect(false);
        setEnteredCode(""); // Clear password field on successful add
        setNewImages([]);
    };

    const handleDeleteSelectedNews = () => {
        const updatedNewsData = newsData.filter((_, index) => !selectedToDelete.has(index));
        setNewsData(updatedNewsData);
        setSelectedToDelete(new Set()); // Clear selected items
    };

    const toggleSelectNews = (index) => {
        const newSelectedToDelete = new Set(selectedToDelete);
        if (newSelectedToDelete.has(index)) {
            newSelectedToDelete.delete(index);
        } else {
            newSelectedToDelete.add(index);
        }
        setSelectedToDelete(newSelectedToDelete);
    };

    const handleCancel = () => {
        setIsAddingNews(false); // Disable adding news
        setEnteredCode(""); // Clear the password field
        setNewImages([]); // Clear images
        setIsCodeCorrect(false); // Reset code state
    };

    // Function to go to the next image
    const goToNextImage = () => {
        if (selectedNews && currentImageIndex < selectedNews.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    // Function to go to the previous image
    const goToPreviousImage = () => {
        if (selectedNews && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    return (
        <section>
            <div className="mx-4 xl:mx-16">
                <h2 className="heading text-center text-3xl xl:text-6xl font-bold mb-12 mt-12">Hírek</h2>

                <div className="news-container grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {currentPage === 1 && (
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
                                    <Button className="mt-4" onClick={handleCodeSubmit}>Kód ellenőrzése</Button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-semibold text-center text-accent">Új hír hozzáadása</h3>
                                    <input
                                        type="text"
                                        className="border border-accent rounded p-2 mt-4 bg-bg text-accent"
                                        placeholder="Hír címe"
                                        id="newTitle"
                                    />
                                    <input
                                        type="text"
                                        className="border border-accent bg-bg rounded p-2 mt-4 text-accent"
                                        placeholder="Hír leírása"
                                        id="newDescription"
                                    />
                                    <textarea
                                        className="border border-accent bg-bg rounded p-2 mt-4 text-accent h-32"
                                        placeholder="Hír tartalma"
                                        id="newContent"
                                    />
                                    <input
                                        type="file"
                                        className="border border-accent bg-bg rounded p-2 mt-4 text-accent"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <Button
                                        className="mt-4"
                                        onClick={() =>
                                            handleAddNews(
                                                document.getElementById("newTitle").value,
                                                document.getElementById("newDescription").value,
                                                document.getElementById("newContent").value
                                            )
                                        }
                                    >
                                        Hír hozzáadása
                                    </Button>

                                    {/* Delete selected news button, only visible if the code is correct */}
                                    {isCodeCorrect && (
                                        <Button
                                            className="mt-4 bg-red-500 text-white"
                                            onClick={handleDeleteSelectedNews}
                                        >
                                            Kiválasztott hírek törlése
                                        </Button>
                                    )}
                                    {/* Cancel button */}
                                    <Button
                                        className="mt-4 bg-gray-500 text-white"
                                        onClick={handleCancel}
                                    >
                                        Mégse
                                    </Button>
                                </>
                            )}
                        </div>
                    )}

                    {currentNews.map((news, index) => (
                        <div className="rounded-[40px] bg-sndbg border border-bg p-6 flex flex-col items-center hover:border-accent border-2 xl:gap-10 m-5" key={index}>
                            <h3 className="text-xl font-semibold text-center">{news.title}</h3>
                            <p className="text-center mb-4">{news.description}</p>
                            {isCodeCorrect && ( // Checkbox only visible if the code is correct
                                <input
                                    type="checkbox"
                                    checked={selectedToDelete.has(index)}
                                    onChange={() => toggleSelectNews(index)}
                                />
                            )}
                            <Button onClick={() => openPopup(news)}>Továbbiak</Button>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="pagination flex justify-center mt-8">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`mx-2 ${currentPage === index + 1 ? "bg-accent" : "bg-sndbg"}`}
                        >
                            {index + 1}
                        </Button>
                    ))}
                </div>

                {/* Popup Modal */}
                {selectedNews && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                        <div className="bg-sndbg p-5 rounded-lg relative" style={{ width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
                            <Button onClick={closePopup} className="absolute top-2 right-2">X</Button>
                            <h2 className="text-xl font-semibold mb-4">{selectedNews.title}</h2>
                            <p className="mb-4">{selectedNews.description}</p>
                            <div
                                className="mb-4"
                                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                            /> {/* Render content with preserved formatting */}

                            <div className="flex overflow-x-auto w-full space-x-4 mt-4 snap-x justify-start"> {/* Enable horizontal scroll and align images left */}
                                {selectedNews.images.length > 0 ? (
                                    selectedNews.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={selectedNews.title}
                                            className="w-32 h-auto snap-center flex-shrink-0" // Prevent images from shrinking
                                            style={{ cursor: 'pointer' }}
                                        />
                                    ))
                                ) : (
                                    <p>No images available</p> // Fallback if no images exist
                                )}
                            </div>

                            <div className="mt-4 text-center">
                                <br />
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
