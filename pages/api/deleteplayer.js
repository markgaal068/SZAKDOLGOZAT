import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method !== "DELETE") {
        res.setHeader("Allow", ["DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.body;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Érvénytelen ID." });
    }

    try {
        await client.connect();
        const players = client.db("kinizsi").collection("players");
        const result = await players.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Játékos törölve sikeresen." });
        } else {
            res.status(404).json({ message: "Játékos nem található." });
        }
    } catch (error) {
        console.error("Hiba a játékos törlése során:", error);
        res.status(500).json({ error: "Hiba történt a játékos törlésekor." });
    } finally {
        await client.close();
    }
}
