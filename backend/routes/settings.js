const express = require('express');
const bcrypt = require('bcryptjs');
const Settings = require('../models/Settings');
const { authenticate, adminOnly } = require('../middleware/auth');
const { normalizeStoredAssetUrl } = require('../utils/assetUrl');

const router = express.Router();

const publicFields = (settings) => ({
  appName: settings.appName,
  motto: settings.motto,
  logoUrl: settings.logoUrl,
  faviconUrl: settings.faviconUrl,
  paymentEnabled: settings.paymentEnabled,
  paymentProvider: settings.paymentProvider,
  upiId: settings.upiId,
  shippingFee: settings.shippingFee,
  freeShippingThreshold: settings.freeShippingThreshold,
  notificationEmail: settings.notificationEmail,
  notificationWhatsapp: settings.notificationWhatsapp,
});

const ensureSettings = async () => {
  const existing = await Settings.findOne();
  if (existing) return existing;
  const created = await Settings.create({});
  return created;
};

// GET /api/settings - Public settings for the app
router.get('/', async (req, res) => {
  try {
    const settings = await ensureSettings();
    res.json(publicFields(settings));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/settings/admin - Full settings (admin only)
router.get('/admin', authenticate, adminOnly, async (req, res) => {
  try {
    const settings = await ensureSettings();
    res.json({
      ...publicFields(settings),
      paymentKeyId: settings.paymentKeyId,
      paymentKeySecret: settings.paymentKeySecret ? '***' : '',
      adminEmail: settings.adminEmail,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/settings - Update settings (admin only)
router.put('/', authenticate, adminOnly, async (req, res) => {
  try {
    const payload = { ...req.body };
    delete payload.adminPassword;
    delete payload.adminEmail;

    if (typeof payload.logoUrl === 'string') {
      payload.logoUrl = normalizeStoredAssetUrl(payload.logoUrl);
    }
    if (typeof payload.faviconUrl === 'string') {
      payload.faviconUrl = normalizeStoredAssetUrl(payload.faviconUrl);
    }

    const settings = await ensureSettings();
    Object.assign(settings, payload);
    await settings.save();
    res.json(publicFields(settings));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/settings/admin-credentials - Update admin email/password (admin only)
router.put('/admin-credentials', authenticate, adminOnly, async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;
    if (!adminEmail || !adminPassword) {
      return res.status(400).json({ message: 'Admin email and password are required' });
    }
    const settings = await ensureSettings();
    settings.adminEmail = String(adminEmail).trim();
    settings.adminPasswordHash = await bcrypt.hash(String(adminPassword), 10);
    await settings.save();
    res.json({ message: 'Admin credentials updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
