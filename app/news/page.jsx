"use client";

import { useState, useEffect, useMemo } from "react";
import NewsItem from "@/components/NewsItem";
import Popup from "@/components/Popup";
import { Input } from "@/components/ui/input";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function News() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedNews, setSelectedNews] = useState(null);
    const [newsData, setNewsData] = useState([]);
    const [selectedToDelete, setSelectedToDelete] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState("all");

    const newsPerPage = 9;

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('/api/news');
                const data = await response.json();
                // Valódi dátum szerinti rendezés - a beszúrási sorrendre (reverse)
                // nem lehet hagyatkozni, pl. utólag feltöltött régebbi hírnél téves lenne.
                const sorted = [...data].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setNewsData(sorted);
            } catch (error) {
                console.error('Hiba történt a hírek betöltésekor:', error);
            }
        };

        fetchNews();
    }, []);

    // Elérhető évek a szűrőhöz, a meglévő createdAt mezőből számolva
    const years = useMemo(() => {
        const set = new Set(
            newsData
                .map((news) => news.createdAt && new Date(news.createdAt).getFullYear())
                .filter(Boolean)
        );
        return Array.from(set).sort((a, b) => b - a);
    }, [newsData]);

    const filteredNews = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return newsData.filter((news) => {
            const matchesSearch =
                !term ||
                news.title?.toLowerCase().includes(term) ||
                news.description?.toLowerCase().includes(term);
            const matchesYear =
                selectedYear === "all" ||
                (news.createdAt && new Date(news.createdAt).getFullYear() === Number(selectedYear));
            return matchesSearch && matchesYear;
        });
    }, [newsData, searchTerm, selectedYear]);

    // Ha módosul a szűrés, ugorjunk vissza az első oldalra
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedYear]);

    const isFiltering = searchTerm.trim() !== "" || selectedYear !== "all";

    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);
    const totalPages = Math.ceil(filteredNews.length / newsPerPage);

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
        <section className="min-h-screen">
            <div className="mx-4 xl:mx-16 pb-20">
                <div className="pt-12 pb-8">
                    <h2 className="text-3xl xl:text-5xl font-bold">Hírek</h2>
                    <p className="mt-2 text-gray-400">
                        Kövesd nyomon az Ácsi Kinizsi SC legfrissebb híreit.
                    </p>
                </div>

                {/* Szűrő sáv */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-10">
                    <div className="relative flex-1 max-w-md">
                        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Keresés a hírek között..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="all">Összes év</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                {filteredNews.length === 0 ? (
                    <p className="text-center text-gray-400 py-24">
                        {newsData.length === 0
                            ? "Jelenleg nincs elérhető hír."
                            : "Nincs a keresésnek megfelelő hír."}
                    </p>
                ) : (
                    <div className="news-container grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {currentNews.map((news, index) => (
                            <NewsItem
                                key={news._id ?? index}
                                news={news}
                                index={index}
                                featured={currentPage === 1 && index === 0 && !isFiltering}
                                toggleSelectNews={toggleSelectNews}
                                openPopup={openPopup}
                                selectedToDelete={selectedToDelete}
                            />
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="pagination flex justify-center items-center mt-12 gap-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Előző oldal"
                            className="p-2 rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                            <FiChevronLeft size={20} />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => paginate(page)}
                                aria-current={page === currentPage ? "page" : undefined}
                                className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${page === currentPage
                                        ? "bg-accent text-bg"
                                        : "text-white hover:bg-white/10"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Következő oldal"
                            className="p-2 rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                        >
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                )}

                {selectedNews && <Popup news={selectedNews} closePopup={closePopup} />}
            </div>
        </section>
    );
}
