import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8081;

const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? ['https://your-netlify-app.netlify.app']
        : ['http://localhost:8081', 'http://localhost:19006'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

function setupServer() {

    app.post('/api/shorten', async (req, res) => {
        try {
            const { url } = req.body;

            if (!url) {
                return res.status(400).json({ error: 'URL is required' });
            }

            const encodedUrl = encodeURIComponent(url.trim());

            const response = await fetch('https://cleanuri.com/api/v1/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `url=${encodedUrl}`,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                return res.status(400).json({ error: data.error });
            }

            if (!data.result_url) {
                return res.status(400).json({ error: 'No shortened URL received' });
            }

            res.json({ shortened: data.result_url.replace(/\\/g, '') });
        } catch (error) {
            console.error('Shortening error:', error);
            res.status(500).json({ error: 'Failed to shorten URL' });
        }
    });

    // Auth routes disabled until MongoDB is working

    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
        console.log(`URL shortener: http://localhost:${PORT}/api/shorten`);
    });
}

setupServer();