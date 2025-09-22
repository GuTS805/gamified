const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Badge = require('../models/Badge');
const { validationResult } = require('express-validator');
const multer = require('multer');

// @desc    Get all challenges with filters
// @route   GET /api/challenges
// @access  Public
const getChallenges = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        
        const filter = { isActive: true };
        
        // Add status filter
        if (req.query.status && req.query.status !== 'all') {
            const currentDate = new Date();
            
            switch (req.query.status) {
                case 'active':
                    filter.startDate = { $lte: currentDate };
                    filter.endDate = { $gte: currentDate };
                    break;
                case 'upcoming':
                    filter.startDate = { $gt: currentDate };
                    break;
                case 'ending_soon':
                    const twoDaysLater = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
                    filter.startDate = { $lte: currentDate };
                    filter.endDate = { $gte: currentDate, $lte: twoDaysLater };
                    break;
            }
        }
        
        // Add category filter
        if (req.query.category && req.query.category !== 'all') {
            filter.category = req.query.category;
        }
        
        // Add difficulty filter
        if (req.query.difficulty && req.query.difficulty !== 'all') {
            filter.difficulty = req.query.difficulty;
        }

        const challenges = await Challenge.find(filter)
            .populate('createdBy', 'name')
            .populate('badge', 'name description icon')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-participants.evidence'); // Don't send evidence in list view

        const total = await Challenge.countDocuments(filter);
        
        // Add participation status for authenticated users
        if (req.user) {
            challenges.forEach(challenge => {
                const participation = challenge.participants.find(
                    p => p.user.toString() === req.user.id
                );
                challenge._doc.userParticipation = participation || null;
                challenge._doc.isParticipating = !!participation;
            });
        }

        res.json({
            success: true,
            data: challenges,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get challenges error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching challenges' 
        });
    }
};

// @desc    Get single challenge by ID
// @route   GET /api/challenges/:id
// @access  Public
const getChallengeById = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id)
            .populate('createdBy', 'name')
            .populate('badge', 'name description icon rarity')
            .populate('participants.user', 'name school')
            .populate('participants.reviewedBy', 'name');
        
        if (!challenge || !challenge.isActive) {
            return res.status(404).json({ 
                success: false, 
                message: 'Challenge not found' 
            });
        }

        // Check participation status for authenticated users
        let userParticipation = null;
        if (req.user) {
            userParticipation = challenge.participants.find(
                p => p.user._id.toString() === req.user.id
            );
        }

        res.json({
            success: true,
            data: {
                ...challenge.toObject(),
                userParticipation
            }
        });
    } catch (error) {
        console.error('Get challenge error:', error);
        if (error.name === 'CastError') {
            return res.status(404).json({ 
                success: false, 
                message: 'Challenge not found' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching challenge' 
        });
    }
};

// @desc    Join a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
const joinChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        
        if (!challenge || !challenge.isActive) {
            return res.status(404).json({ 
                success: false, 
                message: 'Challenge not found' 
            });
        }

        // Check if challenge is still accepting participants
        const currentDate = new Date();
        if (currentDate > challenge.endDate) {
            return res.status(400).json({
                success: false,
                message: 'Challenge has ended'
            });
        }

        if (challenge.participants.length >= challenge.maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Challenge is full'
            });
        }

        // Check if user is already participating
        const existingParticipation = challenge.participants.find(
            p => p.user.toString() === req.user.id
        );

        if (existingParticipation) {
            return res.status(400).json({
                success: false,
                message: 'Already participating in this challenge'
            });
        }

        // Add user to participants
        challenge.participants.push({
            user: req.user.id,
            joinedAt: new Date(),
            status: 'joined'
        });

        await challenge.save();

        res.json({
            success: true,
            message: 'Successfully joined challenge',
            participantCount: challenge.participants.length
        });
    } catch (error) {
        console.error('Join challenge error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while joining challenge'
        });
    }
};

// @desc    Submit evidence for challenge
// @route   POST /api/challenges/:id/submit
// @access  Private
const submitEvidence = async (req, res) => {
    try {
        const { description } = req.body;
        const challenge = await Challenge.findById(req.params.id);
        
        if (!challenge || !challenge.isActive) {
            return res.status(404).json({ 
                success: false, 
                message: 'Challenge not found' 
            });
        }

        // Find user's participation
        const participationIndex = challenge.participants.findIndex(
            p => p.user.toString() === req.user.id
        );

        if (participationIndex === -1) {
            return res.status(400).json({
                success: false,
                message: 'You are not participating in this challenge'
            });
        }

        const participation = challenge.participants[participationIndex];

        // Check if already submitted
        if (participation.status === 'submitted' || participation.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Evidence already submitted'
            });
        }

        // Add evidence (in real app, handle file upload)
        const evidenceItem = {
            type: 'photo', // This would be determined by file upload
            url: req.file ? req.file.path : req.body.evidenceUrl, // Placeholder
            description: description || '',
            uploadedAt: new Date()
        };

        participation.evidence.push(evidenceItem);
        participation.status = 'submitted';
        participation.reviewStatus = 'pending';

        await challenge.save();

        res.json({
            success: true,
            message: 'Evidence submitted successfully',
            status: participation.status
        });
    } catch (error) {
        console.error('Submit evidence error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting evidence'
        });
    }
};

