const mongoose = require('mongoose');

const shipmentHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String, default: '' },
  location: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const shipmentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  orderCode: { type: String, required: true, index: true },
  courierPartner: { type: String, default: '' },
  trackingId: { type: String, default: '', index: true },
  trackingUrl: { type: String, default: '' },
  estimatedDelivery: { type: Date },
  status: { type: String, required: true, default: 'pending', index: true },
  history: { type: [shipmentHistorySchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Shipment', shipmentSchema);
