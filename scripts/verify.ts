import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function verify() {
  const uri = process.env.MONGODB_URI;
  if (!uri) { console.error('MONGODB_URI not set'); process.exit(1); }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('rtgroup');
  const collections = await db.listCollections().toArray();
  console.log(`\nCollections in rtgroup (${collections.length}):`);
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`  • ${col.name}: ${count} documents`);
  }
  const admin = await db.collection('Users').findOne({ username: 'rtgroup' });
  console.log(`\nAdmin user: ${admin ? 'FOUND' : 'NOT FOUND'}`);
  const products = await db.collection('Products').find().limit(2).toArray();
  console.log(`Sample products: ${products.length > 0 ? products.map(p => p.name).join(', ') : 'NONE'}`);
  const courses = await db.collection('Courses').find().limit(2).toArray();
  console.log(`Sample courses: ${courses.length > 0 ? courses.map(c => c.title).join(', ') : 'NONE'}`);
  await client.close();
}

verify().catch(err => { console.error('Verify failed:', err.message); process.exit(1); });
