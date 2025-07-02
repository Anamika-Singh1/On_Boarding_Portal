const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// 🔐 REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔐 LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });
    if (!user) return res.status(404).json({ message: 'User not found or role mismatch' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
// 🔄 FORGOT PASSWORD
const nodemailer = require('nodemailer');

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Create reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    console.log('Reset link:', resetLink);

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AiEnsured Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Link',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 mins.</p>`,
    });

    res.status(200).json({ message: 'Reset link sent to your email' });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/reset/:token', async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      console.error('Reset password error:', err.message);
      res.status(500).json({ message: 'Invalid or expired token' });
    }
  });
  


module.exports = router;
