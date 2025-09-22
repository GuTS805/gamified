const express = require('express');
const { body } = require('express-validator');
const { auth, authorize, optionalAuth } = require('../middleware/auth');
const {
    getChallenges,
    getChallengeById,
    joinChallenge,
    submitEvidence,
    reviewSubmission,
    createChallenge,
    updateChallenge,
    getChallengeCategories,
    getUserChallengeProgress,
    getChallengeStats
} = require('../controllers/challengesController');

const router = express.Router();

// @route   GET /api/challenges
// @desc    Get all challenges with filters
// @access  Public
router.get('/', optionalAuth, getChallenges);

// @route   GET /api/challenges/categories
// @desc    Get challenge categories with counts
// @access  Public
router.get('/categories', getChallengeCategories);

// @route   GET /api/challenges/progress
// @desc    Get user's challenge progress
// @access  Private
router.get('/progress', auth, getUserChallengeProgress);

// @route   GET /api/challenges/stats
// @desc    Get challenge statistics
// @access  Public
router.get('/stats', getChallengeStats);

// @route   GET /api/challenges/:id
// @desc    Get single challenge by ID
// @access  Public
router.get('/:id', optionalAuth, getChallengeById);

// @route   POST /api/challenges/:id/join
// @desc    Join a challenge
// @access  Private
router.post('/:id/join', auth, joinChallenge);

// @route   POST /api/challenges/:id/submit
// @desc    Submit evidence for challenge
// @access  Private
router.post('/:id/submit', [
    auth,
    body('description').optional().isLength({ max: 500 }).withMessage('Description must be less than 500 characters')
], submitEvidence);

// @route   POST /api/challenges/:id/review/:userId
// @desc    Review challenge submission (teachers/admin only)
// @access  Private (Teachers/Admin)
router.post('/:id/review/:userId', [
    auth,
    authorize('teacher', 'admin'),
    body('approved').isBoolean().withMessage('Approved must be a boolean'),
    body('notes').optional().isLength({ max: 1000 }).withMessage('Notes must be less than 1000 characters')
], reviewSubmission);

// @route   POST /api/challenges
// @desc    Create new challenge (teachers/admin only)
// @access  Private (Teachers/Admin)
router.post('/', [
    auth,
    authorize('teacher', 'admin'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').isIn([
        'tree_planting', 'waste_reduction', 'energy_saving',
        'water_conservation', 'recycling', 'community_action'
    ]).withMessage('Valid category is required'),
    body('difficulty').isIn(['easy', 'medium', 'hard']).withMessage('Valid difficulty is required'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('pointsReward').isNumeric().withMessage('Points reward must be a number'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required')
], createChallenge);

// @route   PUT /api/challenges/:id
// @desc    Update challenge (teachers/admin only)
// @access  Private (Teachers/Admin)
router.put('/:id', [
    auth,
    authorize('teacher', 'admin')
], updateChallenge);

module.exports = router;
