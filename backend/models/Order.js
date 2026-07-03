const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  orderCode: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending' 
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentMethod: { type: String, required: true },
  paymentDetails: { type: Object, default: {} },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  address: { type: String, required: true },
  courierPartner: { type: String, default: '' },
  trackingId: { type: String, default: '' },
  trackingUrl: { type: String, default: '' },
  estimatedDelivery: { type: Date },
  statusHistory: [{
    status: { type: String, required: true },
    note: { type: String, default: '' },
    location: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
