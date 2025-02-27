import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

async function connectToDatabase() {
    const client = await clientPromise;
    return client.db("kinizsi");
}

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const db = await connectToDatabase();
            const usersCollection = db.collection("users");
            const users = await usersCollection.find({}).toArray();

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: "Hiba történt az adatok lekérése közben." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
