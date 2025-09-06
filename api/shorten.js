export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    console.log('Shortening URL:', url.trim());
    
    const response = await fetch('https://cleanuri.com/api/v1/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `url=${encodeURIComponent(url.trim())}`,
    });

    const data = await response.json();
    console.log('CleanURI response:', data);
    
    if (data.result_url) {
      return res.json({ shortened: data.result_url });
    } else {
      console.error('CleanURI error:', data.error);
      return res.status(400).json({ error: data.error || 'Failed to shorten URL' });
    }
  } catch (error) {
    console.error('Shortening error:', error);
    return res.status(500).json({ error: 'Failed to shorten URL' });
  }
}