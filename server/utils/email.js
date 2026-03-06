const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (to, resetLink) => {
  const mailOptions = {
    from: `"Admin Panel" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset for your admin account.</p>
      <p>Click the link below to reset your password. This link will expire in 1 hour.</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };