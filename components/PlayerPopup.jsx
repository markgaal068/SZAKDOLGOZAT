import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const STAT_LABELS = [
    { key: "merkozes", label: "Mérkőzés" },
    { key: "gy", label: "Győzelem" },
    { key: "d", label: "Döntetlen" },
    { key: "v", label: "Vereség" },
    { key: "lott_gol", label: "Lőtt gól" },
    { key: "sarga_lap", label: "Sárga lap" },
    { key: "ket_perc", label: "2 perc" },
    { key: "kizaras", label: "Kiállítás" },
    { key: "kizar_feljelentes", label: "Kiállítás jelentéssel" },
    { key: "hetmeteres", label: "7 méteres" },
    { key: "hetmeteres_gol", label: "7 méteres gól" },
];

export default function PlayerPopup({ player, closePopup }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const hasStats = player.stats && Object.values(player.stats).some((v) => v !== "" && v != null);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center p-4 z-50"
            onClick={closePopup}
        >
            <div
                className="bg-sndbg rounded-3xl shadow-xl w-full max-w-2xl relative flex flex-col sm:flex-row overflow-hidden"
                style={{ maxHeight: "85vh" }}
                onClick={(e) => e.stopPropagation()}
            >
                <Button
                    onClick={closePopup}
                    className="absolute top-4 right-4 z-10 text-accent bg-transparent hover:bg-accent hover:text-sndbg transition-all rounded-full p-2 border-none"
                >
                    ✕
                </Button>

                {/* Bal oldal: MKSZ fénykép (nagy, álló téglalap) + név */}
                <div className="sm:w-2/5 flex flex-col items-center justify-center bg-bg p-6 gap-4 text-center">
                    {player.image_link ? (
                        <img
                            src={player.image_link}
                            alt={`${player.last_name} ${player.first_name}`}
                            className="w-full max-w-[220px] aspect-[3/4] object-cover rounded-2xl shadow-lg"
                        />
                    ) : (
                        <div className="w-full max-w-[220px] aspect-[3/4] rounded-2xl bg-sndbg" />
                    )}
                    <div>
                        <p className="font-sport font-bold text-2xl xl:text-3xl uppercase tracking-wide leading-none text-accent">
                            {player.last_name}
                        </p>
                        <p className="font-sport font-bold text-xl xl:text-2xl uppercase tracking-wide leading-none text-white mt-1">
                            {player.first_name}
                        </p>
                        {player.position && <p className="text-sm text-gray-400 mt-2">{player.position}</p>}
                    </div>
                </div>

                {/* Jobb oldal: versenyengedély statisztikák */}
                <div className="sm:w-3/5 p-6 overflow-y-auto text-white">
                    <h4 className="text-lg font-semibold text-accent mb-4">Versenyengedély statisztika</h4>
                    {hasStats ? (
                        <ul className="space-y-2">
                            {STAT_LABELS.map(({ key, label }) => (
                                <li key={key} className="flex justify-between border-b border-white/10 pb-1">
                                    <span className="text-gray-300">{label}</span>
                                    <span className="font-semibold">{player.stats[key] || "0"}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">Erre a játékosra egyelőre nincs elérhető statisztika.</p>
                    )}

                    {player.profile_link && (
                        <a
                            href={player.profile_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-6 text-sm text-accent hover:underline"
                        >
                            MKSZ profil megnyitása →
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
