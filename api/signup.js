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

    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const existingUser = await users.findOne({
      $or: [{ phone: phone.trim() }, { email: email.trim() }]
    });

    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    await users.insertOne({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      createdAt: new Date()
    });

    return res.json({ success: true, message: 'Account created successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ success: false, error: 'Database connection failed' });
  }
}