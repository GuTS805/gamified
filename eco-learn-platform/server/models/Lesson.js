const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['climate_change', 'waste_management', 'biodiversity', 'renewable_energy', 'water_conservation', 'sustainable_living'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    estimatedTime: {
        type: Number, // in minutes
        required: true
    },
    pointsReward: {
        type: Number,
        default: 10
    },
    thumbnail: {
        type: String,
        required: true
    },
    mediaFiles: [{
        type: {
            type: String,
            enum: ['image', 'video', 'audio']
        },
        url: String,
        caption: String
    }],
    objectives: [String],
    keyTakeaways: [String],
    relatedTopics: [String],
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for search functionality
lessonSchema.index({ 
    title: 'text', 
    description: 'text', 
    content: 'text',
    category: 1,
    difficulty: 1 
});

module.exports = mongoose.model('Lesson', lessonSchema);
