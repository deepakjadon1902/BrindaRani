const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD, // Gmail App Password (not regular password)
  },
});

/**
 * Send email verification link
 */
const sendVerificationEmail = async (email, token, baseUrl) => {
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"BrindaRani" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: '🙏 Verify your BrindaRani account',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #8B4513; text-align: center; font-size: 28px;">BrindaRani</h1>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">Sacred E-Commerce from Vrindavan</p>
        
        <div style="background: #FFF8F0; border-radius: 12px; padding: 30px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 15px;">Verify Your Email</h2>
          <p style="color: #666; margin-bottom: 25px;">
            Thank you for joining BrindaRani! Please verify your email address to complete your registration.
          </p>
          <a href="${verifyUrl}" 
             style="display: inline-block; background: #8B4513; color: white; padding: 14px 32px; 
                    border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            Verify Email Address
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            This link expires in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
        
        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
          © BrindaRani - Handcrafted from Vrindavan with ❤️
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
