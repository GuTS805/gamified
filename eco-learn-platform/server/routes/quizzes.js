const express = require('express');
const Quiz = require('../models/Quiz');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ isPublished: true })
            .populate('createdBy', 'name')
            .select('-questions.correctAnswer -questions.options.isCorrect');
        res.json({ success: true, data: quizzes });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
