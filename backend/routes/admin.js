const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const jwt = require('jsonwebtoken');

// Middleware to verify admin token
const adminAuth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Requires Admin role' });
        }
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// @route   GET /api/admin/doctors
// @desc    Get all doctors
// @access  Private/Admin
router.get('/doctors', adminAuth, async (req, res) => {
    try {
        const doctors = await Doctor.find().select('-password');
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/admin/users
// @desc    Get all registered users
// @access  Private/Admin
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/admin/stats
// @desc    Get community support stats
// @access  Private/Admin
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const doctorCount = await Doctor.countDocuments();
        
        // Mock data for community support trends
        const trends = [
            { month: 'Jan', consultations: 120, assessments: 450 },
            { month: 'Feb', consultations: 150, assessments: 520 },
            { month: 'Mar', consultations: 180, assessments: 610 },
            { month: 'Apr', consultations: 210, assessments: 700 }
        ];

        const pcosDistribution = [
            { name: 'Risk: High', value: 40 },
            { name: 'Risk: Medium', value: 35 },
            { name: 'Risk: Low', value: 25 }
        ];

        res.json({
            userCount,
            doctorCount,
            trends,
            pcosDistribution
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
