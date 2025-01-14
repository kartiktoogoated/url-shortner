import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import Url from './models/url.js';  // Import the Url model

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
};
app.post('/api/shorten', async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'Original Url is required' });
    }

    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    try {
        const shortUrl = nanoid(8);
        const newUrl = new Url({ originalUrl, shortUrl });
        await newUrl.save();
        res.status(201).json(newUrl);  // Respond with the shortened URL and the original URL
    } catch (err) {
        res.status(500).json({ error: 'Error catching short URL', details: err.message });
    }
});

app.get('/api/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });

        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        // Return the original URL
        res.status(200).json({ originalUrl: url.originalUrl });
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving the original URL', details: err.message });
    }
});


app.listen(PORT, () => {
    console.log('Server Running');
});
