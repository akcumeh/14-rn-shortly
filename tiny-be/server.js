import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3010;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("Request received:", req.method, req.url);
    next();
});

app.post('/proxy/shorten', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { url } = req.body;
        console.log("body is " + req.body);
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const response = await fetch('https://cleanuri.com/api/v1/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `url=${encodeURIComponent(url.trim())}`,
        });
        console.log("Response status:", response.status);

        const data = await response.json();
        console.log("Response data:", data);
        
        if (data.result_url) {
            return res.json({ shortened: data.result_url });
        } else {
            return res.status(400).json({ error: data.error || 'Failed to shorten URL' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error })
    }
});

app.listen(PORT, () => {
    console.log("Server listening on " + PORT);
});