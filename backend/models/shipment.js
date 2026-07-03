const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  pickupAddress: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  pickupCity: { type: String, required: true },
  deliveryCity: { type: String, required: true },
  truckNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  amountInWords: { type: String, required: true },
  goodsDescription: { type: String, required: true },
  weight: { type: String, required: true },
  paymentMode: { type: String, required: true },
  lrNumber: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  receiptNumber: { type: String, required: true },
  deliveryType: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
ShipmentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Shipment', ShipmentSchema);
