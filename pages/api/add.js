import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// A base64-be kódolt képek miatt a body simán túllépi az alapértelmezett 1mb-os
// Next.js limitet - a hírekhez becsatolt fotók emiatt csendben elszálltak (413).
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "12mb",
        },
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { title, description, content, images, author, createdAt } = req.body;

        try {
            await client.connect();
            const database = client.db("kinizsi"); // Adatbázis neve
            const newsCollection = database.collection("news"); // Gyűjtemény neve

            const newNewsItem = { title, description, content, images, author, createdAt };
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