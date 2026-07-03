const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { isMongo, fallbackDb } = require('../config/db');
const Shipment = require('../models/shipment');
const User = require('../models/user');
const { extractShipmentDetails } = require('../services/openaiService');
const { syncShipmentToSheets } = require('../services/sheetsService');
const { generatePDFBuffer, getHTMLTemplate } = require('../services/pdfService');

// Authentication JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'srl_group_logistics_secret_key_2026';

// Helper methods to abstract DB switching
const getShipments = async () => {
  if (isMongo()) {
    return await Shipment.find().sort({ createdAt: -1 });
  } else {
    const list = await fallbackDb.getShipments();
    return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

const getShipmentById = async (id) => {
  if (isMongo()) {
    return await Shipment.findById(id);
  } else {
    return await fallbackDb.getShipmentById(id);
  }
};

const createShipment = async (data) => {
  if (isMongo()) {
    const shipment = new Shipment(data);
    return await shipment.save();
  } else {
    return await fallbackDb.createShipment(data);
  }
};

const updateShipment = async (id, data) => {
  if (isMongo()) {
    return await Shipment.findByIdAndUpdate(id, data, { new: true });
  } else {
    return await fallbackDb.updateShipment(id, data);
  }
};

const findUserByUsername = async (username) => {
  if (isMongo()) {
    return await User.findOne({ username });
  } else {
    return await fallbackDb.getUserByUsername(username);
  }
};

// ----------------------------------------------------
// MIDDLEWARES
// ----------------------------------------------------
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate with a valid session.' });
  }
};

// ----------------------------------------------------
// AUTHENTICATION ROUTES
// ----------------------------------------------------
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get current logged in user details
router.get('/auth/me', authenticate, async (req, res) => {
  res.json({ user: { id: req.userId } });
});

// ----------------------------------------------------
// SHIPMENT CRUD ROUTES
// ----------------------------------------------------
router.get('/shipments', authenticate, async (req, res) => {
  try {
    const list = await getShipments();
    res.json(list);
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({ error: 'Failed to retrieve shipments' });
  }
});

router.get('/shipments/:id', authenticate, async (req, res) => {
  try {
    const shipment = await getShipmentById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(shipment);
  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(500).json({ error: 'Failed to retrieve shipment' });
  }
});

router.post('/shipments', authenticate, async (req, res) => {
  try {
    const newShip = await createShipment(req.body);
    
    // 1. Auto-sync with Google Sheets (runs async in background)
    syncShipmentToSheets(newShip).catch(err => console.error('Auto Google Sheet sync failed:', err));
    
    // 2. Trigger n8n webhook if configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      axios.post(n8nWebhookUrl, newShip)
        .then(() => console.log('✅ Triggered n8n webhook for shipment creation'))
        .catch(err => console.error('❌ Failed to trigger n8n webhook:', err.message));
    }

    res.status(201).json(newShip);
  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(400).json({ error: error.message || 'Failed to create shipment' });
  }
});

router.put('/shipments/:id', authenticate, async (req, res) => {
  try {
    const updated = await updateShipment(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    
    // Sync update to sheets
    syncShipmentToSheets(updated).catch(err => console.error('Update Google Sheet sync failed:', err));

    res.json(updated);
  } catch (error) {
    console.error('Update shipment error:', error);
    res.status(400).json({ error: 'Failed to update shipment' });
  }
});

// ----------------------------------------------------
// AI EXTRACTION ROUTE
// ----------------------------------------------------
router.post('/ai/extract', authenticate, async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'WhatsApp text content is required' });
  }

  try {
    const extractedData = await extractShipmentDetails(text);
    res.json(extractedData);
  } catch (error) {
    console.error('AI extract route error:', error);
    res.status(500).json({ error: 'AI Extraction failed' });
  }
});

// ----------------------------------------------------
// GOOGLE SHEETS MANUAL SYNC
// ----------------------------------------------------
router.post('/shipments/:id/sync', authenticate, async (req, res) => {
  try {
    const shipment = await getShipmentById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    const success = await syncShipmentToSheets(shipment);
    if (success) {
      res.json({ message: 'Successfully synced to Google Sheets' });
    } else {
      res.status(500).json({ error: 'Google Sheets sync failed. Please check backend logs/credentials.' });
    }
  } catch (error) {
    console.error('Manual sync route error:', error);
    res.status(500).json({ error: 'Failed to execute Google Sheets sync' });
  }
});

// ----------------------------------------------------
// PDF GENERATION ROUTE
// ----------------------------------------------------
router.get('/shipments/:id/pdf/:type', authenticate, async (req, res) => {
  const { id, type } = req.params;
  try {
    const shipment = await getShipmentById(id);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const pdfBuffer = await generatePDFBuffer(type, shipment);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=SRL_${type.toUpperCase()}_${shipment.lrNumber || shipment._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation route error:', error);
    res.status(500).json({ error: 'Failed to generate PDF document.' });
  }
});

// HTML Preview template route
router.get('/shipments/:id/html/:type', authenticate, async (req, res) => {
  const { id, type } = req.params;
  try {
    const shipment = await getShipmentById(id);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    const html = getHTMLTemplate(type, shipment);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    console.error('HTML Generation route error:', error);
    res.status(500).json({ error: 'Failed to generate HTML preview.' });
  }
});

module.exports = router;
