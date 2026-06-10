import express from 'express';
import { MongoClient, Db } from 'mongodb';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '.env.local') });

const app = express();
const PORT = process.env.PORT || 3001;
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI not set in .env.local');
  process.exit(1);
}

const client = new MongoClient(uri);
let db: Db;

async function connectDB() {
  await client.connect();
  db = client.db('rtnexus');
  console.log('Connected to MongoDB');
}

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/products', async (_req, res) => {
  try {
    const products = await db.collection('Products').find().toArray();
    const mapped = products.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating,
      image: p.image || '',
      description: p.description || '',
      specs: p.specs || {},
      vendorName: p.vendor || p.vendorName || '',
      stock: p.stock ?? 0,
    }));
    res.json(mapped);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
});
