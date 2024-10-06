import { MongoClient } from "mongodb";

const uri = "mongodb+srv://markgaal068:rGAW8V26qKPVM49s@kinizsi.wabej.mongodb.net/?retryWrites=true&w=majority&appName=kinizsi"; // Cseréld ki az adataidra
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { title, description, content, images } = req.body;

        try {
            await client.connect();
            const database = client.db("kinizsi"); // Adatbázis neve
            const newsCollection = database.collection("news"); // Gyűjtemény neve

            const newNewsItem = { title, description, content, images };
            await newsCollection.insertOne(newNewsItem);

            res.status(201).json({ message: 'Hír hozzáadva', newNewsItem });
        } catch (error) {
            console.error("Hiba a hír hozzáadása során:", error);
            res.status(500).json({ error: 'Hiba történt a hír hozzáadásakor.' });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
