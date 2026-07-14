const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Settings = require('../models/Settings');
const { authenticate } = require('../middleware/auth');
const { sendOrderPlacedEmail, sendPaymentFailedEmail } = require('../utils/mailer');
const { syncOrderRecords } = require('../utils/orderRecords');

const router = express.Router();
const RAZORPAY_WEBHOOK_EVENTS = new Set(['payment.captured', 'payment.failed']);

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
  // Deployment secrets are authoritative; database settings are a legacy fallback.
  const key_id = process.env.RAZORPAY_KEY_ID || settings?.paymentKeyId;
  const key_secret = process.env.RAZORPAY_KEY_SECRET || settings?.paymentKeySecret;
  if (!key_id || !key_secret) {
    throw new Error('Razorpay keys are not configured');
  }
  if (process.env.NODE_ENV === 'production' && key_id.startsWith('rzp_test_')) {
    throw new Error('Razorpay is configured with a test key in production');
  }
  return { client: new Razorpay({ key_id, key_secret }), keyId: key_id };
};

const appendStatusHistoryOnce = (order, status, note) => {
  const alreadyLogged = order.statusHistory?.some((entry) => entry.status === status && entry.note === note);
  if (!alreadyLogged) order.statusHistory.push({ status, note });
};

// POST /api/payment/create-order - Create Razorpay order
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, orderData } = req.body;
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      return res.status(400).json({ message: 'A valid payment amount is required' });
    }
    if (orderData && Math.abs(Number(orderData.total) - numericAmount) > 0.01) {
      return res.status(400).json({ message: 'Order total does not match payment amount' });
    }

    const options = {
      amount: Math.round(numericAmount * 100), // Razorpay expects paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: { source: 'brindarani-web', userId: String(req.user._id) },
    };

    const { client: razorpay, keyId } = await getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create(options);

    let applicationOrder = null;
    if (orderData) {
      applicationOrder = await Order.create({
        ...orderData,
        userId: req.user._id,
        userName: req.user.name,
        orderCode: await generateOrderCode(),
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'RAZORPAY',
        customerEmail: orderData.customerEmail || req.user.email,
        customerPhone: orderData.customerPhone || req.user.phone || '',
        razorpayOrderId: razorpayOrder.id,
        statusHistory: [{ status: 'pending', note: 'Payment initiated' }],
      });
      await syncOrderRecords(applicationOrder);
    }

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: keyId,
      applicationOrderId: applicationOrder?._id,
      orderCode: applicationOrder?.orderCode,
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
    const keySecret = process.env.RAZORPAY_KEY_SECRET || settings?.paymentKeySecret;
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

    // Confirm the pending application order (idempotent with webhook processing)
    let order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (order && String(order.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Payment order does not belong to this user' });
    }
    if (!order) {
      order = new Order({ ...orderData, userId: req.user._id, userName: req.user.name, orderCode: await generateOrderCode(), customerEmail: orderData.customerEmail || req.user.email, customerPhone: orderData.customerPhone || req.user.phone || '', paymentMethod: 'RAZORPAY', razorpayOrderId: razorpay_order_id });
    }
    const newlyPaid = order.paymentStatus !== 'paid';
    order.status = 'confirmed';
    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentDetails = {
      ...order.paymentDetails,
      verificationSource: order.paymentDetails?.verificationSource || 'checkout_signature',
      signatureVerifiedAt: new Date(),
    };
    appendStatusHistoryOnce(order, 'confirmed', 'Payment signature verified; order confirmed');
    await order.save();
    await syncOrderRecords(order);

    try {
      if (newlyPaid) await sendOrderPlacedEmail(order);
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

const handleRazorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return res.status(503).json({ message: 'Webhook secret not configured' });
    const signature = req.get('x-razorpay-signature') || '';
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return res.status(401).json({ message: 'Invalid webhook signature' });
    }
    const payload = JSON.parse(rawBody.toString('utf8'));
    if (!RAZORPAY_WEBHOOK_EVENTS.has(payload.event)) {
      return res.json({ received: true });
    }

    const payment = payload.payload?.payment?.entity;
    const razorpayOrderId = payment?.order_id;
    if (!razorpayOrderId) return res.json({ received: true });
    const order = await Order.findOne({ razorpayOrderId });
    if (!order) return res.json({ received: true });

    if (payload.event === 'payment.captured') {
      const newlyPaid = order.paymentStatus !== 'paid';
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.razorpayPaymentId = payment.id || order.razorpayPaymentId;
      order.paymentDetails = {
        ...order.paymentDetails,
        verificationSource: 'razorpay_webhook',
        webhookEvent: payload.event,
        webhookPaymentId: payment.id || '',
        capturedAt: new Date(),
      };
      appendStatusHistoryOnce(order, 'confirmed', 'Payment confirmed by Razorpay webhook');
      await order.save();
      await syncOrderRecords(order);
      if (newlyPaid) try { await sendOrderPlacedEmail(order); } catch (err) { console.error('Webhook email error:', err); }
    } else if (payload.event === 'payment.failed') {
      const newlyFailed = order.paymentStatus !== 'failed';
      order.paymentStatus = 'failed';
      order.status = 'pending';
      order.razorpayPaymentId = payment.id || order.razorpayPaymentId;
      order.paymentDetails = {
        ...order.paymentDetails,
        verificationSource: 'razorpay_webhook',
        webhookEvent: payload.event,
        webhookPaymentId: payment.id || '',
        failureReason: payment.error_description || payment.error_reason || 'Payment failed',
        failedAt: new Date(),
      };
      appendStatusHistoryOnce(order, 'pending', 'Payment failed by Razorpay webhook');
      await order.save();
      await syncOrderRecords(order);
      if (newlyFailed) {
        try { await sendPaymentFailedEmail({ ...order.toObject(), reason: payment.error_description || payment.error_reason || 'Payment failed' }); } catch (err) { console.error('Failure email error:', err); }
      }
    }
    res.json({ received: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    res.status(400).json({ message: 'Invalid webhook payload' });
  }
};

// POST /api/payment/razorpay/webhook - Razorpay source of truth for asynchronous payment updates.
router.post('/razorpay/webhook', handleRazorpayWebhook);

// Backward-compatible legacy endpoint.
router.post('/webhook', handleRazorpayWebhook);

module.exports = router;
