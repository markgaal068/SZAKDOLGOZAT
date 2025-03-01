import { useState } from "react";

const AddUsersForm = ({ user = {}, onClose, onSave }) => {
    const [editedUser, setEditedUser] = useState({
        username: user.username || "",
        password: user.password || "",
        email: user.email || "",
        tel: user.tel || "",
        role: user.role || "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEditedUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        if (!editedUser.username || !editedUser.password || !editedUser.email || !editedUser.tel || !editedUser.role) {
            alert("Minden mezőt ki kell tölteni!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/addusers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedUser),
            });

            if (!response.ok) throw new Error("Hiba történt a mentés során.");

            onSave(editedUser);
            onClose();
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-sndbg p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-accent">Felhasználó hozzáadása</h2>
                <input
                    type="text"
                    name="username"
                    value={editedUser.username}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2 text-accent"
                    placeholder="Felhasználónév"
                />
                <input
                    type="text"
                    name="fullname"
                    value={editedUser.fullname}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2 text-accent"
                    placeholder="Teljes Név"
                />
                <input
                    type="password"
                    name="password"
                    value={editedUser.password}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2 text-accent"
                    placeholder="Jelszó"
                />
                <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2 text-accent"
                    placeholder="E-mail"
                />
                <input
                    type="tel"
                    name="tel"
                    value={editedUser.tel}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2 text-accent"
                    placeholder="Telefonszám"
                />
                <select
                    name="role"
                    value={editedUser.role}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mb-2 text-accent"
                >
                    <option value="">Válassz szerepkört</option>
                    <option value="Adminisztrátor">Adminisztrátor</option>
                    <option value="Szerkesztő">Szerkesztő</option>
                </select>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="mr-2 px-4 py-2 bg-red-500 text-white rounded">
                        Mégse
                    </button>
                    <button onClick={handleSubmit} disabled={loading} className="px-4 py-2 bg-accent text-white rounded">
                        {loading ? "Mentés..." : "Mentés"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUsersForm;
