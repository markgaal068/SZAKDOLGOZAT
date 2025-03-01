"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import EditUsersForm from "./EditUsersForm";
import AddUsersForm from "./AddUsersForm";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAddUserForm, setShowAddUserForm] = useState(false);

    useEffect(() => {
        axios.get("/api/getusers")
            .then(response => setUsers(response.data))
            .catch(error => console.error("Hiba a felhasználók lekérésekor:", error));
    }, []);

    const handleEdit = (user) => {
        setSelectedUser(user);
    };

    const handleSave = (updatedUser) => {
        setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
        setSelectedUser(null);
    };

    const handleDelete = (userId) => {
        console.log("userId:", userId);
        if (!userId) {
            console.error("Hiba: userId nincs megadva");
            return;
        }
    
        axios.delete(`/api/deleteusers?userId=${userId}`)
            .then(() => {
                setUsers(users.filter(user => user._id !== userId));
            })
            .catch(error => console.error("Hiba a felhasználó törlésekor:", error));
    };

    const handleAddUser = (newUser) => {
        setUsers([...users, newUser]);
        setShowAddUserForm(false);
    };

    return (
        <div className="p-6">
            <h2 className="text-4xl font-bold text-accent mb-6">Jogosultságok kezelése</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-bg table-auto">
                    <thead>
                        <tr>
                            <th className="p-3 text-left text-accent font-semibold">Felhasználónév</th>
                            <th className="p-3 text-left text-accent font-semibold">Teljes Név</th>
                            <th className="p-3 text-left text-accent font-semibold">E-mail</th>
                            <th className="p-3 text-left text-accent font-semibold">Telefon</th>
                            <th className="p-3 text-left text-accent font-semibold">Jogosultsági szint</th>
                            <th className="p-3 text-left text-accent font-semibold">Szerkesztés</th>
                            <th className="p-3 text-left text-accent font-semibold">Törlés</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b">
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

            <div className="mt-6 flex justify-end">
                <button
                    onClick={() => setShowAddUserForm(true)}
                    className="bg-accent/70 text-white px-6 py-3 rounded-md hover:bg-accent transition-all"
                >
                    Felhasználó hozzáadása
                </button>
            </div>

            {selectedUser && (
                <EditUsersForm
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSave={handleSave}
                />
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
