import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://markgaal068:rGAW8V26qKPVM49s@kinizsi.wabej.mongodb.net/?retryWrites=true&w=majority&appName=kinizsi"; // SAJÁT ADAT!
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const { userId } = req.query; // Az id-t most query paraméterként kérjük

        if (!userId) {
            return res.status(400).json({ message: 'ID is required' });
        }

        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        try {
            await client.connect();
            const database = client.db("kinizsi"); // Adatbázis neve
            const usersCollection = database.collection("users"); // Gyűjtemény neve

            const result = await usersCollection.deleteOne({ _id: new ObjectId(userId) });

            if (result.deletedCount === 1) {
                res.status(200).json({ message: 'Felhasználó törölve sikeresen' });
            } else {
                res.status(404).json({ message: 'Felhasználó nem található' });
            }
        } catch (error) {
            console.error("Hiba a felhasználó törlése során:", error);
            res.status(500).json({ error: 'Hiba történt a felhasználó törlésekor.' });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}