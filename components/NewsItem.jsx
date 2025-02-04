export default function NewsItem({
    news,
    index,
    isCodeCorrect,
    toggleSelectNews,
    openPopup,
    selectedToDelete,
}) {
    return (
        <div
            className="relative rounded-[40px] p-6 flex flex-col m-5 h-[350px] transition-transform duration-500 ease-in-out transform hover:scale-105 cursor-pointer"
            style={{
                background: "linear-gradient(to right, #3cba54, #323946)",
                backgroundSize: "200% 100%", // Kétszer akkora háttér, hogy el lehessen tolni
                backgroundPosition: "100% 0%", // Alapból a sötét domináljon
                transition: "background-position 1s ease-in-out", // Lágy animáció
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundPosition = "0% 0%"; // Hoverre a zöld feltölti a hátteret
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundPosition = "100% 0%"; // Visszaáll az eredeti állapotra
            }}
            onClick={() => openPopup(news)}
        >
            {/* Középre igazított tartalom */}
            <div className="relative z-10 flex flex-col justify-center items-center p-4 w-full h-full text-center space-y-4">
                <h3 className="text-4xl font-semibold text-white">{news.title}</h3>
                <p className="text-lg text-white opacity-90">{news.description}</p>
            </div>

            {/* Ha a kód helyes, megjelenik a törlés checkbox */}
            {isCodeCorrect && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center text-white text-sm space-x-2">
                    <input
                        type="checkbox"
                        checked={selectedToDelete.has(index)}
                        onChange={() => toggleSelectNews(index)}
                        className="text-accent bg-bg accent-accent rounded-full"
                    />
                    <span>Törlés kiválasztása</span>
                </div>
            )}
        </div>
    );
}
