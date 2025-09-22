const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Challenge = require('../models/Challenge');
const Badge = require('../models/Badge');

// Sample data that matches the frontend
const sampleLessons = [
    {
        title: 'Climate Change Basics',
        description: 'Understanding global warming, greenhouse effects, and climate science fundamentals.',
        content: `
        # Climate Change Basics

        ## What is Climate Change?
        Climate change refers to long-term changes in global temperatures and weather patterns. While climate change is natural, scientific evidence shows that human activities have been the main driver of climate change since the mid-20th century.

        ## Key Concepts:

        ### 1. Greenhouse Effect
        - Natural process that warms Earth's surface
        - Greenhouse gases trap heat in the atmosphere
        - Essential for life, but human activities are intensifying it

        ### 2. Main Greenhouse Gases
        - Carbon dioxide (CO2) - from burning fossil fuels
        - Methane (CH4) - from agriculture and landfills  
        - Nitrous oxide (N2O) - from fertilizers and combustion
        - Fluorinated gases - from industrial processes

        ### 3. Evidence of Climate Change
        - Rising global temperatures
        - Melting ice caps and glaciers
        - Rising sea levels
        - Changing precipitation patterns
        - More extreme weather events

        ## What Can You Do?
        - Reduce energy consumption
        - Use renewable energy sources
        - Support sustainable transportation
        - Practice the 3 Rs: Reduce, Reuse, Recycle
        - Educate others about climate change
        `,
        category: 'climate_change',
        difficulty: 'beginner',
        estimatedTime: 45,
        pointsReward: 20,
        thumbnail: '/images/climate-change.jpg',
        objectives: [
            'Understand the greenhouse effect',
            'Identify main causes of climate change',
            'Recognize evidence of climate change',
            'Learn personal actions to combat climate change'
        ],
        keyTakeaways: [
            'Human activities are the main cause of recent climate change',
            'Greenhouse gases trap heat in the atmosphere',
            'Everyone can take action to reduce their carbon footprint'
        ],
        relatedTopics: ['Renewable Energy', 'Sustainable Living'],
        isPublished: true
    },
    {
        title: 'Waste Management Fundamentals',
        description: 'Learn the 3 Rs: Reduce, Reuse, Recycle. Master waste segregation and circular economy principles.',
        content: `
        # Waste Management Fundamentals

        ## The 3 Rs Hierarchy

        ### 1. REDUCE
        - Buy only what you need
        - Choose products with less packaging
        - Use digital receipts and bills
        - Repair items instead of replacing them

        ### 2. REUSE
        - Donate or sell items you no longer need
        - Repurpose containers and materials
        - Use both sides of paper
        - Give new life to old furniture

        ### 3. RECYCLE
        - Sort waste properly
        - Clean containers before recycling
        - Know your local recycling guidelines
        - Participate in e-waste recycling programs

        ## Waste Segregation Guide

        ### Biodegradable Waste (Green)
        - Food scraps and peels
        - Garden waste
        - Paper products
        - Natural materials

        ### Non-Biodegradable Waste (Blue)
        - Plastic bottles and containers
        - Metal cans
        - Glass bottles
        - Electronic waste

        ### Hazardous Waste (Red)
        - Batteries
        - Chemicals
        - Medical waste
        - Paint and solvents

        ## Circular Economy
        A model where resources are kept in use for as long as possible, extracting maximum value before recovery and regeneration.
        `,
        category: 'waste_management',
        difficulty: 'beginner',
        estimatedTime: 30,
        pointsReward: 15,
        thumbnail: '/images/waste-management.jpg',
        objectives: [
            'Master the 3 Rs principle',
            'Learn proper waste segregation',
            'Understand circular economy concepts',
            'Implement waste reduction strategies'
        ],
        keyTakeaways: [
            'Prevention is better than treatment',
            'Proper segregation is crucial for recycling',
            'Small actions create big environmental impact'
        ],
        relatedTopics: ['Sustainable Living', 'Community Action'],
        isPublished: true
    },
    {
        title: 'Biodiversity Conservation',
        description: 'Explore ecosystems, endangered species, and conservation strategies for protecting nature.',
        content: `
        # Biodiversity Conservation

        ## What is Biodiversity?
        Biodiversity refers to the variety of life on Earth, including:
        - Species diversity (variety of species)
        - Genetic diversity (variety within species)
        - Ecosystem diversity (variety of habitats)

        ## Why is Biodiversity Important?

        ### Ecosystem Services
        - Clean air and water
        - Climate regulation
        - Pollination of crops
        - Natural pest control
        - Soil formation

        ### Economic Value
        - Medicine and pharmaceuticals
        - Food security
        - Tourism revenue
        - Raw materials

        ## Threats to Biodiversity

        ### 1. Habitat Loss
        - Deforestation
        - Urbanization
        - Agricultural expansion
        - Wetland drainage

        ### 2. Climate Change
        - Rising temperatures
        - Changing precipitation
        - Ocean acidification
        - Extreme weather events

        ### 3. Pollution
        - Chemical contamination
        - Plastic waste
        - Light pollution
        - Noise pollution

        ## Conservation Strategies

        ### Protected Areas
        - National parks and reserves
        - Marine protected areas
        - Wildlife corridors
        - Community conservancies

        ### Species-Specific Programs
        - Captive breeding
        - Habitat restoration
        - Anti-poaching efforts
        - Species reintroduction

        ## How You Can Help
        - Support conservation organizations
        - Choose sustainable products
        - Create wildlife-friendly gardens
        - Reduce your carbon footprint
        - Educate others about conservation
        `,
        category: 'biodiversity',
        difficulty: 'intermediate',
        estimatedTime: 60,
        pointsReward: 25,
        thumbnail: '/images/biodiversity.jpg',
        objectives: [
            'Understand biodiversity and its importance',
            'Identify threats to biodiversity',
            'Learn conservation strategies',
            'Discover ways to support conservation'
        ],
        keyTakeaways: [
            'Biodiversity is essential for ecosystem health',
            'Human activities are the main threat to biodiversity',
            'Everyone can contribute to conservation efforts'
        ],
        relatedTopics: ['Climate Change', 'Sustainable Living'],
        isPublished: true
    }
];

