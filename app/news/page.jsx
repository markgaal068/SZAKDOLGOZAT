"use client";

import { useState, useEffect } from "react";
import NewsItem from "@/components/NewsItem";
import Popup from "@/components/Popup";
import { Button } from "@/components/ui/button";

export default function News() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNews, setSelectedNews] = useState(null);
    const [newsData, setNewsData] = useState([]);
    const [selectedToDelete, setSelectedToDelete] = useState(new Set());

    const newsPerPage = 8;

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

    return (
        <section>
            <div className="mx-4 xl:mx-16">
                <h2 className="heading text-center text-3xl xl:text-6xl font-bold mb-12 mt-12">Hírek</h2>

                <div className="news-container grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {currentNews.map((news, index) => (
                        <NewsItem
                            key={index}
                            news={news}
                            index={index}
                            toggleSelectNews={toggleSelectNews}
                            openPopup={openPopup}
                            selectedToDelete={selectedToDelete}
                        />
                    ))}
                </div>

                <div className="pagination flex justify-center mb-2 gap-1">
                    {Array.from({ length: totalPages }, (_, index) => (
                        index + 1 === currentPage ? (
                            <Button key={index} className="bg-accent text-white" disabled>
                                {index + 1}
                            </Button>
                        ) : (
                            <button key={index} onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        )
                    ))}
                </div>

                {selectedNews && <Popup news={selectedNews} closePopup={closePopup} />}
            </div>
        </section>
    );
}
