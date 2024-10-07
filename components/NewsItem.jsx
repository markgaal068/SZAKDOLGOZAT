import { Button } from "@/components/ui/button";

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
            className={`rounded-[40px] border border-bg p-6 flex flex-col hover:border-accent border-2 xl:gap-10 m-5 h-[350px] ${!news.images || news.images.length === 0 ? 'bg-sndbg' : ''}`}
            style={{
                backgroundImage: news.images && news.images.length > 0 ? `url(${news.images[0]})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'auto',
                color: 'white', 
            }}
        >
            <div className="bg-sndbg rounded-full p-4 w-full mb-4 flex flex-col">
                <h3 className="text-xl font-semibold text-center">{news.title}</h3>
                <p className="text-center mb-2">{news.description}</p>
            </div>
            <div className="flex-grow" /> 
            {isCodeCorrect && (
                <input
                    type="checkbox"
                    checked={selectedToDelete.has(index)}
                    onChange={() => toggleSelectNews(index)}
                />
            )}
            <Button onClick={() => openPopup(news)} className="mt-4">
                További információk
            </Button>
        </div>
    );
}
