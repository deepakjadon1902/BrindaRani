const express = require('express');
const Payment = require('../models/Payment');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.get('/', authenticate, adminOnly, async (req, res) => {
  try { res.json(await Payment.find().sort({ createdAt: -1 }).lean()); }
  catch (error) { res.status(500).json({ message: error.message }); }
});
module.exports = router;
