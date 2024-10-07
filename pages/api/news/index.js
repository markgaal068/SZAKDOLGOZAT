import { MongoClient } from "mongodb";

const uri = "mongodb+srv://markgaal068:rGAW8V26qKPVM49s@kinizsi.wabej.mongodb.net/?retryWrites=true&w=majority&appName=kinizsi"; //SAJÁT ADAT!
const client = new MongoClient(uri);

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            await client.connect();
            const database = client.db("kinizsi"); // Adatbázis neve
            const newsCollection = database.collection("news"); // Gyűjtemény neve

            const newsItems = await newsCollection.find({}).toArray();
            res.status(200).json(newsItems);
        } catch (error) {
            console.error("Hiba a hírek lekérdezése során:", error);
            res.status(500).json({ error: 'Hiba történt a hírek lekérdezésekor.' });
        } finally {
            await client.close();
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
