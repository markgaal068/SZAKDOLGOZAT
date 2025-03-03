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
    const db = await connectToDatabase();
    const attendanceCollection = db.collection("attendance");

    if (req.method === "GET") {
        try {
            const { team, month } = req.query;
            const attendanceData = await attendanceCollection.findOne({
                team: team,
                month: parseInt(month),
            });
            res.status(200).json(attendanceData || {});
        } catch (error) {
            res.status(500).json({ error: "Hiba történt az adatok lekérése közben." });
        }
    } else if (req.method === "POST") {
        try {
            const { attendance, currentMonth, selectedTeam, hatóságiÁr, kopásDíj, fogyasztás, columns } = req.body;
            await attendanceCollection.updateOne(
                { team: selectedTeam, month: currentMonth },
                { 
                    $set: { 
                        attendance: attendance,
                        hatóságiÁr: hatóságiÁr,
                        kopásDíj: kopásDíj,
                        fogyasztás: fogyasztás,
                        columns: columns // Dátumok rendezett tárolása
                    } 
                },
                { upsert: true }
            );
            res.status(200).json({ message: "Adatok sikeresen mentve!" });
        } catch (error) {
            res.status(500).json({ error: "Hiba történt az adatok mentése közben." });
        }
    } else if (req.method === "DELETE") {
        try {
            const { team, month } = req.body;
            await attendanceCollection.deleteOne({ team: team, month: month });
            res.status(200).json({ message: "Adatok sikeresen törölve!" });
        } catch (error) {
            res.status(500).json({ error: "Hiba történt az adatok törlése közben." });
        }
    } else {
        res.setHeader("Allow", ["GET", "POST", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}