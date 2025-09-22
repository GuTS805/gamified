const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Challenge = require('../models/Challenge');
const Badge = require('../models/Badge');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📡 Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await User.deleteMany({});
        await Lesson.deleteMany({});
        await Challenge.deleteMany({});
        await Badge.deleteMany({});

        // Create admin user
        console.log('👤 Creating admin user...');
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@ecolearn.com',
            password: adminPassword,
            role: 'admin',
            school: 'EcoLearn Platform',
            ecoPoints: 10000,
            level: 100
        });
        await adminUser.save();

        // Create teacher user
        console.log('👩‍🏫 Creating teacher user...');
        const teacherPassword = await bcrypt.hash('teacher123', 10);
        const teacherUser = new User({
            name: 'Environmental Teacher',
            email: 'teacher@ecolearn.com',
            password: teacherPassword,
            role: 'teacher',
            school: 'Green Valley High School',
            ecoPoints: 2500,
            level: 25
        });
        await teacherUser.save();

        // Create sample students
        console.log('👨‍🎓 Creating sample students...');
        const studentPassword = await bcrypt.hash('student123', 10);
        const sampleStudents = [
            {
                name: 'Arjun Sharma',
                email: 'arjun@student.com',
                password: studentPassword,
                role: 'student',
                school: 'Green Valley High School',
                grade: '10th',
                ecoPoints: 1250,
                level: 12,
                streakDays: 15
            },
            {
                name: 'Priya Patel',
                email: 'priya@student.com',
                password: studentPassword,
                role: 'student',
                school: 'Eco International School',
                grade: '11th',
                ecoPoints: 1180,
                level: 11,
                streakDays: 8
            },
            {
                name: 'Rahul Kumar',
                email: 'rahul@student.com',
                password: studentPassword,
                role: 'student',
                school: 'Nature Academy',
                grade: '9th',
                ecoPoints: 1150,
                level: 11,
                streakDays: 22
            }
        ];

        for (const studentData of sampleStudents) {
            const student = new User(studentData);
            await student.save();
        }

        // Create badges
        console.log('🏆 Creating badges...');
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
            }
        ];

        const createdBadges = [];
        for (const badgeData of sampleBadges) {
            const badge = new Badge(badgeData);
            await badge.save();
            createdBadges.push(badge);
        }

        // Create lessons that match frontend data
        console.log('📚 Creating lessons...');
        const sampleLessons = [
            {
                title: 'Climate Change Basics',
                description: 'Understanding global warming, greenhouse effects, and climate science fundamentals.',
                content: `# Climate Change Basics

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

## What Can You Do?
- Reduce energy consumption
- Use renewable energy sources
- Support sustainable transportation
- Practice the 3 Rs: Reduce, Reuse, Recycle`,
                category: 'climate_change',
                difficulty: 'beginner',
                estimatedTime: 120,
                pointsReward: 120,
                thumbnail: '/images/climate-change.jpg',
                objectives: [
                    'Understand the greenhouse effect',
                    'Identify main causes of climate change',
                    'Learn personal actions to combat climate change'
                ],
                keyTakeaways: [
                    'Human activities cause recent climate change',
                    'Everyone can take action to help'
                ],
                isPublished: true,
                views: 485,
                likes: 92
            },
            {
                title: 'Waste Management',
                description: 'Learn the 3 Rs: Reduce, Reuse, Recycle. Master waste segregation and circular economy.',
                content: `# Waste Management Fundamentals

## The 3 Rs Hierarchy

### 1. REDUCE
- Buy only what you need
- Choose products with less packaging
- Repair items instead of replacing them

### 2. REUSE
- Donate items you no longer need
- Repurpose containers and materials
- Give new life to old furniture

### 3. RECYCLE
- Sort waste properly
- Clean containers before recycling
- Know your local recycling guidelines`,
                category: 'waste_management',
                difficulty: 'beginner',
                estimatedTime: 90,
                pointsReward: 90,
                thumbnail: '/images/waste-management.jpg',
                objectives: [
                    'Master the 3 Rs principle',
                    'Learn proper waste segregation',
                    'Implement waste reduction strategies'
                ],
                keyTakeaways: [
                    'Prevention is better than treatment',
                    'Small actions create big impact'
                ],
                isPublished: true,
                views: 392,
                likes: 78
            },
            {
                title: 'Biodiversity Conservation',
                description: 'Explore ecosystems, endangered species, and conservation strategies for protecting nature.',
                content: `# Biodiversity Conservation

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

## How You Can Help
- Support conservation organizations
- Choose sustainable products
- Create wildlife-friendly gardens`,
                category: 'biodiversity',
                difficulty: 'intermediate',
                estimatedTime: 150,
                pointsReward: 150,
                thumbnail: '/images/biodiversity.jpg',
                objectives: [
                    'Understand biodiversity importance',
                    'Learn conservation strategies'
                ],
                keyTakeaways: [
                    'Biodiversity is essential for ecosystem health',
                    'Everyone can contribute to conservation'
                ],
                isPublished: true,
                views: 278,
                likes: 65
            },
            {
                title: 'Renewable Energy',
                description: 'Solar, wind, and hydro power. Understanding sustainable energy solutions for the future.',
                content: `# Renewable Energy

## Types of Renewable Energy

### Solar Power
- Photovoltaic panels convert sunlight to electricity
- Solar thermal systems heat water and buildings
- Clean and abundant energy source

### Wind Power
- Wind turbines generate electricity from moving air
- Offshore and onshore installations
- Growing rapidly worldwide

### Hydroelectric Power
- Uses flowing water to generate electricity
- Dams and run-of-river systems
- Reliable and long-lasting technology`,
                category: 'renewable_energy',
                difficulty: 'advanced',
                estimatedTime: 180,
                pointsReward: 180,
                thumbnail: '/images/renewable-energy.jpg',
                objectives: [
                    'Understand different renewable technologies',
                    'Learn about energy transition'
                ],
                keyTakeaways: [
                    'Renewable energy is becoming cheaper',
                    'Technology is key to clean future'
                ],
                isPublished: true,
                views: 156,
                likes: 43
            },
            {
                title: 'Water Conservation',
                description: 'Protecting our most precious resource through smart usage and conservation techniques.',
                content: `# Water Conservation

## Why Conserve Water?
Water is essential for all life, but fresh water is limited:
- Only 2.5% of Earth's water is fresh
- Growing population increases demand
- Climate change affects water availability

## Water Conservation Methods

### At Home
- Fix leaks immediately
- Install low-flow fixtures
- Collect rainwater
- Use water-efficient appliances

### In Agriculture
- Drip irrigation systems
- Crop rotation and selection
- Soil moisture monitoring`,
                category: 'water_conservation',
                difficulty: 'beginner',
                estimatedTime: 100,
                pointsReward: 100,
                thumbnail: '/images/water-conservation.jpg',
                objectives: [
                    'Understand water scarcity issues',
                    'Learn conservation techniques'
                ],
                keyTakeaways: [
                    'Every drop counts',
                    'Simple changes make big differences'
                ],
                isPublished: true,
                views: 324,
                likes: 71
            },
            {
                title: 'Sustainable Living',
                description: 'Adopt eco-friendly lifestyle choices that reduce your environmental footprint.',
                content: `# Sustainable Living

## What is Sustainable Living?
Living in a way that meets our needs without compromising future generations' ability to meet their needs.

## Key Areas

### Transportation
- Walk, bike, or use public transport
- Choose fuel-efficient vehicles
- Carpool and combine trips

### Food Choices
- Eat more plant-based meals
- Buy local and seasonal produce
- Reduce food waste

### Home Energy
- Use LED light bulbs
- Improve insulation
- Choose renewable energy`,
                category: 'sustainable_living',
                difficulty: 'intermediate',
                estimatedTime: 135,
                pointsReward: 135,
                thumbnail: '/images/sustainable-living.jpg',
                objectives: [
                    'Understand sustainable lifestyle choices',
                    'Learn to reduce environmental footprint'
                ],
                keyTakeaways: [
                    'Small changes lead to big impacts',
                    'Sustainable living benefits everyone'
                ],
                isPublished: true,
                views: 267,
                likes: 58
            }
        ];

        const createdLessons = [];
        for (const lessonData of sampleLessons) {
            const lesson = new Lesson({
                ...lessonData,
                createdBy: teacherUser._id
            });
            await lesson.save();
            createdLessons.push(lesson);
        }

        // Create challenges that match frontend data
        console.log('🎯 Creating challenges...');
        const currentDate = new Date();
        const futureDate = new Date(currentDate.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year from now

        const sampleChallenges = [
            {
                title: 'Plant a Tree',
                description: 'Plant a tree in your community and share a photo with location proof.',
                instructions: [
                    'Choose an appropriate location with permission',
                    'Select a native tree species',
                    'Take a photo with the planted tree'
                ],
                category: 'tree_planting',
                difficulty: 'easy',
                duration: 7,
                pointsReward: 50,
                evidenceRequired: {
                    type: 'photo',
                    description: 'Photo of you with the planted tree',
                    guidelines: ['Clear photo showing you and the tree']
                },
                isActive: true,
                startDate: currentDate,
                endDate: futureDate,
                maxParticipants: 1000,
                tags: ['trees', 'environment'],
                participants: []
            },
            {
                title: 'Zero Waste Week',
                description: 'Challenge yourself to produce zero waste for an entire week.',
                instructions: [
                    'Plan meals to avoid food waste',
                    'Use reusable containers',
                    'Document your efforts daily'
                ],
                category: 'waste_reduction',
                difficulty: 'hard',
                duration: 7,
                pointsReward: 100,
                evidenceRequired: {
                    type: 'multiple',
                    description: 'Daily photo diary',
                    guidelines: ['Document daily waste reduction efforts']
                },
                isActive: true,
                startDate: currentDate,
                endDate: futureDate,
                maxParticipants: 500,
                tags: ['waste', 'lifestyle'],
                participants: []
            },
            {
                title: 'Energy Saver Challenge',
                description: 'Reduce your home energy consumption by 20% this month.',
                instructions: [
                    'Record baseline energy consumption',
                    'Implement energy-saving measures',
                    'Track daily usage'
                ],
                category: 'energy_saving',
                difficulty: 'medium',
                duration: 30,
                pointsReward: 75,
                evidenceRequired: {
                    type: 'document',
                    description: 'Energy bills comparison',
                    guidelines: ['Show before and after bills']
                },
                isActive: true,
                startDate: currentDate,
                endDate: futureDate,
                maxParticipants: 800,
                tags: ['energy', 'home'],
                participants: []
            }
        ];

        const createdChallenges = [];
        for (const challengeData of sampleChallenges) {
            const challenge = new Challenge({
                ...challengeData,
                createdBy: teacherUser._id
            });
            await challenge.save();
            createdChallenges.push(challenge);
        }

        // Add some sample participations
        console.log('📈 Adding sample progress data...');
        const students = await User.find({ role: 'student' });
        
        for (const student of students) {
            // Add random lesson completions
            const lessonsToComplete = createdLessons.slice(0, Math.floor(Math.random() * 3) + 1);
            
            for (const lesson of lessonsToComplete) {
                student.completedLessons.push({
                    lessonId: lesson._id,
                    completedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                    score: Math.floor(Math.random() * 30) + 70
                });
            }

            // Award appropriate badges
            const firstStepsBadge = createdBadges.find(b => b.name === 'First Steps');
            if (firstStepsBadge && student.completedLessons.length > 0) {
                student.badges.push({
                    badgeId: firstStepsBadge._id,
                    earnedAt: new Date()
                });
            }

            await student.save();

            // Add challenge participations
            const randomChallenge = createdChallenges[Math.floor(Math.random() * createdChallenges.length)];
            randomChallenge.participants.push({
                user: student._id,
                joinedAt: new Date(),
                status: 'joined'
            });
            await randomChallenge.save();
        }

        console.log('✅ Database seeding completed successfully!');
        console.log(`📊 Created:`);
        console.log(`   - ${createdLessons.length} lessons`);
        console.log(`   - ${createdChallenges.length} challenges`);
        console.log(`   - ${createdBadges.length} badges`);
        console.log(`   - ${students.length + 2} users`);
        
        console.log('\n🔑 Test Accounts:');
        console.log('   Admin: admin@ecolearn.com / admin123');
        console.log('   Teacher: teacher@ecolearn.com / teacher123');
        console.log('   Student: arjun@student.com / student123');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };
