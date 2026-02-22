// Run this script once to seed categories into MongoDB
// Usage: node seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('./models/Category');

const categories = [
  { name: 'Puja Items', image: '', subcategories: ['Diyas & Lamps', 'Incense & Dhoop', 'Puja Thalis', 'Bells & Conch'] },
  { name: 'Idols & Murtis', image: '', subcategories: ['Krishna Idols', 'Radha Rani', 'Laddu Gopal', 'Ganesh Idols'] },
  { name: 'Vrindavan Specials', image: '', subcategories: ['Tulsi Malas', 'Chandan Products', 'Holy Water', 'Prasad Items'] },
  { name: 'Dress & Accessories', image: '', subcategories: ['Deity Dresses', 'Jewelry', 'Crowns & Mukuts', 'Flutes'] },
  { name: 'Books & Media', image: '', subcategories: ['Bhagavad Gita', 'Devotional Books', 'Bhajan CDs', 'Calendars'] },
  { name: 'Home Decor', image: '', subcategories: ['Wall Hangings', 'Photo Frames', 'Rangoli', 'Torans'] },
  { name: 'Havan Samagri', image: '', subcategories: ['Havan Kund', 'Samagri Packs', 'Ghee & Oils', 'Sacred Wood'] },
  { name: 'Rudraksha', image: '', subcategories: ['1 Mukhi', '5 Mukhi', 'Rudraksha Mala', 'Rudraksha Bracelets'] },
  { name: 'Gemstones', image: '', subcategories: ['Ruby', 'Emerald', 'Yellow Sapphire', 'Pearl'] },
  { name: 'Spiritual Gifts', image: '', subcategories: ['Gift Hampers', 'Festival Combos', 'Wedding Gifts', 'Return Gifts'] },
  { name: 'Tulsi Products', image: '', subcategories: ['Tulsi Mala', 'Tulsi Kanthi', 'Tulsi Beads', 'Tulsi Plants'] },
  { name: 'Chandan & Kumkum', image: '', subcategories: ['Chandan Tika', 'Kumkum Powder', 'Sindoor', 'Roli'] },
  { name: 'Brass & Copper Items', image: '', subcategories: ['Brass Diyas', 'Copper Lota', 'Brass Bells', 'Panchpatra'] },
  { name: 'Marble & Stone Idols', image: '', subcategories: ['Marble Ganesh', 'Stone Krishna', 'Marble Lakshmi', 'Marble Shiva'] },
  { name: 'Silver Articles', image: '', subcategories: ['Silver Idols', 'Silver Coins', 'Silver Pooja Items', 'Silver Jewelry'] },
  { name: 'Flowers & Garlands', image: '', subcategories: ['Artificial Garlands', 'Flower Strings', 'Rose Petals', 'Marigold Garlands'] },
  { name: 'Deity Ornaments', image: '', subcategories: ['Crowns & Mukuts', 'Necklaces', 'Earrings', 'Bangles'] },
  { name: 'Dhoop & Agarbatti', image: '', subcategories: ['Dhoop Sticks', 'Agarbatti Packs', 'Dhoop Cones', 'Sambrani'] },
  { name: 'Yantra & Kavach', image: '', subcategories: ['Shree Yantra', 'Navgraha Yantra', 'Kavach Lockets', 'Protection Yantras'] },
  { name: 'Festival Specials', image: '', subcategories: ['Diwali Combos', 'Navratri Specials', 'Janmashtami Items', 'Holi Colors'] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log('✅ Categories seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
