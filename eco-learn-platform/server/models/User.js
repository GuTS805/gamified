const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    school: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: function() {
            return this.role === 'student';
        }
    },
    avatar: {
        type: String,
        default: ''
    },
    // Gamification features
    ecoPoints: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    badges: [{
        badgeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Badge'
        },
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    completedLessons: [{
        lessonId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lesson'
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        score: Number
    }],
    completedQuizzes: [{
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        score: Number,
        completedAt: {
            type: Date,
            default: Date.now
        }
    }],
    challengesCompleted: [{
        challengeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Challenge'
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        evidence: String // URL to uploaded evidence
    }],
    streakDays: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: Date
    },
    preferences: {
        notifications: {
            type: Boolean,
            default: true
        },
        language: {
            type: String,
            default: 'en'
        }
    }
}, {
    timestamps: true
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Calculate level based on eco points
userSchema.methods.calculateLevel = function() {
    this.level = Math.floor(this.ecoPoints / 100) + 1;
    return this.level;
};

// Add eco points and update level
userSchema.methods.addEcoPoints = function(points) {
    this.ecoPoints += points;
    this.calculateLevel();
    return this.ecoPoints;
};

module.exports = mongoose.model('User', userSchema);
