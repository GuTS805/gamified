const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['learning', 'engagement', 'environment', 'challenge', 'streak', 'special'],
        required: true
    },
    criteria: {
        type: {
            type: String,
            enum: ['points', 'lessons_completed', 'quizzes_completed', 'challenges_completed', 'streak_days', 'special'],
            required: true
        },
        value: {
            type: Number,
            required: function() {
                return this.criteria.type !== 'special';
            }
        },
        description: String
    },
    rarity: {
        type: String,
        enum: ['common', 'rare', 'epic', 'legendary'],
        default: 'common'
    },
    pointsReward: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Badge', badgeSchema);
