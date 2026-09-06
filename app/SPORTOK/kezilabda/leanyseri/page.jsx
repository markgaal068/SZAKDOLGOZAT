"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PlayerPopup from '@/components/PlayerPopup';
import { TeamSchedule, TeamTopScorers } from '@/components/TeamMatchesPanel';
import { isKinizsiTeam } from '@/lib/utils';

const TEAM_ID = 'leanyseri';

export default function TablePage() {
    const [tableData, setTableData] = useState([]);
    const [playersData, setPlayersData] = useState([]);
    const [topScorers, setTopScorers] = useState([]);
    const [matches, setMatches] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    useEffect(() => {
        async function fetchTableData() {
            const response = await fetch(`/teamdatas/kezilabda/${TEAM_ID}/mksz${TEAM_ID}.json`);
            const data = await response.json();
            setTableData(data.slice(1)); // Skip the header row
        }

        async function fetchPlayersData() {
            const response = await fetch(`/api/players?team=${TEAM_ID}`);
            const data = await response.json();
            setPlayersData(data);
        }

        async function fetchTopScorers() {
            try {
                const response = await fetch(`/teamdatas/kezilabda/${TEAM_ID}/mksz${TEAM_ID}gollovok.json`);
                if (!response.ok) return;
                const data = await response.json();
                setTopScorers(data.slice(1)); // Skip the header row
            } catch {
                // Ha még nincs lefuttatva az import script, egyszerűen nem jelenik meg a szekció.
            }
        }

        async function fetchMatches() {
            try {
                const response = await fetch(`/teamdatas/kezilabda/${TEAM_ID}/mksz${TEAM_ID}menetrend.json`);
                if (!response.ok) return;
                setMatches(await response.json());
            } catch {
                // Ha még nincs lefuttatva az import script, egyszerűen nem jelenik meg a szekció.
            }
        }

        fetchTableData();
        fetchPlayersData();
        fetchTopScorers();
        fetchMatches();
    }, []);

    return (
        <section className="px-6 py-4 max-w-full mx-auto overflow-x-auto">
            {/* Felnőtt Férfi Kézilabda Csapatunk Cím */}
            <motion.h2
                className="text-3xl font-semibold text-center mb-6 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                Leány Serdülő Kézilabda Csapatunk
            </motion.h2>

            {/* Táblázat animáció */}
            <motion.div
                className="overflow-x-auto mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-green-600 text-white">
                            <th className="py-3 px-4 text-left">Helyezés</th>
                            <th className="py-3 px-4 text-left">Csapat</th>
                            <th className="py-3 px-4 text-left">M</th>
                            <th className="py-3 px-4 text-left">GY</th>
                            <th className="py-3 px-4 text-left">D</th>
                            <th className="py-3 px-4 text-left">V</th>
                            <th className="py-3 px-4 text-left">LG</th>
                            <th className="py-3 px-4 text-left">KG</th>
                            <th className="py-3 px-4 text-left">GK</th>
                            <th className="py-3 px-4 text-left">P</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr
                                key={index}
                                className={`border-t hover:bg-accent/20 ${isKinizsiTeam(row[1]) ? 'bg-accent/10' : ''}`}
                            >
                                <td className="py-3 px-4 text-left">{row[0]}</td>
                                <td className="py-3 px-4 text-left">{row[1]}</td>
                                <td className="py-3 px-4 text-left">{row[2]}</td>
                                <td className="py-3 px-4 text-left">{row[3]}</td>
                                <td className="py-3 px-4 text-left">{row[4]}</td>
                                <td className="py-3 px-4 text-left">{row[5]}</td>
                                <td className="py-3 px-4 text-left">{row[6]}</td>
                                <td className="py-3 px-4 text-left">{row[7]}</td>
                                <td className="py-3 px-4 text-left">{row[8]}</td>
                                <td className="py-3 px-4 text-left">{row[9]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {(matches.length > 0 || topScorers.length > 0) && (
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <TeamSchedule matches={matches} />
                    <TeamTopScorers rows={topScorers} />
                </motion.div>
            )}

            <div className="mb-6">
                {/* Stáb és Játékosok Cím */}
                <motion.h2
                    className="text-3xl font-semibold text-center mb-4 text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    Stáb és Játékosok
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {playersData.map((player, index) => (
                        <motion.div
                            key={index}
                            onClick={() => setSelectedPlayer(player)}
                            className={`text-center p-6 rounded-lg shadow-lg transition-all transform hover:scale-105 cursor-pointer ${index % 2 === 0 ? 'bg-accent text-sndbg hover:text-accent hover:bg-sndbg' : 'bg-sndbg text-accent hover:text-sndbg hover:bg-accent'} h-72`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            <img
                                src={player.image_link}
                                alt={player.first_name + ' ' + player.last_name}
                                className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                            />
                            <h3 className="text-xl font-bold uppercase">{player.last_name}</h3>
                            <p className="text-md text-white font-semibold text-lg">{player.first_name}</p>
                            <p className="text-md text-white font-semibold">{player.position}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {selectedPlayer && (
                <PlayerPopup player={selectedPlayer} closePopup={() => setSelectedPlayer(null)} />
            )}
        </section>
    );
}
