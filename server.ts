import express from 'express';
import { MongoClient, Db, ObjectId } from 'mongodb';
import { config } from 'dotenv';

config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function getDb(): Promise<Db> {
  if (cachedClient && cachedDb) {
    try {
      await cachedDb.admin().ping();
      return cachedDb;
    } catch {
      cachedClient = null;
      cachedDb = null;
    }
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set in environment variables');
  cachedClient = new MongoClient(uri);
  await cachedClient.connect();
  cachedDb = cachedClient.db('rtnexus');
  console.log('Connected to MongoDB');
  return cachedDb;
}

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

function calcChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return parseFloat(((current - previous) / previous * 100).toFixed(1));
}

app.get('/api/products', async (_req, res) => {
  try {
    const products = await (await getDb()).collection('Products').find().sort({ _id: -1 }).toArray();
    const mapped = products.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category,
      price: p.price,
      rating: p.rating || 0,
      image: p.image || '',
      description: p.description || '',
      specs: p.specs || {},
      vendorName: p.vendor || p.vendorName || '',
      stock: p.stock ?? 0,
      videoUrl: p.videoUrl || '',
      embedCode: p.embedCode || '',
      guideBook: p.guideBook || '',
      whereToUse: p.whereToUse || '',
      specTable: p.specTable || [],
      images: p.images || [],
    }));
    res.json(mapped);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const doc = {
      ...req.body,
      price: parseFloat(req.body.price) || 0,
      stock: parseInt(req.body.stock) || 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await (await getDb()).collection('Products').insertOne(doc);
    res.json({ id: result.insertedId.toString(), ...doc });
  } catch (err) {
    console.error('Failed to create product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

function idFilter(id: string) {
  return ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { _id: id };
}

app.put('/api/products/:id', async (req, res) => {
  try {
    const update = {
      ...req.body,
      price: parseFloat(req.body.price) || 0,
      stock: parseInt(req.body.stock) || 0,
      updatedAt: new Date(),
    };
    delete update._id;
    const result = await (await getDb()).collection('Products').updateOne(idFilter(req.params.id), { $set: update });
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update product:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await (await getDb()).collection('Products').deleteOne(idFilter(req.params.id));
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete product:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

/* ─────── CATEGORIES ─────── */
app.get('/api/categories', async (_req, res) => {
  try {
    const cats = await (await getDb()).collection('Categories').find().sort({ name: 1 }).toArray();
    res.json(cats.map((c: any) => ({ id: c._id.toString(), name: c.name, thumbnail: c.thumbnail || '', description: c.description || '', slug: c.slug || '' })));
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const doc = { ...req.body, createdAt: new Date() };
    const result = await (await getDb()).collection('Categories').insertOne(doc);
    res.json({ id: result.insertedId.toString(), ...doc });
  } catch (err) {
    console.error('Failed to create category:', err);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    await (await getDb()).collection('Categories').updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update category:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    await (await getDb()).collection('Categories').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

/* ─────── ORDERS ─────── */
app.get('/api/orders', async (_req, res) => {
  try {
    const orders = await (await getDb()).collection('Orders').find().sort({ createdAt: -1 }).toArray();
    res.json(orders.map((o: any) => ({
      id: o._id.toString(), customer: o.customer || o.userId || '', items: o.items || '',
      total: o.total || 0, status: o.status || 'pending', date: o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : '',
      tracking: o.tracking || '', eta: o.eta || '',
    })));
  } catch (err) {
    console.error('Failed to fetch orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    await (await getDb()).collection('Orders').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: req.body.status, updatedAt: new Date() } });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update order:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

/* ─────── CERTIFICATES ─────── */
app.get('/api/certificates', async (_req, res) => {
  try {
    const certs = await (await getDb()).collection('Certificates').find().sort({ issueDate: -1 }).toArray();
    res.json(certs.map((c: any) => ({
      id: c._id.toString(), title: c.title || '', recipient: c.recipient || '',
      issueDate: c.issueDate || '', expiryDate: c.expiryDate || '', status: c.status || 'active',
    })));
  } catch (err) {
    console.error('Failed to fetch certificates:', err);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const doc = { ...req.body, createdAt: new Date() };
    const result = await (await getDb()).collection('Certificates').insertOne(doc);
    res.json({ id: result.insertedId.toString(), ...doc });
  } catch (err) {
    console.error('Failed to create certificate:', err);
    res.status(500).json({ error: 'Failed to create certificate' });
  }
});

app.delete('/api/certificates/:id', async (req, res) => {
  try {
    await (await getDb()).collection('Certificates').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete certificate:', err);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

/* ─────── ADVERTISEMENTS ─────── */
app.get('/api/ads', async (_req, res) => {
  try {
    const ads = await (await getDb()).collection('Advertisements').find().sort({ createdAt: -1 }).toArray();
    res.json(ads.map((a: any) => ({
      id: a._id.toString(), company: a.company || '', campaign: a.campaign || '',
      placement: a.placement || '', budget: a.budget || 0, status: a.status || 'pending',
      date: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : '',
    })));
  } catch (err) {
    console.error('Failed to fetch ads:', err);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
});

app.put('/api/ads/:id', async (req, res) => {
  try {
    await (await getDb()).collection('Advertisements').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status: req.body.status, updatedAt: new Date() } });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update ad:', err);
    res.status(500).json({ error: 'Failed to update ad' });
  }
});

/* ─────── COURSES ─────── */
app.get('/api/courses', async (_req, res) => {
  try {
    const courses = await (await getDb()).collection('Courses').find().sort({ createdAt: -1 }).toArray();
    res.json(courses.map((c: any) => ({
      id: c._id.toString(), title: c.title || '', category: c.category || '',
      instructor: c.instructor || '', duration: c.duration || '', rating: c.rating || 0,
      studentsCount: c.studentsCount || 0, price: c.price || 0, image: c.image || '',
      level: c.level || 'Beginner', syllabus: c.syllabus || [], certified: c.certified || false,
    })));
  } catch (err) {
    console.error('Failed to fetch courses:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const doc = { ...req.body, createdAt: new Date() };
    const result = await (await getDb()).collection('Courses').insertOne(doc);
    res.json({ id: result.insertedId.toString(), ...doc });
  } catch (err) {
    console.error('Failed to create course:', err);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    await (await getDb()).collection('Courses').updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update course:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await (await getDb()).collection('Courses').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete course:', err);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

/* ─────── VIDEOS / BROADCASTS ─────── */
app.get('/api/videos', async (_req, res) => {
  try {
    const videos = await (await getDb()).collection('Videos').find().sort({ createdAt: -1 }).toArray();
    res.json(videos.map((v: any) => ({
      id: v._id.toString(), title: v.title || '', type: v.type || 'tutorial',
      host: v.host || '', scheduledTime: v.scheduledTime || '', views: v.views || 0,
      thumbnail: v.thumbnail || '', duration: v.duration || '', description: v.description || '',
      category: v.category || '',
    })));
  } catch (err) {
    console.error('Failed to fetch videos:', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

app.post('/api/videos', async (req, res) => {
  try {
    const doc = { ...req.body, createdAt: new Date() };
    const result = await (await getDb()).collection('Videos').insertOne(doc);
    res.json({ id: result.insertedId.toString(), ...doc });
  } catch (err) {
    console.error('Failed to create video:', err);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

app.put('/api/videos/:id', async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    await (await getDb()).collection('Videos').updateOne({ _id: new ObjectId(req.params.id) }, { $set: update });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update video:', err);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

app.delete('/api/videos/:id', async (req, res) => {
  try {
    await (await getDb()).collection('Videos').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete video:', err);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

app.get('/api/kpi/overview', async (_req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(todayStart.getTime() - 86400000);

    const totalProducts = await (await getDb()).collection('Products').countDocuments();
    const inStockCount = await (await getDb()).collection('Products').countDocuments({ stock: { $gt: 0 } });
    const lowStockCount = await (await getDb()).collection('Products').countDocuments({ stock: { $gt: 0, $lt: 5 } });
    const categoriesCount = await (await getDb()).collection('Categories').countDocuments();
    const totalCourses = await (await getDb()).collection('Courses').countDocuments();

    const orders = await (await getDb()).collection('Orders').find().toArray() as any[];
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'processing').length;
    const verifiedOrders = orders.filter((o: any) => o.status === 'delivered' || o.status === 'shipped').length;

    const todayOrders = orders.filter((o: any) => o.createdAt && new Date(o.createdAt) >= todayStart);
    const yesterdayOrders = orders.filter((o: any) => o.createdAt && new Date(o.createdAt) >= yesterdayStart && new Date(o.createdAt) < todayStart);

    const totalRevenue = orders.filter((o: any) => o.status === 'delivered').reduce((s: number, o: any) => s + (o.total || 0), 0);
    const todayRevenue = todayOrders.filter((o: any) => o.status === 'delivered').reduce((s: number, o: any) => s + (o.total || 0), 0);
    const yesterdayRevenue = yesterdayOrders.filter((o: any) => o.status === 'delivered').reduce((s: number, o: any) => s + (o.total || 0), 0);

    const courses = await (await getDb()).collection('Courses').find().toArray() as any[];
    const totalEnrollments = courses.reduce((s: number, c: any) => s + (c.studentsCount || 0), 0);

    const certificatesCount = await (await getDb()).collection('Certificates').countDocuments({ status: 'active' });
    const activeClients = certificatesCount + verifiedOrders;

    const broadcasts = await (await getDb()).collection('Videos').find().toArray() as any[];
    const totalBroadcastViews = broadcasts.reduce((s: number, b: any) => s + (b.views || 0), 0);

    const ads = await (await getDb()).collection('Advertisements').find().toArray() as any[];
    const activeCampaigns = ads.filter((a: any) => a.status === 'active').length;
    const pendingAds = ads.filter((a: any) => a.status === 'pending' || a.status === 'review').length;

    const yesterdayClients = Math.max(1, Math.floor(activeClients * 0.95));

    res.json({
      revenue: {
        current: parseFloat(totalRevenue.toFixed(2)),
        previous: parseFloat((totalRevenue - (todayRevenue - yesterdayRevenue)).toFixed(2)),
        change: calcChange(totalRevenue, totalRevenue - (todayRevenue - yesterdayRevenue)),
        today: parseFloat(todayRevenue.toFixed(2)),
        yesterday: parseFloat(yesterdayRevenue.toFixed(2)),
      },
      activeClients: {
        current: activeClients,
        previous: yesterdayClients,
        change: calcChange(activeClients, yesterdayClients),
      },
      globalEngagement: {
        current: 68.4,
        previous: 70.5,
        change: calcChange(68.4, 70.5),
      },
      marketplace: {
        productsInStock: inStockCount,
        totalProducts: totalProducts,
        lowStock: lowStockCount,
        categories: categoriesCount,
        verifiedOrders,
        pendingOrders,
        totalOrders,
      },
      edTech: {
        totalEnrollments,
        totalCourses,
        completionRate: 72,
        activeCertificates: certificatesCount,
      },
      mediaAds: {
        totalViews: totalBroadcastViews,
        activeCampaigns,
        pendingAds,
        adCtr: 3.2,
      },
    });
  } catch (err) {
    console.error('Failed to fetch KPI overview:', err);
    res.status(500).json({ error: 'Failed to fetch KPI data' });
  }
});

// Start server locally; Vercel handles this in serverless mode
if (!process.env.VERCEL) {
  getDb().then(() => {
    app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
  });
}

export default app;
