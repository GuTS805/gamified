const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructions: [String],
    category: {
        type: String,
        enum: ['tree_planting', 'waste_reduction', 'energy_saving', 'water_conservation', 'recycling', 'community_action'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    duration: {
        type: Number, // in days
        required: true
    },
    pointsReward: {
        type: Number,
        required: true
    },
    evidenceRequired: {
        type: {
            type: String,
            enum: ['photo', 'video', 'document', 'multiple'],
            required: true
        },
        description: String,
        guidelines: [String]
    },
    resources: [{
        title: String,
        url: String,
        type: {
            type: String,
            enum: ['article', 'video', 'pdf', 'website']
        }
    }],
    badge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['joined', 'in_progress', 'submitted', 'completed', 'failed'],
            default: 'joined'
        },
        evidence: [{
            type: {
                type: String,
                enum: ['photo', 'video', 'document']
            },
            url: String,
            description: String,
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }],
        completedAt: Date,
        reviewStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        reviewNotes: String,
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    maxParticipants: {
        type: Number,
        default: 1000
    },
    tags: [String],
    sdgGoals: [{
        type: Number,
        min: 1,
        max: 17
    }] // UN Sustainable Development Goals
}, {
    timestamps: true
});

// Index for searching challenges
challengeSchema.index({ 
    title: 'text', 
    description: 'text',
    category: 1,
    difficulty: 1,
    isActive: 1
});

// Virtual for participant count
challengeSchema.virtual('participantCount').get(function() {
    return this.participants.length;
});

// Virtual for completion rate
challengeSchema.virtual('completionRate').get(function() {
    if (this.participants.length === 0) return 0;
    const completed = this.participants.filter(p => p.status === 'completed').length;
    return Math.round((completed / this.participants.length) * 100);
});

module.exports = mongoose.model('Challenge', challengeSchema);
