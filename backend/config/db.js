const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Simple Local JSON DB Fallback
class JsonDatabase {
  constructor() {
    this.filePath = path.join(__dirname, '..', 'db.json');
    this.init();
  }

  init() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({ shipments: [], users: [], payments: [] }, null, 2));
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading fallback DB:', err);
      return { shipments: [], users: [], payments: [] };
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('Error writing fallback DB:', err);
    }
  }

  async getShipments() {
    return this.read().shipments;
  }

  async createShipment(shipmentData) {
    const db = this.read();
    const newShipment = {
      _id: Date.now().toString(),
      ...shipmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.shipments.push(newShipment);
    this.write(db);
    return newShipment;
  }

  async updateShipment(id, shipmentData) {
    const db = this.read();
    const index = db.shipments.findIndex(s => s._id === id);
    if (index !== -1) {
      db.shipments[index] = {
        ...db.shipments[index],
        ...shipmentData,
        updatedAt: new Date().toISOString()
      };
      this.write(db);
      return db.shipments[index];
    }
    return null;
  }

  async getShipmentById(id) {
    const db = this.read();
    return db.shipments.find(s => s._id === id) || null;
  }

  async getUsers() {
    return this.read().users;
  }

  async createUser(userData) {
    const db = this.read();
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    this.write(db);
    return newUser;
  }

  async getUserByUsername(username) {
    const db = this.read();
    return db.users.find(u => u.username === username) || null;
  }
}

const fallbackDb = new JsonDatabase();
let isUsingMongoDB = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.log('⚠️  No MONGO_URI specified in environment. Running on local JSON file database (db.json).');
    isUsingMongoDB = false;
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('✅ Connected to MongoDB successfully.');
    isUsingMongoDB = true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Falling back to local JSON file database (db.json).');
    isUsingMongoDB = false;
  }
};

module.exports = {
  connectDB,
  isMongo: () => isUsingMongoDB,
  fallbackDb
};
