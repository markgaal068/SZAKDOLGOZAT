import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PDFDownload from "@/components/PDFdownloadAttendance";

const months = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];

const teams = {
    "Kézilabda - Férfi Felnőtt": "/teamdatas/kezilabda/ffifelnott/mkszffifelnottjatekosok.json",
    "Kézilabda - Női Felnőtt": "/teamdatas/kezilabda/noifelnott/mksznoifelnottjatekosok.json",
    "Kézilabda - Leány Ifi": "/teamdatas/kezilabda/leanyifi/mkszleanyifijatekosok.json",
    "Kézilabda - Leány Serdülő": "/teamdatas/kezilabda/leanyseri/mkszleanyserijatekosok.json"
};

// Segédfüggvény a hónap napjainak számának meghatározásához
const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

// Segédfüggvény az alapértelmezett napok (Kedd, Csütörtök, Péntek, Szombat) meghatározásához
const getDefaultDays = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const defaultDays = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay(); // 0 (vasárnap) - 6 (szombat)
        if (dayOfWeek === 2 || dayOfWeek === 4 || dayOfWeek === 5 || dayOfWeek === 6) { // Kedd, Csütörtök, Péntek, Szombat
            defaultDays.push(date.toISOString().split('T')[0]);
        }
    }

    return defaultDays;
};

