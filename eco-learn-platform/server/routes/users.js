const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/profile', auth, (req, res) => {
    res.json({ success: true, user: req.user });
});

// @route   PUT /api/users/game-progress
// @desc    Update user's game progress
// @access  Private
router.put('/game-progress', auth, async (req, res) => {
    try {
        const { lessonId, gameId, score, ecoPoints } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find existing game progress
        const existingProgressIndex = user.gameProgress.findIndex(
            p => p.lessonId === lessonId && p.gameId === gameId
        );

        if (existingProgressIndex !== -1) {
            // Update existing progress
            const existingProgress = user.gameProgress[existingProgressIndex];
            const newScore = Math.max(existingProgress.score, score);
            const pointsToAdd = newScore - existingProgress.score;
            
            user.gameProgress[existingProgressIndex] = {
                ...existingProgress.toObject(),
                score: newScore,
                completed: true,
                completedAt: new Date(),
                attempts: existingProgress.attempts + 1
            };
            
            user.ecoPoints += pointsToAdd;
        } else {
            // Add new progress
            user.gameProgress.push({
                gameId,
                lessonId,
                score,
                completed: true,
                completedAt: new Date(),
                attempts: 1
            });
            
            user.ecoPoints += ecoPoints;
        }

        // Recalculate level
        user.calculateLevel();
        
        await user.save();

        res.json({
            success: true,
            message: 'Game progress updated successfully',
            user: {
                ecoPoints: user.ecoPoints,
                level: user.level,
                gameProgress: user.gameProgress
            }
        });
    } catch (error) {
        console.error('Game progress update error:', error);
        res.status(500).json({ message: 'Server error updating game progress' });
    }
});

module.exports = router;
