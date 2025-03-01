"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import EditUsersForm from "./EditUsersForm";
import AddUsersForm from "./AddUsersForm";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/getusers");
            setUsers(response.data);
        } catch (error) {
            console.error("Hiba a felhasználók lekérésekor:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
    };

    const handleSave = async (updatedUser) => {
        try {
            await axios.put(`/api/updateusers/${updatedUser._id}`, updatedUser);
            fetchUsers();
        } catch (error) {
            console.error("Hiba a felhasználó frissítésekor:", error);
        } finally {
            setSelectedUser(null);
        }
    };

    const handleDelete = async (userId) => {
        if (!userId) {
            console.error("Hiba: userId nincs megadva");
            return;
        }

        try {
            await axios.delete(`/api/deleteusers?userId=${userId}`);
            fetchUsers();
        } catch (error) {
            console.error("Hiba a felhasználó törlésekor:", error);
        }
    };

    const handleAddUser = async (newUser) => {
        try {
            await axios.post("/api/adduser", newUser);
            fetchUsers();
        } catch (error) {
            console.error("Hiba a felhasználó hozzáadásakor:", error);
        } finally {
            setShowAddUserForm(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-4xl font-bold text-accent mb-6">Jogosultságok kezelése</h2>

            {loading ? (
                <p className="text-center text-accent">Betöltés...</p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-bg table-auto">
                        <thead>
                            <tr className="bg-sndbg">
                                {["Felhasználónév", "Teljes Név", "E-mail", "Telefon", "Jogosultság", "Szerkesztés", "Törlés"].map((col) => (
                                    <th key={col} className="p-3 text-left text-accent font-semibold">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b hover:bg-sndbg/50 transition-all">
                                    <td className="p-3">{user.username}</td>
                                    <td className="p-3">{user.fullname}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.tel}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="bg-accent/70 text-white px-4 py-2 rounded-md hover:bg-accent transition-all"
                                        >
                                            Szerkesztés
                                        </button>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all"
                                        >
                                            Törlés
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => setShowAddUserForm(true)}
                    className="bg-accent/70 text-white px-6 py-3 rounded-md hover:bg-accent transition-all"
                >
                    Felhasználó hozzáadása
                </button>
            </div>

            {selectedUser && (
                <EditUsersForm user={selectedUser} onClose={() => setSelectedUser(null)} onSave={handleSave} />
            )}

            {showAddUserForm && (
                <AddUsersForm
                    user={{ username: "", password: "", email: "", tel: "", role: "" }}
                    onClose={() => setShowAddUserForm(false)}
                    onSave={handleAddUser}
                />
            )}
        </div>
    );
};

export default AdminUsers;
