import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const uri = "mongodb+srv://markgaal068:rGAW8V26qKPVM49s@kinizsi.wabej.mongodb.net/?retryWrites=true&w=majority&appName=kinizsi"; // SAJÁT ADAT!
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, fullname, email, tel, password, role } = req.body;

        try {
            await client.connect();
            const database = client.db("kinizsi"); // Adatbázis neve
            const usersCollection = database.collection("users"); // Gyűjtemény neve

            // Jelszó hashelése (10-es salt értékkel)
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = { 
                username,
                fullname, 
                email, 
                tel, 
                password: hashedPassword, // Hashelt jelszó
                role 
            };

            await usersCollection.insertOne(newUser);

            res.status(201).json({ message: 'Felhasználó hozzáadva', newUser });
        } catch (error) {
            console.error("Hiba a felhasználó hozzáadása során:", error);
            res.status(500).json({ error: 'Hiba történt a felhasználó hozzáadásakor.' });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
