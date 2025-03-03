import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const months = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];

const teams = {
    "Férfi Felnőtt": "/teamdatas/kezilabda/ffifelnott/mkszffifelnottjatekosok.json",
    "Női Felnőtt": "/teamdatas/kezilabda/noifelnott/mksznoifelnottjatekosok.json",
    "Leány Ifi": "/teamdatas/kezilabda/leanyifi/mkszleanyifijatekosok.json",
    "Leány Serdülő": "/teamdatas/kezilabda/leanyseri/mkszleanyserijatekosok.json"
};

export default function TrainingAttendance() {
    const { data: session } = useSession();
    const [players, setPlayers] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("Férfi Felnőtt");
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [columns, setColumns] = useState(Array.from({ length: 20 }, (_, i) => `2025-${String(currentMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`));
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

    const handleAttendanceChange = (player, column, value) => {
        setAttendance(prev => ({
            ...prev,
            [currentMonth]: {
                ...prev[currentMonth],
                [player]: {
                    ...(prev[currentMonth]?.[player] || {}),
                    [column]: value
                }
            }
        }));
    };

    const handleKmChange = (player, value) => {
        if (isAdmin) {
            setAttendance(prev => ({
                ...prev,
                [currentMonth]: {
                    ...prev[currentMonth],
                    [player]: {
                        ...(prev[currentMonth]?.[player] || {}),
                        ["megtett_km"]: value
                    }
                }
            }));
        }
    };

    const calculateFizetendo = (player, km) => {
        const megtekettKm = km || 0;
        const autoEdzesek = columns.reduce((acc, column) => {
            if (attendance[currentMonth]?.[player]?.[column] === "auto") {
                return acc + 1;
            }
            return acc;
        }, 0);

        const totalFizetendo = (megtekettKm / 100 * fogyasztás * hatóságiÁr) + (megtekettKm * kopásDíj);
        return (totalFizetendo * autoEdzesek).toFixed(2);
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
                                <Input type="number" placeholder="Hatósági ár" value={hatóságiÁr} onChange={(e) => setHatóságiÁr(e.target.value)} className="w-full" />
                                <Input type="number" placeholder="Kopás díj" value={kopásDíj} onChange={(e) => setKopásDíj(e.target.value)} className="w-full" />
                                <Input type="number" placeholder="Fogyasztás" value={fogyasztás} onChange={(e) => setFogyasztás(e.target.value)} className="w-full" />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between items-center mb-6">
                        <Button onClick={() => setCurrentMonth(prev => (prev > 0 ? prev - 1 : 11))}>Előző hónap</Button>
                        <span className="text-xl font-semibold">{months[currentMonth]}</span>
                        <Button onClick={() => setCurrentMonth(prev => (prev < 11 ? prev + 1 : 0))}>Következő hónap</Button>
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
                                        <Input type="number" value={attendance[currentMonth]?.[`${player.last_name}-${player.first_name}`]?.["megtett_km"] || ""} 
                                            onChange={(e) => handleKmChange(`${player.last_name}-${player.first_name}`, e.target.value)} 
                                            className="text-accent w-[120px]" />
                                    </TableCell>
                                    <TableCell>
                                        {calculateFizetendo(`${player.last_name}-${player.first_name}`, attendance[currentMonth]?.[`${player.last_name}-${player.first_name}`]?.["megtett_km"])} Ft
                                    </TableCell>
                                    {columns.map((col, index) => (
                                        <TableCell key={index} className="text-accent w-[120px]">
                                            <Select value={attendance[currentMonth]?.[`${player.last_name}-${player.first_name}`]?.[col] || "default"} 
                                                onValueChange={(value) => handleAttendanceChange(`${player.last_name}-${player.first_name}`, col, value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Mivel érkezett?" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="vonat">Vonat</SelectItem>
                                                    <SelectItem value="auto">Autó</SelectItem>
                                                    <SelectItem value="nem_jelent_meg">Nem jelent meg</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
    
}