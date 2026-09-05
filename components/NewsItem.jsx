import Image from "next/image";

export default function NewsItem({
    news,
    index,
    isCodeCorrect,
    toggleSelectNews,
    openPopup,
    selectedToDelete,
    featured = false,
}) {
    const handleClick = (e) => {
        // Ha a kattintás a checkboxra vagy a labelre történt, akkor ne nyíljon meg a popup
        if (e.target.closest(".no-popup")) {
            e.stopPropagation();
            return;
        }
        openPopup(news);
    };

    const hasImage = news.images && news.images.length > 0;
    const formattedDate = news.createdAt
        ? new Date(news.createdAt).toLocaleDateString("hu-HU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
        : "";

    return (
        <div
            onClick={handleClick}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 ${featured
                    ? "sm:col-span-2 aspect-[16/10] sm:aspect-[21/9]"
                    : "aspect-[4/5]"
                }`}
        >
            {hasImage ? (
                <Image
                    src={news.images[0]}
                    alt={news.title}
                    fill
                    sizes={featured ? "(min-width: 640px) 66vw, 100vw" : "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-sndbg to-bg" />
            )}

            {/* Sötétedő átmenet, hogy a szöveg mindig olvasható maradjon a kép felett */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                {featured && (
                    <span className="inline-block mb-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-bg">
                        Legfrissebb
                    </span>
                )}
                <h3
                    className={`font-bold text-white leading-snug line-clamp-2 ${featured ? "text-2xl sm:text-3xl" : "text-lg"
                        }`}
                >
                    {news.title}
                </h3>
                {featured && news.description && (
                    <p className="mt-2 text-sm text-gray-300 line-clamp-2 max-w-2xl">
                        {news.description}
                    </p>
                )}
                <p className="mt-1 text-xs text-gray-400">{formattedDate}</p>
            </div>

            {/* Ha a kód helyes, megjelenik a törlés checkbox */}
            {isCodeCorrect && (
                <div className="no-popup absolute top-3 right-3 z-10 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white">
                    <input
                        type="checkbox"
                        checked={selectedToDelete.has(index)}
                        onChange={() => toggleSelectNews(index)}
                        className="no-popup cursor-pointer rounded-md"
                    />
                    <span className="no-popup cursor-pointer">Törlés kiválasztása</span>
                </div>
            )}
        </div>
    );
}
