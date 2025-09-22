const Lesson = require('../models/Lesson');
const User = require('../models/User');
const Badge = require('../models/Badge');
const { validationResult } = require('express-validator');

// @desc    Get all lessons with pagination and filters
// @route   GET /api/lessons
// @access  Public
const getLessons = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        
        const filter = { isPublished: true };
        
        // Add category filter
        if (req.query.category && req.query.category !== 'all') {
            filter.category = req.query.category;
        }
        
        // Add difficulty filter
        if (req.query.difficulty && req.query.difficulty !== 'all') {
            filter.difficulty = req.query.difficulty;
        }
        
        // Add search filter
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }

        const lessons = await Lesson.find(filter)
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-content'); // Don't send full content in list view

        const total = await Lesson.countDocuments(filter);
        
        // Add completion status for authenticated users
        if (req.user) {
            const user = await User.findById(req.user.id);
            lessons.forEach(lesson => {
                const completed = user.completedLessons.some(
                    cl => cl.lessonId.toString() === lesson._id.toString()
                );
                lesson._doc.isCompleted = completed;
            });
        }

        res.json({
            success: true,
            data: lessons,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get lessons error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching lessons' 
        });
    }
};

// @desc    Get single lesson by ID
// @route   GET /api/lessons/:id
// @access  Public
const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id)
            .populate('createdBy', 'name')
            .populate('prerequisites', 'title difficulty')
            .populate('quiz', 'title description difficulty');
        
        if (!lesson || !lesson.isPublished) {
            return res.status(404).json({ 
                success: false, 
                message: 'Lesson not found' 
            });
        }

        // Increment view count
        lesson.views += 1;
        await lesson.save();

        // Check if user has completed this lesson
        let isCompleted = false;
        let userProgress = null;
        
        if (req.user) {
            const user = await User.findById(req.user.id);
            const completedLesson = user.completedLessons.find(
                cl => cl.lessonId.toString() === lesson._id.toString()
            );
            isCompleted = !!completedLesson;
            userProgress = completedLesson || null;
        }

        res.json({
            success: true,
            data: {
                ...lesson.toObject(),
                isCompleted,
                userProgress
            }
        });
    } catch (error) {
        console.error('Get lesson error:', error);
        if (error.name === 'CastError') {
            return res.status(404).json({ 
                success: false, 
                message: 'Lesson not found' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching lesson' 
        });
    }
};

// @desc    Mark lesson as completed
// @route   POST /api/lessons/:id/complete
// @access  Private
const completeLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson || !lesson.isPublished) {
            return res.status(404).json({ 
                success: false, 
                message: 'Lesson not found' 
            });
        }

        const user = await User.findById(req.user.id);
        
        // Check if already completed
        const alreadyCompleted = user.completedLessons.some(
            cl => cl.lessonId.toString() === lesson._id.toString()
        );

        if (alreadyCompleted) {
            return res.status(400).json({ 
                success: false, 
                message: 'Lesson already completed' 
            });
        }

        // Add to completed lessons and award points
        const completionData = {
            lessonId: lesson._id,
            completedAt: new Date(),
            score: req.body.score || 100
        };

        user.completedLessons.push(completionData);
        user.addEcoPoints(lesson.pointsReward);

        // Check for badge eligibility
        await checkLearningBadges(user);
        
        await user.save();

        res.json({
            success: true,
            message: 'Lesson completed successfully',
            pointsEarned: lesson.pointsReward,
            totalPoints: user.ecoPoints,
            newLevel: user.level,
            completionData
        });
    } catch (error) {
        console.error('Complete lesson error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while completing lesson' 
        });
    }
};

// @desc    Like/unlike a lesson
// @route   POST /api/lessons/:id/like
// @access  Private
const likeLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) {
            return res.status(404).json({ 
                success: false, 
                message: 'Lesson not found' 
            });
        }

        // For simplicity, just increment likes
        lesson.likes += 1;
        await lesson.save();

        res.json({
            success: true,
            likes: lesson.likes,
            message: 'Lesson liked successfully'
        });
    } catch (error) {
        console.error('Like lesson error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while liking lesson' 
        });
    }
};

