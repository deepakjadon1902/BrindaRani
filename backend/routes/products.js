const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authenticate, adminOnly } = require('../middleware/auth');
const { normalizeStoredAssetUrl } = require('../utils/assetUrl');

const router = express.Router();

const validateClassification = async (payload) => {
  const category = await Category.findOne({ name: payload.category });
  if (!category) return 'Selected category does not exist';
  if (payload.subcategory && !category.subcategories.includes(payload.subcategory)) {
    return 'Selected subcategory does not belong to this category';
  }
  return null;
};

// GET /api/products - Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, search, trending, latest, vrindavanSpecial, sort } = req.query;
    let query = {};

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (trending === 'true') query.isTrending = true;
    if (latest === 'true') query.isLatest = true;
    if (vrindavanSpecial === 'true') query.isVrindavanSpecial = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { 'sizes.0.price': 1 };
    if (sort === 'price-high') sortOption = { 'sizes.0.price': -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/products/:id - Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/products - Create product (admin only)
router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (Array.isArray(payload.images)) {
      payload.images = payload.images.map((img) => normalizeStoredAssetUrl(img)).filter(Boolean);
    }
    const classificationError = await validateClassification(payload);
    if (classificationError) return res.status(400).json({ message: classificationError });
    const product = await Product.create(payload);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (Array.isArray(payload.images)) {
      payload.images = payload.images.map((img) => normalizeStoredAssetUrl(img)).filter(Boolean);
    }
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Product not found' });
    const classificationError = await validateClassification({ ...existing.toObject(), ...payload });
    if (classificationError) return res.status(400).json({ message: classificationError });
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
