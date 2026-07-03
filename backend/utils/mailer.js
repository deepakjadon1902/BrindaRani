const nodemailer = require('nodemailer');

let smtpTransporter;

const getSmtpTransporter = () => {
  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.SMTP_EMAIL, pass: process.env.SMTP_PASSWORD },
    });
  }
  return smtpTransporter;
};

const sendEmail = async ({ to, subject, html }) => {
  if (!to) return null;
  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: `Brindarani <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`,
        to: [to], subject, html,
        ...(process.env.RESEND_REPLY_TO ? { reply_to: process.env.RESEND_REPLY_TO } : {}),
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || `Resend request failed (${response.status})`);
    console.log('Email sent with Resend:', { id: result.id, subject });
    return result;
  }
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) throw new Error('Email provider is not configured');
  return getSmtpTransporter().sendMail({ from: `"Brindarani" <${process.env.SMTP_EMAIL}>`, to, subject, html });
};

/**
 * Send email verification link
 */
const formatCurrency = (value) => {
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
  } catch {
    return `Rs ${value}`;
  }
};

const renderItemsTable = (items = []) => {
  if (!items.length) return '';
  const rows = items.map((item) => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #f0e8dd;">${item.productName}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #f0e8dd; text-align: center;">${item.size}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #f0e8dd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #f0e8dd; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join('');
  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <thead>
        <tr style="text-align: left; color: #8B4513;">
          <th style="padding: 8px 0; border-bottom: 2px solid #f0e8dd;">Item</th>
          <th style="padding: 8px 0; border-bottom: 2px solid #f0e8dd; text-align: center;">Size</th>
          <th style="padding: 8px 0; border-bottom: 2px solid #f0e8dd; text-align: center;">Qty</th>
          <th style="padding: 8px 0; border-bottom: 2px solid #f0e8dd; text-align: right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

const sendVerificationEmail = async (email, token, baseUrl) => {
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Brindarani" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: '🙏 Verify your Brindarani account',
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #8B4513; text-align: center; font-size: 28px;">Brindarani</h1>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">Sacred E-Commerce from Vrindavan</p>
        
        <div style="background: #FFF8F0; border-radius: 12px; padding: 30px; text-align: center;">
          <h2 style="color: #333; margin-bottom: 15px;">Verify Your Email</h2>
          <p style="color: #666; margin-bottom: 25px;">
            Thank you for joining Brindarani! Please verify your email address to complete your registration.
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
          © Brindarani - Handcrafted from Vrindavan with ❤️
        </p>
      </div>
    `,
  };

  await sendEmail(mailOptions);
};

const sendOrderPlacedEmail = async (order) => {
  if (!order?.customerEmail) return;
  const mailOptions = {
    from: `"Brindarani" <${process.env.SMTP_EMAIL}>`,
    to: order.customerEmail,
    subject: `Order Confirmed - #${order.orderCode}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background: #fff;">
        <h1 style="color: #8B4513; text-align: center; font-size: 28px;">Brindarani</h1>
        <p style="text-align: center; color: #666; margin-bottom: 24px;">Sacred E-Commerce from Vrindavan</p>
        <div style="background: #FFF8F0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #333; margin: 0 0 12px;">Thank you for your order!</h2>
          <p style="color: #666; margin: 0 0 16px;">
            Hi ${order.userName || 'there'}, your order has been placed successfully.
          </p>
          <p style="margin: 0 0 10px;"><strong>Order ID:</strong> ${order.orderCode}</p>
          <p style="margin: 0 0 10px;"><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</p>
          <p style="margin: 0 0 16px;"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
          ${renderItemsTable(order.items)}
          <p style="margin: 16px 0 0; color: #666;">
            <strong>Shipping Address:</strong><br/>
            ${order.address}
          </p>
        </div>
        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 24px;">
          © Brindarani - Handcrafted from Vrindavan with ❤️
        </p>
      </div>
    `,
  };
  await sendEmail(mailOptions);
};

const sendPaymentFailedEmail = async (payload) => {
  if (!payload?.customerEmail) return;
  const mailOptions = {
    from: `"Brindarani" <${process.env.SMTP_EMAIL}>`,
    to: payload.customerEmail,
    subject: `Payment Failed - Order ${payload.orderCode || ''}`.trim(),
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px 20px; background: #fff;">
        <h1 style="color: #8B4513; text-align: center; font-size: 28px;">Brindarani</h1>
        <p style="text-align: center; color: #666; margin-bottom: 24px;">Payment Failed</p>
        <div style="background: #FFF8F0; border-radius: 12px; padding: 24px;">
          <p style="color: #666; margin: 0 0 12px;">
            Hi ${payload.userName || 'there'}, your payment could not be completed.
          </p>
          <p style="margin: 0 0 10px;"><strong>Order ID:</strong> ${payload.orderCode || '—'}</p>
          <p style="margin: 0 0 10px;"><strong>Payment Method:</strong> ${payload.paymentMethod}</p>
          <p style="margin: 0 0 10px;"><strong>Total:</strong> ${formatCurrency(payload.total || 0)}</p>
          <p style="margin: 0; color: #b45309;"><strong>Reason:</strong> ${payload.reason}</p>
        </div>
        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 24px;">
          If you need help, reply to this email and we’ll assist you.
        </p>
      </div>
    `,
  };
  await sendEmail(mailOptions);
};

const sendOrderStatusEmail = async (order) => {
  if (!order?.customerEmail) return;
  const tracking = order.trackingId ? `
    <p><strong>Courier:</strong> ${order.courierPartner || 'Courier partner'}</p>
    <p><strong>Tracking ID:</strong> ${order.trackingId}</p>
    ${order.trackingUrl ? `<p><a href="${order.trackingUrl}" style="color:#8B4513">Track your shipment</a></p>` : ''}
  ` : '';
  await sendEmail({
    from: `"Brindarani" <${process.env.SMTP_EMAIL}>`,
    to: order.customerEmail,
    subject: `Order #${order.orderCode} update: ${String(order.status).replaceAll('_', ' ')}`,
    html: `<div style="font-family:Georgia,serif;max-width:600px;margin:auto;padding:32px 20px">
      <h1 style="color:#8B4513;text-align:center">Brindarani</h1>
      <div style="background:#FFF8F0;border-radius:12px;padding:24px">
        <h2>Your order is ${String(order.status).replaceAll('_', ' ')}</h2>
        <p>Hi ${order.userName || 'there'}, order <strong>#${order.orderCode}</strong> has a new update.</p>
        ${tracking}
        ${order.estimatedDelivery ? `<p><strong>Estimated delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</p>` : ''}
      </div></div>`,
  });
};

module.exports = { sendVerificationEmail, sendOrderPlacedEmail, sendPaymentFailedEmail, sendOrderStatusEmail, sendEmail };

