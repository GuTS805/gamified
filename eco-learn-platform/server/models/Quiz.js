const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['multiple_choice', 'true_false', 'fill_blank', 'drag_drop'],
        default: 'multiple_choice'
    },
    options: [{
        text: String,
        isCorrect: {
            type: Boolean,
            default: false
        }
    }],
    correctAnswer: String, // for fill_blank questions
    explanation: String,
    points: {
        type: Number,
        default: 1
    },
    media: {
        type: String, // URL to image/video
        caption: String
    }
});

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    },
    questions: [questionSchema],
    timeLimit: {
        type: Number, // in minutes
        default: 15
    },
    passingScore: {
        type: Number,
        default: 70 // percentage
    },
    maxAttempts: {
        type: Number,
        default: 3
    },
    pointsReward: {
        type: Number,
        default: 20
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    category: {
        type: String,
        enum: ['climate_change', 'waste_management', 'biodiversity', 'renewable_energy', 'water_conservation', 'sustainable_living'],
        required: true
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
    attempts: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: Number,
        answers: [{
            questionId: String,
            answer: mongoose.Schema.Types.Mixed,
            isCorrect: Boolean,
            timeSpent: Number // in seconds
        }],
        completedAt: {
            type: Date,
            default: Date.now
        },
        timeTaken: Number // total time in minutes
    }]
}, {
    timestamps: true
});

// Calculate total points for the quiz
quizSchema.virtual('totalPoints').get(function() {
    return this.questions.reduce((total, question) => total + question.points, 0);
});

module.exports = mongoose.model('Quiz', quizSchema);
