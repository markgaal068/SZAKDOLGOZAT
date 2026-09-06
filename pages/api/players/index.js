import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Érvényes csapat-azonosítók - ugyanazok, mint a public/teamdatas/kezilabda/ mappák
export const VALID_TEAMS = ["ffifelnott", "noifelnott", "leanyseri"];

export default async function handler(req, res) {
    if (req.method !== "GET") {
        res.setHeader("Allow", ["GET"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { team } = req.query;
    if (!team || !VALID_TEAMS.includes(team)) {
        return res.status(400).json({ error: "Érvénytelen vagy hiányzó 'team' paraméter." });
    }

    try {
        await client.connect();
        const players = client.db("kinizsi").collection("players");
        // _id másodlagos rendezési kulcsként: a migrált játékosoknak azonos
        // createdAt időbélyegük van, enélkül a sorrend nem lenne stabil.
        const data = await players.find({ team }).sort({ createdAt: 1, _id: 1 }).toArray();
        res.status(200).json(data);
    } catch (error) {
        console.error("Hiba a játékosok lekérdezése során:", error);
        res.status(500).json({ error: "Hiba történt a játékosok lekérdezésekor." });
    } finally {
        await client.close();
    }
}
