const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const passport = require('./config/passport');
const Order = require('./models/Order');
const Product = require('./models/Product');
const Category = require('./models/Category');
const { syncOrderRecords } = require('./utils/orderRecords');

const app = express();
mongoose.set('bufferCommands', false);

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isLocalDevelopmentOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || isLocalDevelopmentOrigin(origin)) {
      return callback(null, true);
    }
    console.warn(`CORS rejected origin: ${origin}`);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '6mb' }));
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

let reconnectTimer = null;
let isConnecting = false;

const scheduleReconnect = (delay = 10000) => {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void connectDatabase();
  }, delay);
  reconnectTimer.unref?.();
};

const connectDatabase = async () => {
  if (isConnecting || mongoose.connection.readyState === 1) return;
  isConnecting = true;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
      socketTimeoutMS: 20000,
    });
    console.log('MongoDB Atlas connected');
    try {
      const orders = await Order.find();
      await Promise.all(orders.map(syncOrderRecords));
      console.log(`Payment and shipment records synchronized: ${orders.length}`);
    } catch (syncError) {
      console.error('Payment/shipment backfill failed:', syncError.message);
    }
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    scheduleReconnect();
  } finally {
    isConnecting = false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.error('MongoDB disconnected; scheduling reconnect');
  scheduleReconnect(3000);
});

void connectDatabase();

app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'degraded',
    database: connected ? 'connected' : 'unavailable',
    message: connected ? 'Brindarani API is ready' : 'Database connection is unavailable',
  });
});

const normalizeSiteUrl = () => (
  process.env.SITE_URL ||
  process.env.FRONTEND_URL ||
  'https://brindarani.com'
).replace(/\/+$/, '');

const escapeXml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const sitemapEntry = ({ loc, lastmod, changefreq, priority }) => [
  '  <url>',
  `    <loc>${escapeXml(loc)}</loc>`,
  lastmod ? `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '',
  changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
  priority ? `    <priority>${priority}</priority>` : '',
  '  </url>',
].filter(Boolean).join('\n');

app.get('/robots.txt', (req, res) => {
  const siteUrl = normalizeSiteUrl();
  res.type('text/plain').send([
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /cart',
    'Disallow: /checkout',
    'Disallow: /profile',
    'Disallow: /my-orders',
    'Disallow: /login',
    'Disallow: /register',
    'Disallow: /wishlist',
    'Disallow: /track-order',
    'Disallow: /verify-email',
    'Disallow: /auth/',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n'));
});

app.get('/sitemap.xml', async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).type('text/plain').send('Sitemap temporarily unavailable: database is not connected.');
  }

  try {
    const siteUrl = normalizeSiteUrl();
    const [products, categories] = await Promise.all([
      Product.find({}, '_id updatedAt createdAt').sort({ updatedAt: -1 }).lean(),
      Category.find({}, 'name updatedAt createdAt').sort({ name: 1 }).lean(),
    ]);

    const now = new Date().toISOString();
    const urls = [
      sitemapEntry({ loc: `${siteUrl}/`, lastmod: now, changefreq: 'daily', priority: '1.0' }),
      sitemapEntry({ loc: `${siteUrl}/products`, lastmod: now, changefreq: 'daily', priority: '0.9' }),
      sitemapEntry({ loc: `${siteUrl}/about`, lastmod: now, changefreq: 'monthly', priority: '0.6' }),
      sitemapEntry({ loc: `${siteUrl}/contact`, lastmod: now, changefreq: 'monthly', priority: '0.5' }),
      sitemapEntry({ loc: `${siteUrl}/custom-design`, lastmod: now, changefreq: 'monthly', priority: '0.6' }),
      ...categories.map((category) => sitemapEntry({
        loc: `${siteUrl}/category/${encodeURIComponent(category.name)}`,
        lastmod: category.updatedAt || category.createdAt || now,
        changefreq: 'weekly',
        priority: '0.8',
      })),
      ...products.map((product) => sitemapEntry({
        loc: `${siteUrl}/product/${product._id}`,
        lastmod: product.updatedAt || product.createdAt || now,
        changefreq: 'weekly',
        priority: '0.8',
      })),
    ];

    res.type('application/xml').send([
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls.join('\n'),
      '</urlset>',
      '',
    ].join('\n'));
  } catch (error) {
    res.status(500).type('text/plain').send(`Failed to generate sitemap: ${error.message}`);
  }
});

app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database temporarily unavailable. Check MongoDB Atlas Network Access and try again.',
      code: 'DATABASE_UNAVAILABLE',
    });
  }
  next();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/hero-slides', require('./routes/heroSlides'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/shipments', require('./routes/shipments'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
