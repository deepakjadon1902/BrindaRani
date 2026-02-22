const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, default: '' },
  subcategories: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
