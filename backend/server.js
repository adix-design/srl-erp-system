require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const { connectDB, isMongo, fallbackDb } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Seeding Default Admin User
const seedAdmin = async () => {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'srladmin123';
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    if (isMongo()) {
      const User = require('./models/user');
      const existing = await User.findOne({ username });
      if (!existing) {
        await User.create({ username, password: hashedPassword });
        console.log(`👤 Admin user seeded in MongoDB: Username: "${username}", Password: "${password}"`);
      } else {
        console.log(`👤 Seed check: Admin user "${username}" already exists in MongoDB.`);
      }
    } else {
      const existing = await fallbackDb.getUserByUsername(username);
      if (!existing) {
        await fallbackDb.createUser({ username, password: hashedPassword });
        console.log(`👤 Admin user seeded in local db.json: Username: "${username}", Password: "${password}"`);
      } else {
        console.log(`👤 Seed check: Admin user "${username}" already exists in local db.json.`);
      }
    }
  } catch (error) {
    console.error('❌ Failed to seed default admin user:', error.message);
  }
};

// Seeding Mock Shipments if database is empty
const seedShipments = async () => {
  try {
    let count = 0;
    if (isMongo()) {
      const Shipment = require('./models/shipment');
      count = await Shipment.countDocuments();
    } else {
      const shipments = await fallbackDb.getShipments();
      count = shipments.length;
    }

    if (count === 0) {
      const mockShipments = [
        {
          customerName: 'Rajesh Sharma',
          phone: '9876543210',
          pickupAddress: 'E-7, Arera Colony, Bhopal, MP',
          deliveryAddress: 'Flat 402, Sea Breeze, Bandra West, Mumbai, MH',
          pickupCity: 'Bhopal',
          deliveryCity: 'Mumbai',
          truckNumber: 'MP-04-HE-7890',
          amount: 42000,
          amountInWords: 'Forty Two Thousand Rupees Only',
          goodsDescription: 'Household Goods, Sofa, Refrigerator, Boxes',
          weight: '1800 Kgs',
          paymentMode: 'Bank Transfer',
          lrNumber: '3426',
          invoiceNumber: '4098',
          receiptNumber: '2698',
          deliveryType: 'Door Delivery',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          customerName: 'Amit Verma',
          phone: '9826012345',
          pickupAddress: '15, Saket Nagar, Indore, MP',
          deliveryAddress: 'Sector 4, HSR Layout, Bengaluru, KA',
          pickupCity: 'Indore',
          deliveryCity: 'Bengaluru',
          truckNumber: 'MP-09-DF-4521',
          amount: 58000,
          amountInWords: 'Fifty Eight Thousand Rupees Only',
          goodsDescription: 'Office Furniture, Computers, Chairs',
          weight: '2500 Kgs',
          paymentMode: 'To Pay (COD)',
          lrNumber: '3426',
          invoiceNumber: '4098',
          receiptNumber: '2698',
          deliveryType: 'Office Delivery',
          status: 'Dispatched',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          customerName: 'Sanjay Gupta',
          phone: '7552554433',
          pickupAddress: 'M.P. Nagar Zone 2, Bhopal, MP',
          deliveryAddress: 'Flat 12, Navkar Residency, Pune, MH',
          pickupCity: 'Bhopal',
          deliveryCity: 'Pune',
          truckNumber: 'MH-12-QW-9900',
          amount: 35000,
          amountInWords: 'Thirty Five Thousand Rupees Only',
          goodsDescription: 'Household Shifting, 2 BHK materials',
          weight: '1200 Kgs',
          paymentMode: 'Cash',
          lrNumber: '3426',
          invoiceNumber: '4098',
          receiptNumber: '2698',
          deliveryType: 'Door Delivery',
          status: 'Pending',
          createdAt: new Date().toISOString()
        }
      ];

      for (const item of mockShipments) {
        if (isMongo()) {
          const Shipment = require('./models/shipment');
          await Shipment.create(item);
        } else {
          await fallbackDb.createShipment(item);
        }
      }
      console.log('✅ Mock shipments seeded in database.');
    }
  } catch (error) {
    console.error('❌ Failed to seed mock shipments:', error.message);
  }
};

// Connect to Database and start server setup
connectDB().then(async () => {
  // Seed the admin user and mock data
  await seedAdmin();
  await seedShipments();

  // Register API Routes
  app.use('/api', apiRoutes);

  // Serve static assets from frontend build directory in production/all environments (if built)
  const distPath = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(distPath));

  // Catch-all route to serve Index.html for Single Page App routing
  app.get('*', (req, res) => {
    // If it's an API request, return 404
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    // Otherwise send index.html if it exists, or a welcome message if the frontend is not yet built
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send(`
          <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #B30000;">SRL Group - Shree Ram Packers & Movers</h1>
            <p>Backend is running on port ${PORT}. Frontend assets are not yet compiled.</p>
            <p style="color: #64748B;">Please compile the frontend using "npm run build" in the frontend directory.</p>
          </div>
        `);
      }
    });
  });

  // Start Express listener
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API endpoints: http://localhost:${PORT}/api`);
    console.log(`🌍 Frontend URL: http://localhost:${PORT}`);
  });
});
