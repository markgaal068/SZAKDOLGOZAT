export default function NewsItem({
    news,
    index,
    isCodeCorrect,
    toggleSelectNews,
    openPopup,
    selectedToDelete,
}) {
    const handleClick = (e) => {
        // Ha a kattintás a checkboxra vagy a labelre történt, akkor ne nyíljon meg a popup
        if (e.target.closest(".no-popup")) {
            e.stopPropagation();
            return;
        }
        openPopup(news);
    };

    return (
        <div
            className="relative rounded-[40px] p-6 flex flex-col m-5 h-[350px] transition-transform duration-300 ease-in-out transform hover:scale-[1.03] cursor-pointer"
            style={{
                background: "linear-gradient(to right, #3cba54, #323946)",
                backgroundSize: "200% 100%",
                backgroundPosition: "100% 0%",
                transition: "background-position 0.8s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = "0% 0%")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = "100% 0%")}
            onClick={handleClick} // Kattintási eseményt kezelő függvény
        >
            {/* Középre igazított tartalom */}
            <div className="relative z-10 flex flex-col justify-center items-center p-4 w-full h-full text-center space-y-4">
                <h3 className="text-4xl font-semibold text-white">{news.title}</h3>
                <p className="text-lg text-white opacity-90">{news.description}</p>
            </div>

            {/* Ha a kód helyes, megjelenik a törlés checkbox */}
            {isCodeCorrect && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center text-white text-sm space-x-2 z-50">
                    <input
                        type="checkbox"
                        checked={selectedToDelete.has(index)}
                        onChange={(e) => {
                            toggleSelectNews(index);
                        }}
                        className="no-popup cursor-pointer rounded-md"
                    />
                    <span className="no-popup cursor-pointer">Törlés kiválasztása</span>
                </div>
            )}
        </div>
    );
}
