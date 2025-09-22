const express = require('express');
const User = require('../models/User');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
    try {
        const leaderboard = await User.find({ role: 'student' })
            .select('name school ecoPoints level streakDays')
            .sort({ ecoPoints: -1 })
            .limit(50);
        
        res.json({ success: true, data: leaderboard });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
