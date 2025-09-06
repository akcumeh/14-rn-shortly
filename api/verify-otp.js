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

    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ success: false, error: 'Phone and OTP are required' });
    }

    const storedOtp = await otps.findOne({ phone: phone.trim() });
    if (!storedOtp || new Date() > storedOtp.expires) {
      await otps.deleteOne({ phone: phone.trim() });
      return res.status(400).json({ success: false, error: 'OTP expired. Please request a new one.' });
    }

    if (storedOtp.otp !== otp.trim()) {
      return res.status(400).json({ success: false, error: 'Invalid OTP' });
    }

    const user = await users.findOne({ phone: phone.trim() });
    await otps.deleteOne({ phone: phone.trim() });

    return res.json({ 
      success: true, 
      message: 'Login successful',
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        phone: user.phone 
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ success: false, error: 'Failed to verify OTP' });
  }
}