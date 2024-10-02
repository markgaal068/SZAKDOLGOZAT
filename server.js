const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/news', { useNewUrlParser: true, useUnifiedTopology: true });

const newsSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  images: [String],
});

const News = mongoose.model('News', newsSchema);

app.get('/news', async (req, res) => {
  const news = await News.find();
  res.json(news);
});

app.post('/news', async (req, res) => {
  const newNews = new News(req.body);
  await newNews.save();
  res.json(newNews);
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});


mongoose.connect('your-mongodb-uri', {
    // Remove the following options as they are no longer needed
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});