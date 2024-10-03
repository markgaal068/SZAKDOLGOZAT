import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("kinizsi");

    switch (req.method) {
        case 'GET':
            const news = await db.collection('news').find({}).toArray();
            res.json(news);
            break;

        case 'POST':
            const { title, description, content, images } = req.body;
            const newNews = {
                title,
                description,
                content,
                images,
                date: new Date(),
            };
            await db.collection('news').insertOne(newNews);
            res.json({ message: 'News added successfully!' });
            break;

        case 'DELETE':
            const { idsToDelete } = req.body;
            await db.collection('news').deleteMany({ _id: { $in: idsToDelete.map(id => new ObjectId(id)) } });
            res.json({ message: 'Selected news deleted successfully!' });
            break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
