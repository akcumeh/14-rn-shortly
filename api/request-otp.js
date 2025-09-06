import { MongoClient } from 'mongodb';

let client;
let clientPromise;

if (!client) {
  client = new MongoClient(process.env.MONGODB_URI);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const client = await clientPromise;
    const db = client.db('shortly');
    const users = db.collection('users');
    const otps = db.collection('otps');

    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, error: 'Phone number is required' });

    const user = await users.findOne({ phone: phone.trim() });
    if (!user) {
      return res.status(400).json({ success: false, error: 'User not found. Please sign up first.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 300000); // 5 minutes

    await otps.replaceOne(
      { phone: phone.trim() },
      { phone: phone.trim(), otp, expires },
      { upsert: true }
    );

    console.log(`Generated OTP ${otp} for ${phone}`);

    return res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      otp: otp // Remove this in production
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
}