import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { createHash } from 'crypto';
config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rtnexus';
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 20000,
  connectTimeoutMS: 20000,
});

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

async function upsertOne(collection: any, filter: any, doc: any) {
  const existing = await collection.findOne(filter);
  if (!existing) {
    await collection.insertOne({ ...doc, createdAt: new Date() });
  }
}

async function seed() {
  await client.connect();
  const db = client.db('rtnexus');

  // ── Users (only if missing) ──
  const existingUser = await db.collection('Users').findOne({ username: 'rtnexus' });
  if (!existingUser) {
    await db.collection('Users').createIndex({ username: 1 }, { unique: true });
    await db.collection('Users').createIndex({ email: 1 }, { unique: true });
    await db.collection('Users').insertOne({
      username: 'rtnexus',
      email: 'admin@rtnexus.enterprise',
      password: hashPassword('123456'),
      fullName: 'RT Nexus Admin',
      role: 'admin',
      createdAt: new Date(),
    });
  }

  // ── Roles & Permissions (only if missing) ──
  const rolesExist = await db.collection('Roles').countDocuments();
  if (!rolesExist) {
    await db.collection('Roles').insertMany([
      { name: 'admin', label: 'Enterprise Administrator' },
      { name: 'customer', label: 'Marketplace Buyer' },
      { name: 'student', label: 'Accredited Student' },
      { name: 'instructor', label: 'Research Instructor' },
      { name: 'vendor', label: 'OEM Foundry Seller' },
      { name: 'advertiser', label: 'Sponsorship Partner' },
    ]);
    await db.collection('Permissions').insertMany([
      { role: 'admin', actions: ['*'] },
      { role: 'customer', actions: ['products:read', 'orders:create', 'orders:read'] },
      { role: 'student', actions: ['courses:read', 'courses:enroll', 'assessments:submit'] },
      { role: 'instructor', actions: ['courses:create', 'courses:edit', 'assessments:grade'] },
      { role: 'vendor', actions: ['products:create', 'products:edit', 'orders:read'] },
      { role: 'advertiser', actions: ['campaigns:create', 'campaigns:read'] },
    ]);
  }

  // ── Categories ──
  const categoriesExist = await db.collection('Categories').countDocuments();
  if (!categoriesExist) {
    const categories = [
      { name: 'Embedded Systems', slug: 'embedded-systems', thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=200', description: 'Embedded systems and microcontroller platforms' },
      { name: 'IoT Devices', slug: 'iot-devices', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200', description: 'Internet of Things hardware and modules' },
      { name: 'Development Boards', slug: 'development-boards', thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=200', description: 'Prototyping and evaluation platforms' },
      { name: 'Power Solutions', slug: 'power-solutions', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200', description: 'Power management and supply solutions' },
      { name: 'Sensors', slug: 'sensors', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200', description: 'Environmental and industrial sensing solutions' },
      { name: 'Robotics', slug: 'robotics', thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200', description: 'Robotic platforms and components' },
      { name: 'Microcontroller Boards', slug: 'microcontroller-boards', thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=200', description: 'MCU development and prototyping boards' },
      { name: 'Embedded Wireless Modules', slug: 'embedded-wireless-modules', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200', description: 'Wireless communication modules for embedded systems' },
      { name: 'Power Management ICs', slug: 'power-management-ics', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200', description: 'Integrated circuits for power regulation' },
      { name: 'Sensor Interface Circuits', slug: 'sensor-interface-circuits', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200', description: 'Interface and conditioning circuits for sensors' },
      { name: 'Motor Driver Circuits', slug: 'motor-driver-circuits', thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200', description: 'Motor control and driver circuits' },
      { name: 'Optoelectronic Interfaces', slug: 'optoelectronic-interfaces', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200', description: 'Optical and display interface components' },
      { name: 'Communication Bus Drivers', slug: 'communication-bus-drivers', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200', description: 'Bus interface and communication drivers' },
      { name: 'Embedded Storage Modules', slug: 'embedded-storage-modules', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200', description: 'Storage solutions for embedded systems' },
      { name: 'Passive Circuit Networks', slug: 'passive-circuit-networks', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200', description: 'Passive components and circuit networks' },
      { name: 'Programmable Logic Circuits', slug: 'programmable-logic-circuits', thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=200', description: 'FPGA, CPLD and programmable logic devices' },
    ];
    for (const c of categories) {
      await upsertOne(db.collection('Categories'), { slug: c.slug }, c);
    }
  }

  // ── Vendors (only if missing) ──
  const vendorsExist = await db.collection('Vendors').countDocuments();
  if (!vendorsExist) {
    await db.collection('Vendors').insertMany([
      { name: 'Matrix Transducers Inc.', slug: 'matrix-transducers', verified: true, rating: 4.8 },
      { name: 'Embedded Dynamics Ltd.', slug: 'embedded-dynamics', verified: true, rating: 4.6 },
      { name: 'Core Silicon Foundry', slug: 'core-silicon', verified: true, rating: 4.9 },
      { name: 'Nexus Embedded Corp', slug: 'nexus-embedded', verified: true, rating: 4.7 },
      { name: 'Silicon Ventures Ltd', slug: 'silicon-ventures', verified: true, rating: 4.8 },
      { name: 'Pinnacle Semiconductor', slug: 'pinnacle-semi', verified: true, rating: 4.6 },
      { name: 'Arcus Wireless', slug: 'arcus-wireless', verified: true, rating: 4.5 },
      { name: 'VoltCore Power', slug: 'voltcore-power', verified: true, rating: 4.7 },
      { name: 'SensArray Technologies', slug: 'sensarray-tech', verified: true, rating: 4.4 },
    ]);
  }

  // ── Products ──
  const productsExist = await db.collection('Products').countDocuments();
  if (!productsExist) {
    await db.collection('Products').createIndex({ vendorId: 1 });
    await db.collection('Products').createIndex({ category: 1 });
    const products = [
      { name: 'IoT Gateway Core Hub X1', category: 'IoT Devices', price: 129.99, rating: 4.8, stock: 150, vendor: 'Matrix Transducers Inc.', description: 'Enterprise IoT gateway with dual-band telemetry and encrypted firmware.', specs: { Connectivity: 'WiFi 6 / BLE 5.3', 'Power Input': '5V DC / PoE', 'Flash Storage': '32GB eMMC' }, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500' },
      { name: 'RTTI Calibration Board v4', category: 'Development Boards', price: 89.99, rating: 4.7, stock: 200, vendor: 'Embedded Dynamics Ltd.', description: 'RTTI-certified calibration platform for embedded prototyping.', specs: { MCU: 'ARM Cortex-M7', 'Clock Speed': '600MHz', 'Digital I/O': '24 pins' }, image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500' },
      { name: 'SCADA Telemetry Scanner', category: 'Embedded Systems', price: 249.99, rating: 4.9, stock: 75, vendor: 'Core Silicon Foundry', description: 'Industrial SCADA scanner for real-time telemetry monitoring.', specs: { 'Scan Rate': '1000 samples/s', Interface: 'RS-485 / Modbus', 'IP Rating': 'IP67' }, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500' },
      { name: 'Edge AI Accelerator Module', category: 'Embedded Systems', price: 199.99, rating: 4.6, stock: 120, vendor: 'Matrix Transducers Inc.', description: 'Neural inference accelerator for edge deployments.', specs: { TOPS: '4 TOPS', Memory: '8GB LPDDR4', 'Power Draw': '7.5W' }, image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500' },
      { name: 'Biometric Sensor Matrix', category: 'Sensors', price: 59.99, rating: 4.5, stock: 300, vendor: 'Embedded Dynamics Ltd.', description: 'Multi-spectral biometric sensor array for secure identity.', specs: { 'Sensor Type': 'Optical / Capacitive', Resolution: '500 DPI', Interface: 'USB-C / SPI' }, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500' },
      { name: 'Industrial Power Supply Unit', category: 'Power Solutions', price: 149.99, rating: 4.7, stock: 180, vendor: 'Core Silicon Foundry', description: 'Ruggedized IP67 power supply for field deployments.', specs: { 'Output Voltage': '12V / 24V', 'Current Rating': '10A', 'IP Rating': 'IP67' }, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500' },
      { name: 'Autonomous Rover Chassis Kit', category: 'Robotics', price: 349.99, rating: 4.8, stock: 45, vendor: 'Matrix Transducers Inc.', description: 'Four-wheel drive rover with integrated SLAM navigation.', specs: { Motor: '4x DC Encoder', 'Max Payload': '5kg', Battery: '5000mAh LiPo' }, image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500' },
      { name: 'Mesh Network Node v2', category: 'IoT Devices', price: 79.99, rating: 4.4, stock: 250, vendor: 'Embedded Dynamics Ltd.', description: 'Long-range mesh networking node for distributed sensor grids.', specs: { Range: '2km LOS', Protocol: 'LoRaWAN / Zigbee', 'Battery Life': '18 months' }, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500' },
      { name: 'Oscilloscope Shield Pro', category: 'Development Boards', price: 44.99, rating: 4.3, stock: 400, vendor: 'Core Silicon Foundry', description: '2-channel oscilloscope add-on board for RTTI dev kits.', specs: { 'Sample Rate': '50 MS/s', Bandwidth: '20MHz', Input: '±20V' }, image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=500' },
      { name: 'GPS Telemetry Logger', category: 'Sensors', price: 39.99, rating: 4.6, stock: 350, vendor: 'Matrix Transducers Inc.', description: 'High-precision GPS logger with on-board storage.', specs: { Accuracy: '1.5m CEP', 'Log Rate': '10 Hz', Storage: 'MicroSD up to 32GB' }, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500' },
    ];
    for (const p of products) {
      await upsertOne(db.collection('Products'), { name: p.name }, p);
    }
  }

  // ── Courses ──
  const coursesExist = await db.collection('Courses').countDocuments();
  if (!coursesExist) {
    await db.collection('Courses').createIndex({ category: 1 });
    const courses = [
      { title: 'Embedded Firmware Engineering', category: 'Embedded Engineering', instructor: 'Dr. Marcus Vance', duration: '12 weeks', price: 499.99, rating: 4.8, certified: true, level: 'Advanced', studentsCount: 340, description: 'Master embedded firmware development with ARM Cortex-M microcontrollers.', syllabus: ['Introduction to Embedded Systems', 'ARM Cortex-M Architecture', 'Interrupts and DMA', 'RTOS Fundamentals', 'Peripheral Drivers', 'Power Management', 'Debugging and Profiling', 'Final Capstone Project'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500' },
      { title: 'Advanced SCADA & Telemetry', category: 'Telemetry Networks', instructor: 'Prof. Clara Dupont', duration: '8 weeks', price: 349.99, rating: 4.7, certified: true, level: 'Advanced', studentsCount: 210, description: 'Deep dive into industrial SCADA systems and telemetry data pipelines.', syllabus: ['SCADA Architecture Overview', 'Modbus and DNP3 Protocols', 'Telemetry Data Acquisition', 'Real-time Monitoring Dashboards', 'Security Hardening', 'Incident Response Drills'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500' },
      { title: 'Edge AI & Neural Networks', category: 'Edge AI / Neural Nets', instructor: 'Dr. Marcus Vance', duration: '10 weeks', price: 599.99, rating: 4.9, certified: true, level: 'Advanced', studentsCount: 180, description: 'Deploy neural network models on resource-constrained edge devices.', syllabus: ['Neural Network Fundamentals', 'Model Quantization', 'TensorFlow Lite for Microcontrollers', 'Edge TPU Optimization', 'Real-world Deployments', 'Performance Benchmarking'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500' },
      { title: 'IoT Security & Cryptography', category: 'Cybersecurity / SCADA', instructor: 'Prof. Clara Dupont', duration: '6 weeks', price: 299.99, rating: 4.6, certified: true, level: 'Intermediate', studentsCount: 420, description: 'Secure IoT deployments with modern cryptographic primitives.', syllabus: ['Threat Modeling for IoT', 'Symmetric Encryption', 'Public Key Infrastructure', 'Secure Boot and OTA Updates', 'Penetration Testing Lab'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500' },
      { title: 'Software Development for Engineers', category: 'Advanced Software', instructor: 'Dr. Marcus Vance', duration: '8 weeks', price: 399.99, rating: 4.5, certified: true, level: 'Intermediate', studentsCount: 290, description: 'Modern C++ and Rust for embedded and systems programming.', syllabus: ['C++ for Embedded Systems', 'Rust Memory Safety', 'Concurrency Patterns', 'Testing and CI/CD', 'Cross-compilation Toolchains'], image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500' },
    ];
    for (const c of courses) {
      await upsertOne(db.collection('Courses'), { title: c.title }, c);
    }
  }

  // ── Orders ──
  const ordersExist = await db.collection('Orders').countDocuments();
  if (!ordersExist) {
    await db.collection('Orders').createIndex({ userId: 1 });
    await db.collection('Orders').createIndex({ createdAt: -1 });

    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
    const customers = ['Alice Chen', 'Bob Martinez', 'Clara Dupont', 'David Kim', 'Elena Rossi', 'Frank Okafor'];
    const items = [
      { name: 'Nexus IoT Gateway Hub X1', price: 349.99 },
      { name: 'RT-SOC Core Evolution Board', price: 189.50 },
      { name: 'Precision Biosensing Matrix Module', price: 79.00 },
      { name: 'Autonomous Mecanum Drive-Train Pod', price: 520.00 },
      { name: 'Smart Grid Din-Rail Power Core', price: 210.00 },
      { name: 'Sub-Giga Range Telemetry Shield', price: 45.00 },
    ];

    const orders: Record<string, any>[] = [];
    for (let day = 30; day >= 0; day--) {
      const date = new Date(Date.now() - day * 86400000);
      const ordersOnDay = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < ordersOnDay; i++) {
        const item = items[Math.floor(Math.random() * items.length)];
        const statusIdx = day < 2 ? Math.min(2 + Math.floor(Math.random() * 2), 3) : Math.min(day < 5 ? 3 : 4, 4);
        orders.push({
          customer: customers[Math.floor(Math.random() * customers.length)],
          items: item.name,
          total: item.price,
          status: statuses[statusIdx],
          createdAt: date,
          tracking: day < 2 ? `TRK-${Math.floor(1000 + Math.random() * 9000)}` : '—',
          eta: day < 2 ? (statusIdx === 3 ? 'Delivered' : 'In Transit') : 'Delivered',
        });
      }
    }
    await db.collection('Orders').insertMany(orders);

    await db.collection('Payments').createIndex({ orderId: 1 });
    await db.collection('Invoices').createIndex({ orderId: 1 });
  }

  // ── Videos ──
  const videosExist = await db.collection('Videos').countDocuments();
  if (!videosExist) {
    await db.collection('Videos').insertMany([
      { title: 'SCADA System Walkthrough', type: 'tutorial', host: 'Prof. Clara Dupont', duration: '34:20', views: 1200, thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500', description: 'A comprehensive walkthrough of SCADA system architecture and telemetry pipelines.', category: 'Embedded Systems' },
      { title: 'Building Your First IoT Gateway', type: 'tutorial', host: 'Dr. Marcus Vance', duration: '45:10', views: 2300, thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500', description: 'Step-by-step guide to building and deploying an IoT gateway using off-the-shelf components.', category: 'IoT Devices' },
    ]);
  }

  // ── Advertisements ──
  const adsExist = await db.collection('Advertisements').countDocuments();
  if (!adsExist) {
    await db.collection('Advertisements').insertMany([
      { company: 'Core Silicon Foundry', campaign: 'Banner Campaign', placement: 'homepage', budget: 5000, status: 'active', createdAt: new Date() },
      { company: 'Matrix Transducers Inc.', campaign: 'Video Roll', placement: 'mttv_video_roll', budget: 12000, status: 'active', createdAt: new Date() },
    ]);
  }

  // ── Certificates (indexes only, no seed data needed) ──
  await db.collection('Certificates').createIndex({ userId: 1 });
  await db.collection('Certificates').createIndex({ courseId: 1 });

  // ── Podcasts (only if missing) ──
  const podcastsExist = await db.collection('Podcasts').countDocuments();
  if (!podcastsExist) {
    await db.collection('Podcasts').insertMany([
      { title: 'Embedded Futures Ep. 42 — AI at the Edge', host: 'RT Nexus Media', duration: '52:15', publishedAt: new Date() },
      { title: 'Embedded Futures Ep. 43 — Supply Chain Resilience', host: 'RT Nexus Media', duration: '48:30', publishedAt: new Date() },
    ]);
  }

  // ── Other indexes (non-destructive) ──
  await db.collection('Meetings').createIndex({ hostId: 1 });
  await db.collection('MeetingRecordings').createIndex({ meetingId: 1 });
  await db.collection('BreakoutRooms').createIndex({ meetingId: 1 });
  await db.collection('ChatMessages').createIndex({ roomId: 1 });
  await db.collection('ChatMessages').createIndex({ senderId: 1 });
  await db.collection('Notifications').createIndex({ userId: 1 });
  await db.collection('Analytics').createIndex({ event: 1 });
  await db.collection('Analytics').createIndex({ timestamp: -1 });
  await db.collection('AuditLogs').createIndex({ userId: 1 });
  await db.collection('AuditLogs').createIndex({ timestamp: -1 });
  await db.collection('SupportTickets').createIndex({ userId: 1 });
  await db.collection('SupportTickets').createIndex({ status: 1 });

  console.log('Seed complete — collections populated (existing data preserved).');
  console.log('Admin user: username=rtnexus, password=123456');
  await client.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
