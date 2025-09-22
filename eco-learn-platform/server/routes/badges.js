const express = require('express');
const Badge = require('../models/Badge');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
    try {
        const badges = await Badge.find({ isActive: true });
        res.json({ success: true, data: badges });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
