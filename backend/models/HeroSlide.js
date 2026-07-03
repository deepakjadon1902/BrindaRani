const mongoose = require('mongoose');

const heroSlideSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  tag: { type: String, default: '', trim: true },
  image: { type: String, required: true },
  ctaLabel: { type: String, default: 'Shop Now', trim: true },
  ctaLink: { type: String, default: '/products', trim: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
