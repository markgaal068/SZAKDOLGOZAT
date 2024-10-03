"use client"

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
            const response = await fetch('/api/news');
            const data = await response.json();
            setNewsData(data);
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
            images: newImages,
        };
        const response = await fetch('/api/news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newNewsItem),
        });

        if (response.ok) {
            const addedNews = await response.json();
            setNewsData((prevData) => [newNewsItem, ...prevData]);
            setIsAddingNews(false);
            setIsCodeCorrect(false);
            setEnteredCode("");
        }
    };

    const handleDeleteSelectedNews = async () => {
        const selectedIds = Array.from(selectedToDelete);
        const response = await fetch('/api/news', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idsToDelete: selectedIds }),
        });

        if (response.ok) {
            const remainingNews = newsData.filter((_, index) => !selectedToDelete.has(index));
            setNewsData(remainingNews);
            setSelectedToDelete(new Set());
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

// News.jsx
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

            <button onClick={handleDeleteSelectedNews} className="delete-button">
                Kiválasztott hírek törlése
            </button>

            <div className="pagination flex justify-center mt-8">
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
