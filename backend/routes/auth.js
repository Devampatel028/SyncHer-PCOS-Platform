const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ================= REGISTER =================
router.post('/register', async (req, res) => {
    console.log("REGISTER REQUEST RECEIVED");
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name || !phone) {
            return res.status(400).json({
                message: "Email, password, name, and phone are required"
            });
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

user = new User({
    email,
    password,
    name,
    phone,
    pcosStatus: "Not assessed",
    cycleLength: "Unknown"
});

await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            userId: user._id
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already registered. Please login instead.' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});


// ================= LOGIN =================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: '7d' }
        );

        res.json({
            token,
            userId: user._id
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;