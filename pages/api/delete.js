import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://markgaal068:rGAW8V26qKPVM49s@kinizsi.wabej.mongodb.net/?retryWrites=true&w=majority&appName=kinizsi"; // Cseréld ki az adataidra
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { id } = req.body; // A törölni kívánt hír azonosítója

        // Ellenőrizzük, hogy az ID létezik-e
        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        try {
            await client.connect();
            const database = client.db("kinizsi"); // Adatbázis neve
            const newsCollection = database.collection("news"); // Gyűjtemény neve

            // Ellenőrizzük, hogy az ID érvényes ObjectId formátumban van
            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }

            // Töröljük a hírt az azonosító alapján
            const result = await newsCollection.deleteOne({ _id: new ObjectId(id) });

            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Hír törölve sikeresen' });
            } else {
                res.status(404).json({ message: 'Hír nem található' });
            }
        } catch (error) {
            console.error("Hiba a hír törlése során:", error);
            res.status(500).json({ error: 'Hiba történt a hír törlésekor.' });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
