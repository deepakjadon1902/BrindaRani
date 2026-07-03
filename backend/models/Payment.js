const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  orderCode: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending', index: true },
  provider: { type: String, default: '' },
  gatewayOrderId: { type: String, default: '', index: true },
  gatewayPaymentId: { type: String, default: '', index: true },
  failureReason: { type: String, default: '' },
  verifiedAt: { type: Date },
  details: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
