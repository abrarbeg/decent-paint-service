const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Admin = require('../models/Admin');
const PasswordResetToken = require('../models/PasswordResetToken');
const { sendResetEmail } = require('../utils/email');

// -------------------- LOGIN --------------------
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log("LOGIN REQUEST BODY:", req.body);

  try {
    const admin = await Admin.findOne({ username });
    console.log("ADMIN FROM DB:", admin);

    if (!admin) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password mismatch" });
    }

    res.status(200).json({
      message: "Login successful",
      user: admin.username
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- FORGOT PASSWORD --------------------
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    console.log("🔍 Forgot password requested for:", email);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Don't reveal if email exists
      console.log("⚠️ Admin not found with email:", email);
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    console.log("✅ Admin found:", admin.email);

    // Delete any existing tokens for this admin
    await PasswordResetToken.deleteMany({ adminId: admin._id });

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Save token with 1-hour expiry
    await PasswordResetToken.create({
      adminId: admin._id,
      token,
      expiresAt: new Date(Date.now() + 3600000) // 1 hour
    });

    const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password?token=${token}`;
    console.log("📧 Attempting to send email to:", admin.email);

    try {
      await sendResetEmail(admin.email, resetLink);
      console.log("✅ Email sent successfully");
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
      // Still return success to the client (security), but log the error
      // You may want to notify yourself via another channel
    }

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('🔥 Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// -------------------- RESET PASSWORD --------------------
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    if (resetToken.expiresAt < new Date()) {
      await resetToken.deleteOne();
      return res.status(400).json({ error: 'Token has expired' });
    }

    const admin = await Admin.findById(resetToken.adminId);
    if (!admin) {
      return res.status(400).json({ error: 'Admin not found' });
    }

    // Assign plain password – the model's pre-save hook will hash it
    admin.password = newPassword;
    await admin.save();

    // Delete the used token
    await resetToken.deleteOne();

    res.json({ message: 'Password updated successfully. You can now login.' });
  } catch (err) {
    console.error('🔥 Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

module.exports = router;