const express = require('express');
const User = require('../models/User');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/users/:id/toggle-block - Toggle user block (admin)
router.put('/:id/toggle-block', authenticate, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
