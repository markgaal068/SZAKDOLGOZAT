"use client";

import { useState, useEffect } from "react";
import AddNewsForm from "@/components/AddNewsForm";
import NewsItem from "@/components/NewsItem";
import Popup from "@/components/Popup";
import { Button } from "@/components/ui/button";

export default function News() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNews, setSelectedNews] = useState(null);
    const [isAddingNews, setIsAddingNews] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const [enteredCode, setEnteredCode] = useState("");
    const [isCodeCorrect, setIsCodeCorrect] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState(new Set());

    const newsPerPage = 8;
    const correctCode = "123456789Ab";

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news');
                const data = await response.json();
                setNewsData(data.reverse());
            } catch (error) {
                console.error('Hiba történt a hírek betöltésekor:', error);
            }
        };

        fetchNews();
    }, []);
    
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = newsData.slice(indexOfFirstNews, indexOfLastNews);
    const totalPages = Math.ceil(newsData.length / newsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const openPopup = (news) => setSelectedNews(news);
    const closePopup = () => setSelectedNews(null);

    const handleCodeSubmit = () => {
        if (enteredCode === correctCode) {
            setIsCodeCorrect(true);
        } else {
            alert("Helytelen kód!");
            setEnteredCode("");
        }
    };

    const handleAddNews = async (newTitle, newDescription, newContent, newImages) => {
        const newNewsItem = {
            title: newTitle,
            description: newDescription,
            content: newContent,
            images: await Promise.all(newImages.map(convertToBase64)), 
        };

        try {
            const response = await fetch('/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNewsItem),
            });

            if (response.ok) {
                const addedNews = await response.json();
                setNewsData((prevData) => [addedNews, ...prevData]);
                setIsAddingNews(false);
                setIsCodeCorrect(false);
                setEnteredCode("");
            } else {
                console.error('Hiba történt a hír hozzáadása közben:', response.statusText);
            }
        } catch (error) {
            console.error('Hiba történt a hír hozzáadása közben:', error);
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleDeleteSelectedNews = async () => {
        try {
            await Promise.all([...selectedToDelete].map(async (index) => {
                const newsItem = newsData[index];
                const response = await fetch('/api/delete', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: newsItem._id }), 
                });

                if (!response.ok) {
                    throw new Error('Hiba történt a hír törlésekor');
                }
            }));

            const remainingNews = newsData.filter((_, index) => !selectedToDelete.has(index));
            setNewsData(remainingNews);
            setSelectedToDelete(new Set());
        } catch (error) {
            console.error('Hiba történt a törlés során:', error);
        }
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

    const handleCancelAddNews = () => {
        setIsCodeCorrect(false);
        setEnteredCode("");
    };

    return (
        <section>
            <div className="mx-4 xl:mx-16">
                <h2 className="heading text-center text-3xl xl:text-6xl font-bold mb-12 mt-12">Hírek</h2>
                <div className="news-container grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {currentPage === 1 && (
                        <AddNewsForm
                            isCodeCorrect={isCodeCorrect}
                            enteredCode={enteredCode}
                            setEnteredCode={setEnteredCode}
                            handleCodeSubmit={handleCodeSubmit}
                            handleAddNews={handleAddNews}
                            handleDeleteSelectedNews={handleDeleteSelectedNews}
                            handleCancelAddNews={handleCancelAddNews}
                        />
                    )}

                    {currentNews.map((news, index) => (
                        <NewsItem
                            key={index}
                            news={news}
                            index={index}
                            isCodeCorrect={isCodeCorrect}
                            toggleSelectNews={toggleSelectNews}
                            openPopup={openPopup}
                            selectedToDelete={selectedToDelete}
                            
                        />
                    ))}
                </div>

                <div className="pagination flex justify-center mb-2 gap-1">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <Button key={index} onClick={() => paginate(index + 1)}>
                            {index + 1}
                        </Button>
                    ))}
                </div>

                {selectedNews && (
                    <Popup news={selectedNews} closePopup={closePopup} />
                )}
            </div>
        </section>
    );
}
