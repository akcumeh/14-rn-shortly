import fetch from 'node-fetch';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}