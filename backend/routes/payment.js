const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Settings = require('../models/Settings');
const { authenticate } = require('../middleware/auth');
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

const getRazorpayClient = async () => {
  const settings = await Settings.findOne();
  const key_id = settings?.paymentKeyId || process.env.RAZORPAY_KEY_ID;
  const key_secret = settings?.paymentKeySecret || process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys are not configured');
  }
  return new Razorpay({ key_id, key_secret });
};

// POST /api/payment/create-order - Create Razorpay order
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const razorpay = await getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// POST /api/payment/verify - Verify Razorpay payment signature
router.post('/verify', authenticate, async (req, res) => {
  const orderData = req.body?.orderData;
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const settings = await Settings.findOne();
    const keySecret = settings?.paymentKeySecret || process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ message: 'Razorpay secret not configured' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Create order in DB with payment details
    const orderCode = await generateOrderCode();
    const order = await Order.create({
      ...orderData,
      userId: req.user._id,
      userName: req.user.name,
      status: 'paid',
      paymentStatus: 'paid',
      orderCode,
      customerEmail: orderData.customerEmail || req.user.email,
      customerPhone: orderData.customerPhone || req.user.phone || '',
      paymentMethod: 'RAZORPAY',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    try {
      await sendOrderPlacedEmail(order);
    } catch (err) {
      console.error('Order email error:', err);
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Payment verify error:', error);
    try {
      await sendPaymentFailedEmail({
        customerEmail: req.user?.email,
        userName: req.user?.name,
        orderCode: '',
        total: orderData?.total || 0,
        paymentMethod: 'RAZORPAY',
        reason: error?.message || 'Payment verification failed',
        items: orderData?.items || [],
      });
    } catch (err) {
      console.error('Payment failed email error:', err);
    }
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;
