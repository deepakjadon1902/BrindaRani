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

const normalizeApiPublicUrl = () => (
  process.env.API_PUBLIC_URL ||
  process.env.BACKEND_URL ||
  'https://brindarani.onrender.com'
).replace(/\/+$/, '');

const escapeXml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const publicPageRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/contact', changefreq: 'monthly', priority: '0.5' },
  { path: '/custom-design', changefreq: 'monthly', priority: '0.6' },
];

const formatLastmod = (value) => {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const sitemapEntry = ({ loc, lastmod, changefreq, priority, images = [] }) => [
  '  <url>',
  `    <loc>${escapeXml(loc)}</loc>`,
  lastmod ? `    <lastmod>${formatLastmod(lastmod)}</lastmod>` : '',
  changefreq ? `    <changefreq>${changefreq}</changefreq>` : '',
  priority ? `    <priority>${priority}</priority>` : '',
  ...images.filter(Boolean).map((image) => [
    '    <image:image>',
    `      <image:loc>${escapeXml(image.loc)}</image:loc>`,
    image.title ? `      <image:title>${escapeXml(image.title)}</image:title>` : '',
    '    </image:image>',
  ].filter(Boolean).join('\n')),
  '  </url>',
].filter(Boolean).join('\n');

const absoluteAssetUrl = (siteUrl, value) => {
  if (!value || typeof value !== 'string') return '';
  const normalized = value.trim().replace(/\\/g, '/');
  if (!normalized || normalized.startsWith('data:')) return '';
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) return normalized;
  if (normalized.startsWith('/uploads/')) return `${normalizeApiPublicUrl()}${normalized}`;
  if (normalized.startsWith('/')) return `${siteUrl}${normalized}`;
  if (normalized.startsWith('uploads/')) return `${normalizeApiPublicUrl()}/${normalized}`;
  return `${siteUrl}/${normalized}`;
};

const buildSitemapXml = ({ siteUrl, products = [], categories = [], generatedAt = new Date() }) => {
  const pageEntries = publicPageRoutes.map((page) => sitemapEntry({
    loc: `${siteUrl}${page.path === '/' ? '/' : page.path}`,
    lastmod: generatedAt,
    changefreq: page.changefreq,
    priority: page.priority,
  }));

  const categoryEntries = categories.map((category) => sitemapEntry({
    loc: `${siteUrl}/category/${encodeURIComponent(category.name)}`,
    lastmod: category.updatedAt || category.createdAt || generatedAt,
    changefreq: 'weekly',
    priority: '0.8',
    images: category.image ? [{
      loc: absoluteAssetUrl(siteUrl, category.image),
      title: category.name,
    }] : [],
  }));

  const productEntries = products.map((product) => sitemapEntry({
    loc: `${siteUrl}/product/${product._id}`,
    lastmod: product.updatedAt || product.createdAt || generatedAt,
    changefreq: 'weekly',
    priority: '0.8',
    images: Array.isArray(product.images)
      ? product.images.map((image) => ({
          loc: absoluteAssetUrl(siteUrl, image),
          title: product.name,
        }))
      : [],
  }));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    [...pageEntries, ...categoryEntries, ...productEntries].join('\n'),
    '</urlset>',
    '',
  ].join('\n');
};

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
  const siteUrl = normalizeSiteUrl();
  const generatedAt = new Date();
  res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  try {
    if (mongoose.connection.readyState !== 1) {
      res.set('X-Sitemap-Warning', 'database-unavailable');
      return res.type('application/xml').send(buildSitemapXml({ siteUrl, generatedAt }));
    }

    const [products, categories] = await Promise.all([
      Product.find({}, '_id name images updatedAt createdAt').sort({ updatedAt: -1 }).lean(),
      Category.find({}, 'name image updatedAt createdAt').sort({ name: 1 }).lean(),
    ]);

    res.type('application/xml').send(buildSitemapXml({ siteUrl, products, categories, generatedAt }));
  } catch (error) {
    console.error('Failed to generate dynamic sitemap:', error.message);
    res.set('X-Sitemap-Warning', 'dynamic-generation-failed');
    res.type('application/xml').send(buildSitemapXml({ siteUrl, generatedAt }));
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
