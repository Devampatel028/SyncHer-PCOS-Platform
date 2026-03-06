const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ================= DOCTOR LOGIN =================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const doctor = await Doctor.findOne({ email: email.toLowerCase().trim() });
    if (!doctor) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { doctorId: doctor._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: '7d' }
    );

    res.json({
      token,
      doctorId: doctor._id,
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty
    });
  } catch (err) {
    console.error("DOCTOR LOGIN ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