// @desc    Review challenge submission (teachers/admin only)
// @route   POST /api/challenges/:id/review/:userId
// @access  Private (Teachers/Admin)
const reviewSubmission = async (req, res) => {
    try {
        const { approved, notes } = req.body;
        const challenge = await Challenge.findById(req.params.id);
        
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: 'Challenge not found'
            });
        }

        const participationIndex = challenge.participants.findIndex(
            p => p.user.toString() === req.params.userId
        );

        if (participationIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Participation not found'
            });
        }

        const participation = challenge.participants[participationIndex];
        participation.reviewStatus = approved ? 'approved' : 'rejected';
        participation.reviewNotes = notes;
        participation.reviewedBy = req.user.id;

        if (approved) {
            participation.status = 'completed';
            participation.completedAt = new Date();

            // Award points to user
            const user = await User.findById(req.params.userId);
            user.addEcoPoints(challenge.pointsReward);

            // Add to completed challenges
            user.challengesCompleted.push({
                challengeId: challenge._id,
                completedAt: new Date()
            });

            // Award badge if exists
            if (challenge.badge) {
                const hasBadge = user.badges.some(
                    b => b.badgeId.toString() === challenge.badge.toString()
                );
                
                if (!hasBadge) {
                    user.badges.push({
                        badgeId: challenge.badge,
                        earnedAt: new Date()
                    });
                }
            }

            await user.save();
        } else {
            participation.status = 'failed';
        }

        await challenge.save();

        res.json({
            success: true,
            message: `Submission ${approved ? 'approved' : 'rejected'}`,
            pointsAwarded: approved ? challenge.pointsReward : 0
        });
    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while reviewing submission'
        });
    }
};

// @desc    Create new challenge (teachers/admin only)
// @route   POST /api/challenges
// @access  Private (Teachers/Admin)
const createChallenge = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const challengeData = {
            ...req.body,
            createdBy: req.user.id
        };

        const challenge = new Challenge(challengeData);
        await challenge.save();

        await challenge.populate('createdBy', 'name');

        res.status(201).json({
            success: true,
            data: challenge,
            message: 'Challenge created successfully'
        });
    } catch (error) {
        console.error('Create challenge error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating challenge'
        });
    }
};

// @desc    Update challenge (teachers/admin only)
// @route   PUT /api/challenges/:id
// @access  Private (Teachers/Admin)
const updateChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: 'Challenge not found'
            });
        }

        // Check if user owns the challenge or is admin
        if (challenge.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this challenge'
            });
        }

        const updatedChallenge = await Challenge.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name');

        res.json({
            success: true,
            data: updatedChallenge,
            message: 'Challenge updated successfully'
        });
    } catch (error) {
        console.error('Update challenge error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating challenge'
        });
    }
};

// @desc    Get challenge categories with counts
// @route   GET /api/challenges/categories
// @access  Public
const getChallengeCategories = async (req, res) => {
    try {
        const categories = await Challenge.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const categoryMap = {
            tree_planting: 'Tree Planting',
            waste_reduction: 'Waste Reduction',
            energy_saving: 'Energy Saving',
            water_conservation: 'Water Conservation',
            recycling: 'Recycling',
            community_action: 'Community Action'
        };

        const formattedCategories = categories.map(cat => ({
            value: cat._id,
            label: categoryMap[cat._id] || cat._id,
            count: cat.count
        }));

        res.json({
            success: true,
            data: formattedCategories
        });
    } catch (error) {
        console.error('Get challenge categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching categories'
        });
    }
};

// @desc    Get user's challenge progress
// @route   GET /api/challenges/progress
// @access  Private
const getUserChallengeProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('challengesCompleted.challengeId', 'title category pointsReward');

        // Get active participations
        const activeParticipations = await Challenge.find({
            'participants.user': req.user.id,
            isActive: true
        }).select('title category participants.$');

        const completedCount = user.challengesCompleted.length;
        const activeCount = activeParticipations.length;

        // Group progress by category
        const categoryProgress = {};
        user.challengesCompleted.forEach(completion => {
            const category = completion.challengeId.category;
            if (!categoryProgress[category]) {
                categoryProgress[category] = {
                    completed: 0,
                    totalPoints: 0
                };
            }
            categoryProgress[category].completed += 1;
            categoryProgress[category].totalPoints += completion.challengeId.pointsReward;
        });

        res.json({
            success: true,
            data: {
                completedCount,
                activeCount,
                categoryProgress,
                recentCompletions: user.challengesCompleted
                    .sort((a, b) => b.completedAt - a.completedAt)
                    .slice(0, 5),
                activeParticipations
            }
        });
    } catch (error) {
        console.error('Get user challenge progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching progress'
        });
    }
};

// @desc    Get challenge statistics
// @route   GET /api/challenges/stats
// @access  Public
const getChallengeStats = async (req, res) => {
    try {
        const totalChallenges = await Challenge.countDocuments({ isActive: true });
        
        const stats = await Challenge.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    totalParticipants: { $sum: { $size: '$participants' } },
                    totalPointsAvailable: { $sum: '$pointsReward' },
                    avgCompletionRate: { $avg: '$completionRate' }
                }
            }
        ]);

        const categoryStats = await Challenge.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    totalParticipants: { $sum: { $size: '$participants' } },
                    avgPoints: { $avg: '$pointsReward' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalChallenges,
                totalParticipants: stats[0]?.totalParticipants || 0,
                totalPointsAvailable: stats[0]?.totalPointsAvailable || 0,
                avgCompletionRate: Math.round(stats[0]?.avgCompletionRate || 0),
                categoryStats
            }
        });
    } catch (error) {
        console.error('Get challenge stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching stats'
        });
    }
};

module.exports = {
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
};
