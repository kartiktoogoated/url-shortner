import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import Url from './models/url.js';  
import isURL from 'validator/lib/isURL.js';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });


const getStatsByShortUrl = async (shortUrl) => {
    const url = await Url.findOne({ shortUrl });
    if (!url) return null;

    return {
        shortUrl: url.shortUrl,
        originalUrl: url.originalUrl,
        clickCount: url.clickCount,
        referrers: Object.fromEntries(url.referrers),
        geoLocations: Object.fromEntries(url.geoLocations),
        accessTimestamps: url.accessTimestamps,
    };
};

app.post('/api/shorten', async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl || typeof originalUrl !== 'string') {
        return res.status(400).json({ error: 'Invalid input: URL must be provided as a string.' });
    }

    const isValidUrl = isURL(originalUrl, {
        require_protocol: true,
        require_valid_protocol: true,
        protocols: ['http', 'https'],
        host_whitelist: [/\.com$/, /\.org$/, /\.net$/],
    });

    if (!isValidUrl) {
        return res.status(400).json({ error: 'Invalid URL. Only .com, .org, .net domains are allowed.' });
    }

    try {
        const shortUrl = nanoid(8);
        const newUrl = new Url({ originalUrl, shortUrl });
        await newUrl.save();
        res.status(201).json(newUrl);
    } catch (err) {
        res.status(500).json({ error: 'Error creating short URL', details: err.message });
    }
});

app.get('/api/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });

        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        const referrer = req.get('Referrer') || 'unknown';
        const geoLocation = req.ip || 'unknown';
        url.clickCount += 1;
        url.referrers.set(referrer, (url.referrers.get(referrer) || 0) + 1);
        url.geoLocations.set(geoLocation, (url.geoLocations.get(geoLocation) || 0) + 1);
        url.accessTimestamps.push(new Date());
        await url.save();

        res.status(200).json({ originalUrl: url.originalUrl });
    } catch (err) {
        res.status(500).json({ error: 'Error retrieving the original URL', details: err.message });
    }
});

app.put('/api/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const { originalUrl } = req.body;

    if (!originalUrl || !isURL(originalUrl)) {
        return res.status(400).json({ error: 'Invalid URL provided. Please provide a valid URL.' });
    }

    try {
        const updatedUrl = await Url.findOneAndUpdate(
            { shortUrl },
            { originalUrl, updatedAt: new Date() },
            { new: true } 
        );

        if (!updatedUrl) {
            return res.status(404).json({ error: 'Short URL not found.' });
        }

        res.status(200).json({ message: 'URL updated successfully.', updatedUrl });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating the URL.', details: err.message });
    }
});

app.put('/api/shorten/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;
    const { url: updatedUrl } = req.body; 

    const isValidUrl = isURL(updatedUrl, {
        require_protocol: true,
        require_valid_protocol: true,
        protocols: ['http', 'https'],
        host_whitelist: [/\.com$/, /\.org$/, /\.net$/], 
    });

    if (!updatedUrl || !isValidUrl) {
        return res.status(400).json({ error: 'Invalid URL. Only .com, .org, .net domains are allowed.' });
    }

    try {
        const existingUrl = await Url.findOne({ shortUrl });
        if (!existingUrl) {
            return res.status(404).json({ error: 'Short URL not found.' });
        }

        existingUrl.originalUrl = updatedUrl;
        existingUrl.updatedAt = new Date(); 
        await existingUrl.save();

        res.status(200).json({
            id: existingUrl._id,
            url: existingUrl.originalUrl,
            shortCode: existingUrl.shortUrl,
            createdAt: existingUrl.createdAt,
            updatedAt: existingUrl.updatedAt,
        });
    } catch (err) {
        res.status(500).json({ error: 'Error updating short URL', details: err.message });
    }
});

app.get('/api/url/:shortUrl/stats', async (req, res) => {
    const { shortUrl } = req.params;
    try {
      const stats = await getStatsByShortUrl(shortUrl);
      if (!stats) {
        return res.status(404).json({ error: 'Short URL not found' });
      }
      res.json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log('Server Running');
});
export { getStatsByShortUrl };
