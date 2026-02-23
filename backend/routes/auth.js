const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { sendVerificationEmail } = require('../utils/mailer');
const passport = require('../config/passport');

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, city, district, state, country, pincode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name, email, password, phone, address, city, district, state, country, pincode,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Send verification email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    try {
      await sendVerificationEmail(email, verificationToken, frontendUrl);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      // Don't block registration if email fails
    }

    const token = generateToken(user);
    res.status(201).json({ user, token, message: 'Registration successful! Please check your email to verify your account.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/verify-email?token=xxx
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Verification token is required' });

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired verification link' });

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/resend-verification
router.post('/resend-verification', authenticate, async (req, res) => {
  try {
    const user = req.user;
    if (user.isEmailVerified) return res.json({ message: 'Email is already verified' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    await sendVerificationEmail(user.email, verificationToken, frontendUrl);

    res.json({ message: 'Verification email sent!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.isBlocked) return res.status(403).json({ message: 'Account is blocked' });

    // If user signed up with Google and has no real password
    if (user.googleId && !await user.comparePassword(password)) {
      return res.status(401).json({ message: 'Please use Google Sign-In for this account' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      let admin = await User.findOne({ email, isAdmin: true });
      
      if (!admin) {
        admin = await User.create({
          name: 'Admin',
          email,
          password,
          isAdmin: true,
          isEmailVerified: true,
          avatar: '',
        });
      }

      const token = generateToken(admin);
      return res.json({ user: admin, token });
    }

    return res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/auth/google - Initiate Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

// GET /api/auth/google/callback - Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }),
  (req, res) => {
    const token = generateToken(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Redirect to frontend with token
    res.redirect(`${frontendUrl}/auth/google/callback?token=${token}`);
  }
);

// GET /api/auth/me - Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/profile - Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, address, city, district, state, country, pincode } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address, city, district, state, country, pincode },
      { new: true }
    );
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
