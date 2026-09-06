"use client";

import { useState, useEffect } from "react";
import { fileToCompressedDataUrl } from "@/lib/image";

const TEAMS = [
    { value: "ffifelnott", label: "Férfi felnőtt" },
    { value: "noifelnott", label: "Női felnőtt" },
    { value: "leanyseri", label: "Leány serdülő" },
];

const emptyForm = { first_name: "", last_name: "", position: "", profile_link: "" };

const AdminPlayers = () => {
    const [team, setTeam] = useState("ffifelnott");
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const [editingId, setEditingId] = useState(null); // null = nincs form nyitva, "new" = új felvitel
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPlayers();
    }, [team]);

    const fetchPlayers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/players?team=${team}`);
            const data = await response.json();
            setPlayers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Hiba a játékosok lekérdezésekor:", error);
        } finally {
            setLoading(false);
        }
    };

    const openAddForm = () => {
        setForm(emptyForm);
        setImageFile(null);
        setImagePreview("");
        setErrorMessage(null);
        setEditingId("new");
    };

    const openEditForm = (player) => {
        setForm({
            first_name: player.first_name || "",
            last_name: player.last_name || "",
            position: player.position || "",
            profile_link: player.profile_link || "",
        });
        setImageFile(null);
        setImagePreview(player.image_link || "");
        setErrorMessage(null);
        setEditingId(player._id);
    };

    const closeForm = () => {
        setEditingId(null);
        setImageFile(null);
        setImagePreview("");
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(await fileToCompressedDataUrl(file));
    };

    const handleSubmit = async () => {
        if (!form.last_name.trim()) {
            setErrorMessage("A vezetéknév megadása kötelező.");
            return;
        }

        setSaving(true);
        setErrorMessage(null);

        try {
            const image_link = imageFile ? await fileToCompressedDataUrl(imageFile) : imagePreview;

            if (editingId === "new") {
                const response = await fetch("/api/addplayer", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ team, ...form, image_link }),
                });
                if (!response.ok) throw new Error((await response.json()).error || "Hiba történt a mentés során.");
            } else {
                const response = await fetch("/api/editplayer", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: editingId, ...form, image_link }),
                });
                if (!response.ok) throw new Error((await response.json()).error || "Hiba történt a mentés során.");
            }

            closeForm();
            fetchPlayers();
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch("/api/deleteplayer", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (response.ok) fetchPlayers();
        } catch (error) {
            console.error("Hiba a játékos törlésekor:", error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold text-center mb-6">
                <span className="text-accent">Játékoskeret</span> Kezelése
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <select
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900"
                >
                    {TEAMS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>

                <button
                    onClick={openAddForm}
                    className="px-4 py-2 rounded-md bg-accent text-white hover:bg-accent/80 transition-colors"
                >
                    + Új játékos
                </button>
            </div>

            {loading ? (
                <p className="text-center text-accent">Betöltés...</p>
            ) : players.length === 0 ? (
                <p className="text-center text-gray-400">Ehhez a csapathoz még nincs felvitt játékos.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {players.map((player) => (
                        <div key={player._id} className="rounded-xl bg-sndbg p-4 text-center shadow-md">
                            {player.image_link ? (
                                <img
                                    src={player.image_link}
                                    alt={`${player.first_name} ${player.last_name}`}
                                    className="w-20 h-20 object-cover rounded-full mx-auto mb-3"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-bg" />
                            )}
                            <h3 className="font-bold uppercase text-white">{player.last_name}</h3>
                            <p className="text-sm text-white/80">{player.first_name}</p>
                            <p className="text-xs text-accent mb-3">{player.position}</p>
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => openEditForm(player)}
                                    className="px-3 py-1 text-xs rounded bg-accent/70 hover:bg-accent text-white"
                                >
                                    Szerkesztés
                                </button>
                                <button
                                    onClick={() => handleDelete(player._id)}
                                    className="px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-500 text-white"
                                >
                                    Törlés
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editingId && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-sndbg p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-accent">
                            {editingId === "new" ? "Új játékos" : "Játékos szerkesztése"}
                        </h3>

                        {errorMessage && (
                            <p className="text-red-400 bg-red-950/40 border border-red-500/40 rounded-lg py-2 px-3 mb-3 text-sm">
                                {errorMessage}
                            </p>
                        )}

                        <div className="flex items-center gap-4 mb-3">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Előnézet" className="w-16 h-16 object-cover rounded-full" />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-bg" />
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="text-white text-sm" />
                        </div>

                        <input
                            type="text"
                            placeholder="Vezetéknév"
                            value={form.last_name}
                            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                            className="w-full p-2 border rounded mb-2 text-accent"
                        />
                        <input
                            type="text"
                            placeholder="Keresztnév"
                            value={form.first_name}
                            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                            className="w-full p-2 border rounded mb-2 text-accent"
                        />
                        <input
                            type="text"
                            placeholder="Pozíció (pl. Kapus, Átlövő, Vezetőedző)"
                            value={form.position}
                            onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                            className="w-full p-2 border rounded mb-2 text-accent"
                        />
                        <input
                            type="text"
                            placeholder="MKSZ profil link (nem kötelező)"
                            value={form.profile_link}
                            onChange={(e) => setForm((f) => ({ ...f, profile_link: e.target.value }))}
                            className="w-full p-2 border rounded mb-2 text-accent"
                        />

                        <div className="flex justify-end mt-4 gap-2">
                            <button onClick={closeForm} className="px-4 py-2 bg-gray-500 text-white rounded">
                                Mégse
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="px-4 py-2 bg-accent text-white rounded disabled:opacity-50"
                            >
                                {saving ? "Mentés..." : "Mentés"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPlayers;
