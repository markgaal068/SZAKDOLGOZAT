import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Csak POST kérés engedélyezett" });
    }

    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
        return res.status(500).json({ message: "A MONGODB_URI nincs beállítva!" });
    }

    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        const db = client.db("kinizsi");
        const { username, email, role, tel } = req.body;

        const result = await db.collection("users").updateOne(
            { username },
            { $set: { email, role, tel } }
        );

        await client.close();

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: "Nem sikerült frissíteni" });
        }

        res.status(200).json({ message: "Felhasználó frissítve!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Szerverhiba" });
    } finally {
        await client.close();
    }
}
