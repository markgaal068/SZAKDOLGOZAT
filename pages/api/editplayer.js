import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Lásd addplayer.js - a beágyazott fénykép miatt kell a megemelt limit.
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "12mb",
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== "PUT") {
        res.setHeader("Allow", ["PUT"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id, first_name, last_name, position, image_link, profile_link } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Érvénytelen ID." });
    }
    if (!last_name) {
        return res.status(400).json({ error: "A vezetéknév megadása kötelező." });
    }

    try {
        await client.connect();
        const players = client.db("kinizsi").collection("players");

        await players.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    first_name: first_name || "",
                    last_name,
                    position: position || "",
                    image_link: image_link || "",
                    profile_link: profile_link || "",
                },
            }
        );

        res.status(200).json({ message: "Játékos frissítve sikeresen." });
    } catch (error) {
        console.error("Hiba a játékos frissítése során:", error);
        res.status(500).json({ error: "Hiba történt a játékos frissítésekor." });
    } finally {
        await client.close();
    }
}
