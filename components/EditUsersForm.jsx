import { useState } from "react";

const EditUsersForm = ({ user, onClose, onSave }) => {
    const [editedUser, setEditedUser] = useState(user);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        const response = await fetch("/api/updateusers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedUser),
        });

        if (response.ok) {
            onSave(editedUser);
            onClose();
        } else {
            alert("Hiba történt frissítés közben.");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-sndbg p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-accent">Felhasználó szerkesztése</h2>
                <input
                    type="text"
                    name="username"
                    value={editedUser.username}
                    disabled
                    className="w-full p-2 border rounded mb-2 bg-gray-100 text-accent"
                />
                <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2 text-accent"
                />
                <input 
                    type="tel"
                    name="tel"
                    value={editedUser.tel}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2 text-accent"
                />
                <select
                    name="role"
                    value={editedUser.role}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2 text-accent"
                >
                    <option value="Adminisztrátor">Adminisztrátor</option>
                    <option value="Szerkesztő">Szerkesztő</option>
                </select>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="mr-2 px-4 py-2 bg-red-500 rounded">Mégse</button>
                    <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-accent text-white rounded">
                        {loading ? "Mentés..." : "Mentés"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditUsersForm;
