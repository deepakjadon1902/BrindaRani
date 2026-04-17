const express = require('express');
const Category = require('../models/Category');
const { authenticate, adminOnly } = require('../middleware/auth');
const { normalizeStoredAssetUrl } = require('../utils/assetUrl');

const router = express.Router();

// GET /api/categories - Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/categories - Create category (admin)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (typeof payload.image === 'string') {
      payload.image = normalizeStoredAssetUrl(payload.image);
    }
    const category = await Category.create(payload);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/categories/:id - Update category (admin)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (typeof payload.image === 'string') {
      payload.image = normalizeStoredAssetUrl(payload.image);
    }
    const category = await Category.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/categories/:id - Delete category (admin)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