export default function TrainingAttendance() {
    const { data: session } = useSession();
    const [players, setPlayers] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("Kézilabda - Férfi Felnőtt");
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [columns, setColumns] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [hatóságiÁr, setHatóságiÁr] = useState("");
    const [kopásDíj, setKopásDíj] = useState("");
    const [fogyasztás, setFogyasztás] = useState("");

    const isAdmin = session?.user?.role === "Adminisztrátor";

    useEffect(() => {
        fetch(teams[selectedTeam])
            .then(res => res.json())
            .then(data => setPlayers(data.players || data || []))
            .catch(err => console.error("Fetch error:", err));
    }, [selectedTeam]);

    useEffect(() => {
        const fetchAttendance = async () => {
            const res = await fetch(`/api/attendance?team=${selectedTeam}&month=${currentMonth}`);
            const data = await res.json();

            const year = new Date().getFullYear();
            const defaultDays = getDefaultDays(year, currentMonth);

            if (data && Object.keys(data).length !== 0) {
                setAttendance(data.attendance || {});
                setHatóságiÁr(data.hatóságiÁr || "");
                setKopásDíj(data.kopásDíj || "");
                setFogyasztás(data.fogyasztás || "");
                setColumns(data.columns || defaultDays); // Ha nincsenek mentett napok, akkor alapértelmezett napok
            } else {
                setAttendance({});
                setHatóságiÁr("");
                setKopásDíj("");
                setFogyasztás("");
                setColumns(defaultDays); // Alapértelmezett napok
            }
        };
        fetchAttendance();
    }, [selectedTeam, currentMonth]);

    const handleAttendanceChange = (player, column, value) => {
        const newAttendance = {
            ...attendance,
            [player]: {
                ...(attendance[player] || {}),
                [column]: value
            }
        };
        setAttendance(newAttendance);
    };

    const handleKmChange = (player, value) => {
        if (isAdmin) {
            const newAttendance = {
                ...attendance,
                [player]: {
                    ...(attendance[player] || {}),
                    ["megtett_km"]: value
                }
            };
            setAttendance(newAttendance);
        }
    };

    const saveAttendance = async () => {
        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    attendance,
                    currentMonth,
                    selectedTeam,
                    hatóságiÁr,
                    kopásDíj,
                    fogyasztás,
                    columns // Mentjük a kiválasztott napokat is
                }),
            });
            if (res.ok) {
                alert("Adatok sikeresen mentve!");
            } else {
                alert("Hiba történt a mentés során.");
            }
        } catch (error) {
            console.error("Hiba:", error);
            alert("Hiba történt a mentés során.");
        }
    };

    const deleteAttendance = async () => {
        try {
            const res = await fetch('/api/attendance', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ team: selectedTeam, month: currentMonth }),
            });
            if (res.ok) {
                setAttendance({});
                setHatóságiÁr("");
                setKopásDíj("");
                setFogyasztás("");
                const year = new Date().getFullYear();
                setColumns(getDefaultDays(year, currentMonth)); // Visszaállítjuk az alapértelmezett napokra
                alert("Adatok sikeresen törölve!");
            } else {
                alert("Hiba történt a törlés során.");
            }
        } catch (error) {
            console.error("Hiba:", error);
            alert("Hiba történt a törlés során.");
        }
    };

    const calculateFizetendo = (player, km) => {
        const megtettKm = km || 0;
        const autoEdzesek = columns.reduce((acc, column) => {
            if (attendance[player]?.[column] === "auto") {
                return acc + 1;
            }
            return acc;
        }, 0);
        const vonatEdzesek = columns.reduce((bcc, column) => {
            if (attendance[player]?.[column] === "vonat") {
                return bcc + 1;
            }
            return bcc
        }, 0);
        const totalFizetendo = (megtettKm / 100 * fogyasztás * hatóságiÁr) + (megtettKm * kopásDíj);
        const vonatFizetendo = (megtettKm * 15)
        return (totalFizetendo * autoEdzesek + vonatFizetendo * vonatEdzesek).toFixed(2);
    };

    return (
        <div className="min-h-screen bg-bg p-4">
            <div className="mx-auto w-[80vw]">
                <div className="bg-sndbg shadow-lg rounded-lg p-6 mb-6 w-full">
                    <div className="flex flex-col md:flex-row gap-4 mb-6 text-accent w-full">
                        <Select onValueChange={setSelectedTeam} defaultValue={selectedTeam} className="w-full md:w-1/3">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Válassz csapatot" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(teams).map(team => (
                                    <SelectItem key={team} value={team}>{team}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isAdmin && (
                            <div className="flex flex-col md:flex-row gap-4 w-full text-accent">
                                <Input
                                    type="number"
                                    placeholder="Hatósági ár"
                                    value={hatóságiÁr}
                                    onChange={(e) => setHatóságiÁr(e.target.value)}
                                    className="w-full"
                                />
                                <Input
                                    type="number"
                                    placeholder="Kopás díj"
                                    value={kopásDíj}
                                    onChange={(e) => setKopásDíj(e.target.value)}
                                    className="w-full"
                                />
                                <Input
                                    type="number"
                                    placeholder="Fogyasztás"
                                    value={fogyasztás}
                                    onChange={(e) => setFogyasztás(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => setCurrentMonth(prev => (prev > 0 ? prev - 1 : 11))} className="px-4 py-2 rounded transition-all bg-accent/70 text-white hover:bg-accent">Előző hónap</button>
                        <span className="text-xl font-semibold">{months[currentMonth]}</span>
                        <button onClick={() => setCurrentMonth(prev => (prev < 11 ? prev + 1 : 0))} className="px-4 py-2 rounded transition-all bg-accent/70 text-white hover:bg-accent">Következő hónap</button>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={saveAttendance} className="px-4 py-2 rounded transition-all bg-accent/70 text-white hover:bg-accent">Mentés</button>
                        <button onClick={deleteAttendance} className="px-4 py-2 rounded transition-all bg-accent/70 text-white hover:bg-accent" variant="destructive" disabled>Visszaállítás</button>
                    </div>
                </div>

                <div className="bg-sndbg shadow-lg rounded-lg overflow-x-auto w-[80vw]">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Név</TableHead>
                                <TableHead>Poszt</TableHead>
                                <TableHead>Megtett km</TableHead>
                                <TableHead>Fizetendő</TableHead>
                                {columns.map((col, index) => (
                                    <TableHead key={index}>
                                        <Input type="date" value={col} onChange={(e) => {
                                            const newColumns = [...columns];
                                            newColumns[index] = e.target.value;
                                            setColumns(newColumns);
                                        }} />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players.map(player => (
                                <TableRow key={`${player.last_name}-${player.first_name}`}>
                                    <TableCell>{player.last_name} {player.first_name}</TableCell>
                                    <TableCell>{player.position}</TableCell>
                                    <TableCell>
                                        <Input type="number" value={attendance[`${player.last_name}-${player.first_name}`]?.["megtett_km"] || ""}
                                            onChange={(e) => handleKmChange(`${player.last_name}-${player.first_name}`, e.target.value)}
                                            className="text-accent w-[120px]" />
                                    </TableCell>
                                    <TableCell>
                                        {calculateFizetendo(`${player.last_name}-${player.first_name}`, attendance[`${player.last_name}-${player.first_name}`]?.["megtett_km"])} Ft
                                    </TableCell>
                                    {columns.map((col, index) => (
                                        <TableCell key={index} className="text-accent w-[120px]">
                                            <Select
                                                value={attendance[`${player.last_name}-${player.first_name}`]?.[col] || "tbd"}
                                                onValueChange={(value) => handleAttendanceChange(`${player.last_name}-${player.first_name}`, col, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Mivel érkezett?" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="vonat">Vonat</SelectItem>
                                                    <SelectItem value="auto">Autó</SelectItem>
                                                    <SelectItem value="nem_jelent_meg">Nem jelent meg</SelectItem>
                                                    <SelectItem value="nem_jar_tamogatas">Nem jár támogatás</SelectItem>
                                                    <SelectItem value="nem_volt_edzes">Nem volt edzés</SelectItem>
                                                    <SelectItem value="tbd">TBD</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <PDFDownload
                    players={players}
                    attendance={attendance}
                    columns={columns}
                    currentMonth={currentMonth}
                    hatóságiÁr={hatóságiÁr}
                    kopásDíj={kopásDíj}
                    fogyasztás={fogyasztás}
                    teamName={selectedTeam}
                />
            </div>
        </div>
    );
}