const sampleChallenges = [
    {
        title: 'Plant a Tree',
        description: 'Plant a tree in your community and share a photo with location proof.',
        instructions: [
            'Choose an appropriate location with permission',
            'Select a native tree species suitable for your area',
            'Plant the tree following proper techniques',
            'Take a photo of yourself with the planted tree',
            'Include GPS location or landmark for verification'
        ],
        category: 'tree_planting',
        difficulty: 'easy',
        duration: 7, // days
        pointsReward: 50,
        evidenceRequired: {
            type: 'photo',
            description: 'Photo of you with the planted tree and location proof',
            guidelines: [
                'Clear photo showing you and the tree',
                'Include visible landmarks or GPS coordinates',
                'Tree should be properly planted in soil',
                'Photo should be taken on the day of planting'
            ]
        },
        resources: [
            {
                title: 'Tree Planting Guide',
                url: 'https://example.com/tree-planting-guide',
                type: 'article'
            },
            {
                title: 'Choosing Native Trees',
                url: 'https://example.com/native-trees',
                type: 'pdf'
            }
        ],
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        maxParticipants: 1000,
        tags: ['trees', 'environment', 'conservation'],
        sdgGoals: [13, 15] // Climate Action, Life on Land
    },
    {
        title: 'Zero Waste Week',
        description: 'Challenge yourself to produce zero waste for an entire week.',
        instructions: [
            'Plan your meals to avoid food waste',
            'Use reusable bags, bottles, and containers',
            'Avoid single-use plastics completely',
            'Compost organic waste',
            'Document your daily waste reduction efforts',
            'Share tips that worked for you'
        ],
        category: 'waste_reduction',
        difficulty: 'hard',
        duration: 7,
        pointsReward: 100,
        evidenceRequired: {
            type: 'multiple',
            description: 'Daily photo diary and waste audit results',
            guidelines: [
                'Take daily photos of your reusable items',
                'Document any unavoidable waste produced',
                'Show before/after comparison of waste habits',
                'Include reflection on challenges faced'
            ]
        },
        resources: [
            {
                title: 'Zero Waste Starter Guide',
                url: 'https://example.com/zero-waste-guide',
                type: 'article'
            },
            {
                title: 'DIY Natural Cleaners',
                url: 'https://example.com/natural-cleaners',
                type: 'video'
            }
        ],
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        maxParticipants: 500,
        tags: ['waste', 'lifestyle', 'sustainability'],
        sdgGoals: [12] // Responsible Consumption
    },
    {
        title: 'Energy Saver Challenge',
        description: 'Reduce your home energy consumption by 20% this month.',
        instructions: [
            'Record baseline energy consumption from utility bills',
            'Implement energy-saving measures',
            'Track daily energy usage',
            'Document specific actions taken',
            'Calculate final reduction percentage',
            'Share successful strategies with others'
        ],
        category: 'energy_saving',
        difficulty: 'medium',
        duration: 30,
        pointsReward: 75,
        evidenceRequired: {
            type: 'document',
            description: 'Energy bills comparison and action plan documentation',
            guidelines: [
                'Show before and after utility bills',
                'List specific actions taken',
                'Include photos of energy-saving implementations',
                'Calculate percentage reduction achieved'
            ]
        },
        resources: [
            {
                title: 'Home Energy Audit Guide',
                url: 'https://example.com/energy-audit',
                type: 'pdf'
            },
            {
                title: 'Energy Saving Tips',
                url: 'https://example.com/energy-tips',
                type: 'article'
            }
        ],
        isActive: true,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        maxParticipants: 800,
        tags: ['energy', 'home', 'conservation'],
        sdgGoals: [7, 13] // Affordable Clean Energy, Climate Action
    }
];

