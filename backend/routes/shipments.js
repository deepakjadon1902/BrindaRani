const express = require('express');
const Shipment = require('../models/Shipment');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();
router.get('/', authenticate, adminOnly, async (req, res) => {
  try { res.json(await Shipment.find().sort({ createdAt: -1 }).lean()); }
  catch (error) { res.status(500).json({ message: error.message }); }
});
module.exports = router;
