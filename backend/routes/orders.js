const express = require('express');
const Order = require('../models/Order');
const { authenticate, adminOnly } = require('../middleware/auth');
const { sendOrderPlacedEmail, sendPaymentFailedEmail } = require('../utils/mailer');

const router = express.Router();

const generateOrderCode = async () => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const existing = await Order.findOne({ orderCode: code }).lean();
    if (!existing) return code;
  }
  return `${Date.now()}`.slice(-6);
};

const publicOrderFields = (order) => ({
  orderCode: order.orderCode,
  status: order.status,
  paymentStatus: order.paymentStatus,
  paymentMethod: order.paymentMethod,
  items: order.items,
  total: order.total,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

// GET /api/orders - Get all orders (admin) or user's orders
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};
    if (!req.user.isAdmin) {
      query.userId = req.user._id;
    }
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/track/:code - Track order (public)
router.get('/track/:code', async (req, res) => {
  try {
    const order = await Order.findOne({ orderCode: req.params.code }).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(publicOrderFields(order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders - Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const orderCode = await generateOrderCode();
    const paymentMethod = String(req.body.paymentMethod || '').toUpperCase();
    const paymentStatus = paymentMethod === 'UPI' ? 'pending' : 'paid';
    const status = paymentStatus === 'paid' ? 'paid' : 'pending';
    const order = await Order.create({
      ...req.body,
      orderCode,
      status,
      paymentStatus,
      userId: req.user._id,
      userName: req.user.name,
      customerEmail: req.body.customerEmail || req.user.email,
      customerPhone: req.body.customerPhone || req.user.phone || '',
    });
    try {
      await sendOrderPlacedEmail(order);
    } catch (err) {
      console.error('Order email error:', err);
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/orders/payment-failed - Send payment failed email
router.post('/payment-failed', authenticate, async (req, res) => {
  try {
    const payload = {
      customerEmail: req.user.email,
      userName: req.user.name,
      orderCode: req.body.orderCode || '',
      total: req.body.total || 0,
      paymentMethod: req.body.paymentMethod || 'RAZORPAY',
      reason: req.body.reason || 'Payment verification failed',
      items: req.body.items || [],
    };
    await sendPaymentFailedEmail(payload);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/orders/:id/status - Update order status (admin)
router.put('/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