const sampleBadges = [
    {
        name: 'First Steps',
        description: 'Completed your first environmental lesson',
        icon: '🌱',
        category: 'learning',
        criteria: {
            type: 'lessons_completed',
            value: 1,
            description: 'Complete any lesson'
        },
        rarity: 'common',
        pointsReward: 5,
        isActive: true
    },
    {
        name: 'Knowledge Seeker',
        description: 'Completed 5 environmental lessons',
        icon: '📚',
        category: 'learning',
        criteria: {
            type: 'lessons_completed',
            value: 5,
            description: 'Complete 5 lessons'
        },
        rarity: 'common',
        pointsReward: 10,
        isActive: true
    },
    {
        name: 'Eco Scholar',
        description: 'Completed 20 environmental lessons',
        icon: '🎓',
        category: 'learning',
        criteria: {
            type: 'lessons_completed',
            value: 20,
            description: 'Complete 20 lessons'
        },
        rarity: 'rare',
        pointsReward: 25,
        isActive: true
    },
    {
        name: 'Environmental Expert',
        description: 'Earned 1000 EcoPoints',
        icon: '🏆',
        category: 'learning',
        criteria: {
            type: 'points',
            value: 1000,
            description: 'Accumulate 1000 EcoPoints'
        },
        rarity: 'epic',
        pointsReward: 50,
        isActive: true
    },
    {
        name: 'Challenge Accepted',
        description: 'Completed your first environmental challenge',
        icon: '💪',
        category: 'challenge',
        criteria: {
            type: 'challenges_completed',
            value: 1,
            description: 'Complete any challenge'
        },
        rarity: 'common',
        pointsReward: 10,
        isActive: true
    },
    {
        name: 'Tree Hugger',
        description: 'Planted a tree for the environment',
        icon: '🌳',
        category: 'environment',
        criteria: {
            type: 'special',
            description: 'Complete the Plant a Tree challenge'
        },
        rarity: 'rare',
        pointsReward: 20,
        isActive: true
    },
    {
        name: 'Streak Master',
        description: 'Maintained a 7-day learning streak',
        icon: '🔥',
        category: 'streak',
        criteria: {
            type: 'streak_days',
            value: 7,
            description: 'Login and complete activities for 7 consecutive days'
        },
        rarity: 'rare',
        pointsReward: 30,
        isActive: true
    }
];