// @desc    Create new lesson (teachers/admin only)
// @route   POST /api/lessons
// @access  Private (Teachers/Admin)
const createLesson = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const lessonData = {
            ...req.body,
            createdBy: req.user.id
        };

        const lesson = new Lesson(lessonData);
        await lesson.save();

        await lesson.populate('createdBy', 'name');

        res.status(201).json({
            success: true,
            data: lesson,
            message: 'Lesson created successfully'
        });
    } catch (error) {
        console.error('Create lesson error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while creating lesson' 
        });
    }
};

// @desc    Update lesson (teachers/admin only)
// @route   PUT /api/lessons/:id
// @access  Private (Teachers/Admin)
const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        
        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: 'Lesson not found'
            });
        }

        // Check if user owns the lesson or is admin
        if (lesson.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this lesson'
            });
        }

        const updatedLesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name');

        res.json({
            success: true,
            data: updatedLesson,
            message: 'Lesson updated successfully'
        });
    } catch (error) {
        console.error('Update lesson error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating lesson'
        });
    }
};

// @desc    Get lesson categories with counts
// @route   GET /api/lessons/categories
// @access  Public
const getLessonCategories = async (req, res) => {
    try {
        const categories = await Lesson.aggregate([
            { $match: { isPublished: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const categoryMap = {
            climate_change: 'Climate Change',
            waste_management: 'Waste Management',
            biodiversity: 'Biodiversity',
            renewable_energy: 'Renewable Energy',
            water_conservation: 'Water Conservation',
            sustainable_living: 'Sustainable Living'
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
        console.error('Get categories error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching categories' 
        });
    }
};

// @desc    Get user's lesson progress
// @route   GET /api/lessons/progress
// @access  Private
const getUserProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('completedLessons.lessonId', 'title category pointsReward');

        const totalLessons = await Lesson.countDocuments({ isPublished: true });
        const completedCount = user.completedLessons.length;
        const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        // Group progress by category
        const categoryProgress = {};
        user.completedLessons.forEach(completion => {
            const category = completion.lessonId.category;
            if (!categoryProgress[category]) {
                categoryProgress[category] = {
                    completed: 0,
                    totalPoints: 0
                };
            }
            categoryProgress[category].completed += 1;
            categoryProgress[category].totalPoints += completion.lessonId.pointsReward;
        });

        res.json({
            success: true,
            data: {
                totalLessons,
                completedCount,
                progressPercentage,
                categoryProgress,
                recentCompletions: user.completedLessons
                    .sort((a, b) => b.completedAt - a.completedAt)
                    .slice(0, 5)
            }
        });
    } catch (error) {
        console.error('Get user progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching progress'
        });
    }
};

// Helper function to check and award learning badges
const checkLearningBadges = async (user) => {
    try {
        const badges = await Badge.find({ 
            category: 'learning',
            isActive: true 
        });

        for (const badge of badges) {
            // Check if user already has this badge
            const hasBadge = user.badges.some(
                userBadge => userBadge.badgeId.toString() === badge._id.toString()
            );

            if (!hasBadge) {
                let shouldAward = false;

                switch (badge.criteria.type) {
                    case 'lessons_completed':
                        shouldAward = user.completedLessons.length >= badge.criteria.value;
                        break;
                    case 'points':
                        shouldAward = user.ecoPoints >= badge.criteria.value;
                        break;
                }

                if (shouldAward) {
                    user.badges.push({
                        badgeId: badge._id,
                        earnedAt: new Date()
                    });
                    user.addEcoPoints(badge.pointsReward);
                }
            }
        }
    } catch (error) {
        console.error('Badge check error:', error);
    }
};

module.exports = {
    getLessons,
    getLessonById,
    completeLesson,
    likeLesson,
    createLesson,
    updateLesson,
    getLessonCategories,
    getUserProgress
};
