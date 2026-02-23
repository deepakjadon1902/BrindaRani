const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (user) {
          // If user exists but signed up with password, link Google
          if (!user.googleId) {
            user.googleId = profile.id;
            user.isEmailVerified = true; // Google emails are verified
            if (!user.avatar || user.avatar.includes('ui-avatars.com')) {
              user.avatar = profile.photos?.[0]?.value || user.avatar;
            }
            await user.save();
          }
        } else {
          // Create new user from Google profile
          user = await User.create({
            name: profile.displayName,
            email,
            password: require('crypto').randomBytes(32).toString('hex'), // random password
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName)}&background=random`,
            isEmailVerified: true, // Google emails are pre-verified
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
