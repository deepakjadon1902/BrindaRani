const express = require('express');
const HeroSlide = require('../models/HeroSlide');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.json(await HeroSlide.find({ isActive: true }).sort({ order: 1, createdAt: 1 }));
  }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.get('/admin', authenticate, adminOnly, async (req, res) => {
  try { res.json(await HeroSlide.find().sort({ order: 1, createdAt: 1 })); }
  catch (error) { res.status(500).json({ message: error.message }); }
});

router.post('/', authenticate, adminOnly, async (req, res) => {
  try { res.status(201).json(await HeroSlide.create(req.body)); }
  catch (error) { res.status(400).json({ message: error.message }); }
});

router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!slide) return res.status(404).json({ message: 'Hero slide not found' });
    res.json(slide);
  } catch (error) { res.status(400).json({ message: error.message }); }
});

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Hero slide not found' });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ message: error.message }); }
});

module.exports = router;