const seedData = async () => {
    try {
        console.log('🌱 Starting database seeding...');\n        
        // Clear existing data\n        console.log('🧹 Clearing existing data...');\n        await User.deleteMany({});\n        await Lesson.deleteMany({});\n        await Challenge.deleteMany({});\n        await Badge.deleteMany({});\n\n        // Create admin user\n        console.log('👤 Creating admin user...');\n        const adminPassword = await bcrypt.hash('admin123', 10);\n        const adminUser = new User({\n            name: 'Admin User',\n            email: 'admin@ecolearn.com',\n            password: adminPassword,\n            role: 'admin',\n            school: 'EcoLearn Platform',\n            ecoPoints: 10000,\n            level: 100\n        });\n        await adminUser.save();\n\n        // Create teacher user\n        console.log('👩‍🏫 Creating teacher user...');\n        const teacherPassword = await bcrypt.hash('teacher123', 10);\n        const teacherUser = new User({\n            name: 'Environmental Teacher',\n            email: 'teacher@ecolearn.com',\n            password: teacherPassword,\n            role: 'teacher',\n            school: 'Green Valley High School',\n            ecoPoints: 2500,\n            level: 25\n        });\n        await teacherUser.save();\n\n        // Create sample students\n        console.log('👨‍🎓 Creating sample students...');\n        const studentPassword = await bcrypt.hash('student123', 10);\n        const sampleStudents = [\n            {\n                name: 'Arjun Sharma',\n                email: 'arjun@student.com',\n                password: studentPassword,\n                role: 'student',\n                school: 'Green Valley High School',\n                grade: '10th',\n                ecoPoints: 1250,\n                level: 12,\n                streakDays: 15\n            },\n            {\n                name: 'Priya Patel',\n                email: 'priya@student.com',\n                password: studentPassword,\n                role: 'student',\n                school: 'Eco International School',\n                grade: '11th',\n                ecoPoints: 1180,\n                level: 11,\n                streakDays: 8\n            },\n            {\n                name: 'Rahul Kumar',\n                email: 'rahul@student.com',\n                password: studentPassword,\n                role: 'student',\n                school: 'Nature Academy',\n                grade: '9th',\n                ecoPoints: 1150,\n                level: 11,\n                streakDays: 22\n            }\n        ];\n\n        for (const studentData of sampleStudents) {\n            const student = new User(studentData);\n            await student.save();\n        }\n\n        // Create badges\n        console.log('🏆 Creating badges...');\n        const createdBadges = [];\n        for (const badgeData of sampleBadges) {\n            const badge = new Badge(badgeData);\n            await badge.save();\n            createdBadges.push(badge);\n        }\n\n        // Create lessons\n        console.log('📚 Creating lessons...');\n        const createdLessons = [];\n        for (const lessonData of sampleLessons) {\n            const lesson = new Lesson({\n                ...lessonData,\n                createdBy: teacherUser._id\n            });\n            await lesson.save();\n            createdLessons.push(lesson);\n        }\n\n        // Create challenges\n        console.log('🎯 Creating challenges...');\n        const createdChallenges = [];\n        for (const challengeData of sampleChallenges) {\n            // Find appropriate badge for challenge\n            let challengeBadge = null;\n            if (challengeData.title === 'Plant a Tree') {\n                challengeBadge = createdBadges.find(b => b.name === 'Tree Hugger');\n            }\n\n            const challenge = new Challenge({\n                ...challengeData,\n                createdBy: teacherUser._id,\n                badge: challengeBadge ? challengeBadge._id : null\n            });\n            await challenge.save();\n            createdChallenges.push(challenge);\n        }\n\n        // Add some sample participations and completions\n        console.log('📈 Adding sample progress data...');\n        const students = await User.find({ role: 'student' });\n        \n        // Add lesson completions\n        for (const student of students) {\n            const lessonsToComplete = createdLessons.slice(0, Math.floor(Math.random() * 3) + 1);\n            \n            for (const lesson of lessonsToComplete) {\n                student.completedLessons.push({\n                    lessonId: lesson._id,\n                    completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),\n                    score: Math.floor(Math.random() * 30) + 70\n                });\n                student.addEcoPoints(lesson.pointsReward);\n            }\n\n            // Add challenge participations\n            const challengesToJoin = createdChallenges.slice(0, Math.floor(Math.random() * 2) + 1);\n            \n            for (const challenge of challengesToJoin) {\n                challenge.participants.push({\n                    user: student._id,\n                    joinedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000),\n                    status: Math.random() > 0.5 ? 'in_progress' : 'joined'\n                });\n                await challenge.save();\n            }\n\n            // Award some badges\n            const badgesToAward = createdBadges.filter(badge => {\n                if (badge.criteria.type === 'lessons_completed') {\n                    return student.completedLessons.length >= badge.criteria.value;\n                }\n                if (badge.criteria.type === 'points') {\n                    return student.ecoPoints >= badge.criteria.value;\n                }\n                return false;\n            });\n\n            for (const badge of badgesToAward) {\n                if (!student.badges.some(b => b.badgeId.toString() === badge._id.toString())) {\n                    student.badges.push({\n                        badgeId: badge._id,\n                        earnedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)\n                    });\n                }\n            }\n\n            await student.save();\n        }\n\n        console.log('✅ Database seeding completed successfully!');\n        console.log(`📊 Created:`);\n        console.log(`   - ${createdLessons.length} lessons`);\n        console.log(`   - ${createdChallenges.length} challenges`);\n        console.log(`   - ${createdBadges.length} badges`);\n        console.log(`   - ${students.length + 2} users (${students.length} students, 1 teacher, 1 admin)`);\n        \n        console.log('\\n🔑 Test Accounts:');\n        console.log('   Admin: admin@ecolearn.com / admin123');\n        console.log('   Teacher: teacher@ecolearn.com / teacher123');\n        console.log('   Student: arjun@student.com / student123');\n\n    } catch (error) {\n        console.error('❌ Error seeding database:', error);\n        throw error;\n    }\n};\n\nmodule.exports = { seedData };",
          "search_start_line_number": 1
        }
      ]
    }
  ]
}
