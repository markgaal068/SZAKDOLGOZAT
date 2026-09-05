import { MongoClient } from "mongodb";
import { VALID_TEAMS } from "./players/index";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// A base64-be kódolt fénykép miatt a body simán túllépi az alapértelmezett
// 1mb-os Next.js limitet - lásd pages/api/add.js ugyanerről.
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "12mb",
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { team, first_name, last_name, position, image_link, profile_link } = req.body;

    if (!team || !VALID_TEAMS.includes(team)) {
        return res.status(400).json({ error: "Érvénytelen vagy hiányzó csapat." });
    }
    if (!last_name) {
        return res.status(400).json({ error: "A vezetéknév megadása kötelező." });
    }

    try {
        await client.connect();
        const players = client.db("kinizsi").collection("players");

        const newPlayer = {
            team,
            first_name: first_name || "",
            last_name,
            position: position || "",
            image_link: image_link || "",
            profile_link: profile_link || "",
            createdAt: new Date().toISOString(),
        };

        const result = await players.insertOne(newPlayer);
        res.status(201).json({ ...newPlayer, _id: result.insertedId });
    } catch (error) {
        console.error("Hiba a játékos hozzáadása során:", error);
        res.status(500).json({ error: "Hiba történt a játékos hozzáadásakor." });
    } finally {
        await client.close();
    }
}
