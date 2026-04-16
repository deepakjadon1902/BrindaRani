const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  appName: { type: String, default: 'Brindarani' },
  motto: { type: String, default: 'Sacred E-Commerce from Vrindavan' },
  logoUrl: { type: String, default: '' },
  faviconUrl: { type: String, default: '' },

  paymentEnabled: { type: Boolean, default: true },
  paymentProvider: { type: String, default: 'razorpay' },
  paymentKeyId: { type: String, default: '' },
  paymentKeySecret: { type: String, default: '' },
  upiId: { type: String, default: '' },
  shippingFee: { type: Number, default: 50 },
  freeShippingThreshold: { type: Number, default: 500 },

  notificationEmail: { type: String, default: '' },
  notificationWhatsapp: { type: String, default: '' },

  adminEmail: { type: String, default: '' },
  adminPasswordHash: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
