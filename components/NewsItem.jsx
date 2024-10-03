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
        <div className="rounded-[40px] bg-sndbg border border-bg p-6 flex flex-col items-center hover:border-accent border-2 xl:gap-10 m-5">
            <h3 className="text-xl font-semibold text-center">{news.title}</h3>
            <p className="text-center mb-4">{news.description}</p>
            {isCodeCorrect && (
                <input
                    type="checkbox"
                    checked={selectedToDelete.has(index)}
                    onChange={() => toggleSelectNews(index)}
                />
            )}
            <Button onClick={() => openPopup(news)}>
                További információk
            </Button>
        </div>
    );
}
