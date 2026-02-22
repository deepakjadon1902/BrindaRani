const express = require('express');
const Order = require('../models/Order');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

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

// POST /api/orders - Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      userId: req.user._id,
      userName: req.user.name,
    });
    res.status(201).json(order);
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
