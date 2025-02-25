"use client";

import { useState } from "react";

const AdminUsers = () => {
    const [users, setUsers] = useState([
        {
            username: "admin01",
            password: "adminpass123",
            email: "admin01@example.com",
            telefon: "123 456 789",
            role: "Adminisztrátor"
        },
        {
            username: "editor01",
            password: "editorpass456",
            telefon: "123 456 789",
            email: "editor01@example.com",
            role: "Szerkesztő"
        },
        {
            username: "editor02",
            password: "editorpass789",
            telefon: "123 456 789",
            email: "editor02@example.com",
            role: "Szerkesztő"
        },
        {
            username: "editor03",
            password: "editorpass101",
            telefon: "123 456 789",
            email: "editor03@example.com",
            role: "Szerkesztő"
        },
        {
            username: "editor04",
            password: "editorpass102",
            telefon: "123 456 789",
            email: "editor04@example.com",
            role: "Szerkesztő"
        },
        {
            username: "editor05",
            password: "editorpass103",
            telefon: "123 456 789",
            email: "editor05@example.com",
            role: "Szerkesztő"
        },
        {
            username: "editor06",
            password: "editorpass104",
            telefon: "123 456 789",
            email: "editor06@example.com",
            role: "Szerkesztő"
        },
        {
            username: "editor07",
            password: "editorpass105",
            telefon: "123 456 789",
            email: "editor07@example.com",
            role: "Szerkesztő"
        },
        {
            username: "editor08",
            password: "editorpass106",
            telefon: "123 456 789",
            email: "editor08@example.com",
            role: "Szerkesztő"
        },
        {
            username: "editor09",
            password: "editorpass107",
            telefon: "123 456 789",
            email: "editor09@example.com",
            role: "Szerkesztő"
        }
    ]);

    const handleEdit = (index) => {
        // Handle edit logic here
        alert(`Edit user at index: ${index}`);
    };

    const handleDelete = (index) => {
        setUsers(users.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6">
            <h2 className="text-4xl font-bold text-accent mb-6">Jogosultságok kezelése</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-bg table-auto">
                    <thead>
                        <tr>
                            <th className="p-3 text-left text-accent font-semibold">Felhasználónév</th>
                            <th className="p-3 text-left text-accent font-semibold">Jelszó</th>
                            <th className="p-3 text-left text-accent font-semibold">E-mail</th>
                            <th className="p-3 text-left text-accent font-semibold">Telefon</th>
                            <th className="p-3 text-left text-accent font-semibold">Jogosultsági szint</th>
                            <th className="p-3 text-left text-accent font-semibold">Szerkesztés</th>
                            <th className="p-3 text-left text-accent font-semibold">Törlés</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-3">{user.username}</td>
                                <td className="p-3 relative group">
                                    {user.password}
                                </td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.telefon}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleEdit(index)}
                                        className="bg-accent/70 text-white px-4 py-2 rounded-md hover:bg-accent transition-all"
                                    >
                                        Szerkesztés
                                    </button>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDelete(index)}
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
                <button className="bg-accent/70 text-white px-6 py-3 rounded-md hover:bg-accent transition-all">
                    Felhasználó hozzáadása
                </button>
            </div>
        </div>
    );
};

export default AdminUsers;
