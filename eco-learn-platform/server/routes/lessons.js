const express = require('express');
const { body } = require('express-validator');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const {
    getLessons,
    getLessonById,
    completeLesson,
    likeLesson,
    createLesson,
    updateLesson,
    getLessonCategories,
    getUserProgress
} = require('../controllers/lessonsController');

const router = express.Router();

// @route   GET /api/lessons
// @desc    Get all lessons with pagination and filters
// @access  Public
router.get('/', optionalAuth, getLessons);

// @route   GET /api/lessons/categories
// @desc    Get lesson categories with counts
// @access  Public
router.get('/categories', getLessonCategories);

// @route   GET /api/lessons/progress
// @desc    Get user's lesson progress
// @access  Private
router.get('/progress', auth, getUserProgress);

// @route   GET /api/lessons/:id
// @desc    Get single lesson by ID
// @access  Public
router.get('/:id', optionalAuth, getLessonById);

// @route   POST /api/lessons/:id/complete
// @desc    Mark lesson as completed
// @access  Private
router.post('/:id/complete', auth, completeLesson);

// @route   POST /api/lessons/:id/like
// @desc    Like/unlike a lesson
// @access  Private
router.post('/:id/like', auth, likeLesson);

// @route   POST /api/lessons
// @desc    Create new lesson (teachers/admin only)
// @access  Private (Teachers/Admin)
router.post('/', [
    auth,
    authorize('teacher', 'admin'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').isIn([
        'climate_change', 'waste_management', 'biodiversity',
        'renewable_energy', 'water_conservation', 'sustainable_living'
    ]).withMessage('Valid category is required'),
    body('difficulty').isIn(['beginner', 'intermediate', 'advanced']).withMessage('Valid difficulty is required'),
    body('estimatedTime').isNumeric().withMessage('Estimated time must be a number'),
    body('pointsReward').isNumeric().withMessage('Points reward must be a number')
], createLesson);

// @route   PUT /api/lessons/:id
// @desc    Update lesson (teachers/admin only)
// @access  Private (Teachers/Admin)
router.put('/:id', [
    auth,
    authorize('teacher', 'admin')
], updateLesson);

module.exports = router;
