"use client";

// Kimenet/eredmény szerinti színkódolás - győzelem zöld, döntetlen sárga,
// vereség piros, jövőbeli (még nincs eredmény) semleges szürkés-kék.
function outcomeStyles(outcome) {
    switch (outcome) {
        case "win":
            return { bar: "bg-emerald-500", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" };
        case "loss":
            return { bar: "bg-red-500", badge: "bg-red-500/15 text-red-400 border-red-500/30" };
        case "draw":
            return { bar: "bg-amber-500", badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" };
        default:
            return { bar: "bg-sky-500", badge: "bg-sky-500/15 text-sky-300 border-sky-500/30" };
    }
}

function splitDate(dateText) {
    const [datePart, timePart] = (dateText || "").split(" ");
    return { datePart: datePart?.replace(/\.$/, "") || "", timePart: timePart || "" };
}

function MatchCard({ match }) {
    const { bar, badge } = outcomeStyles(match.outcome);
    const { datePart, timePart } = splitDate(match.date);

    return (
        <div className="relative flex items-center gap-3 rounded-xl bg-sndbg pl-4 pr-3 py-3 overflow-hidden">
            <span className={`absolute left-0 top-0 h-full w-1.5 ${bar}`} />
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-white truncate">
                    {match.isHome ? "vs" : "@"} {match.opponent}
                </p>
                <p className="text-xs text-gray-400 truncate">
                    {match.venue}
                    {match.venue && " · "}
                    {datePart} {timePart}
                </p>
            </div>
            {match.played ? (
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${badge}`}>
                    {match.result}
                </span>
            ) : (
                <span className="shrink-0 text-accent text-sm font-semibold">{timePart}</span>
            )}
        </div>
    );
}

// Ha van még hátralévő meccs: a legutóbbi lejátszott + a következő 4.
// Ha a szezon lezárult (nincs hátra semmi): az utolsó 5 lejátszott meccs.
export function TeamSchedule({ matches }) {
    if (!matches || matches.length === 0) return null;

    const played = matches.filter((m) => m.played);
    const upcoming = matches.filter((m) => !m.played);
    const hasUpcoming = upcoming.length > 0;

    const toShow = hasUpcoming
        ? [...(played.length ? [played[played.length - 1]] : []), ...upcoming.slice(0, 4)]
        : [...played].reverse().slice(0, 5);

    if (toShow.length === 0) return null;

    return (
        <div>
            <h3 className="text-xl font-semibold text-white mb-4">
                {hasUpcoming ? "Legutóbbi és következő mérkőzések" : "Utolsó mérkőzések"}
            </h3>
            <div className="flex flex-col gap-3">
                {toShow.map((match, index) => (
                    <MatchCard key={index} match={match} />
                ))}
            </div>
        </div>
    );
}

export function TeamTopScorers({ rows }) {
    if (!rows || rows.length === 0) return null;

    return (
        <div>
            <h3 className="text-xl font-semibold text-white mb-4">
                Házi <span className="text-accent">góllövőlista</span>
            </h3>
            <div className="rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-green-600 text-white">
                            <th className="py-2 px-3 text-left">Hely</th>
                            <th className="py-2 px-3 text-left">Név</th>
                            <th className="py-2 px-3 text-right">Gól</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="border-t border-white/5 hover:bg-accent/10 bg-sndbg">
                                <td className="py-2 px-3">{row[0]}</td>
                                <td className="py-2 px-3">{row[1]}</td>
                                <td className="py-2 px-3 text-right font-semibold">{row[3]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
