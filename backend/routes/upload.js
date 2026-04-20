const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticate, adminOnly } = require('../middleware/auth');
const { hasCloudinaryConfig, uploadImageBuffer } = require('../utils/cloudinary');

const router = express.Router();

const useCloudinary = hasCloudinaryConfig();
const allowedFolders = new Set(['categories', 'products', 'profiles', 'site', 'misc']);
const getRequestedFolder = (req, fallback) => {
  const raw = String(req.query.folder || '').trim().toLowerCase();
  if (raw && allowedFolders.has(raw)) return raw;
  return fallback;
};

// Configure multer storage (Cloudinary -> memory, fallback -> disk)
const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      },
    });

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|ico/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

// POST /api/upload - Upload images (admin only)
router.post('/', authenticate, adminOnly, upload.array('images', 10), async (req, res) => {
  try {
    const folder = getRequestedFolder(req, 'misc');
    const urls = useCloudinary
      ? await Promise.all(
          req.files.map(async (file) => {
            const result = await uploadImageBuffer(file.buffer, { folder });
            return result.secure_url;
          })
        )
      : req.files.map((file) => `/uploads/${file.filename}`);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/upload/profile - Upload profile image (authenticated user)
router.post('/profile', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const url = useCloudinary
      ? (await uploadImageBuffer(req.file.buffer, { folder: 'profiles' })).secure_url
      : `/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/upload/favicon - Upload favicon/logo (admin only)
router.post('/favicon', authenticate, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const url = useCloudinary
      ? (await uploadImageBuffer(req.file.buffer, { folder: 'site' })).secure_url
      : `/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
