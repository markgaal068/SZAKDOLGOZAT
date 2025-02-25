import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://markgaal068:rGAW8V26qKPVM49s@kinizsi.wabej.mongodb.net/?retryWrites=true&w=majority&appName=kinizsi"; //SAJÁT ADAT!
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const { id, title, description, content, images } = req.body; // Az adatokat a body-ból kapjuk

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Érvénytelen ID' });
        }

        try {
            await client.connect();
            const database = client.db("kinizsi"); // Adatbázis neve
            const newsCollection = database.collection("news"); // Gyűjtemény neve

            const result = await newsCollection.replaceOne(
                { _id: new ObjectId(id) }, // Az ID alapján keressük a hírt
                { title, description, content, images }, { runValidators: true }
            );

            res.status(200).json({ message: 'Hír frissítve sikeresen.' });
        } catch (error) {
            console.error("Hiba a hír frissítése során:", error);
            res.status(500).json({ error: 'Hiba történt a hír frissítésekor.' });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
