import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Environmental education lessons data
const environmentalLessons = [
  {
    id: 'climate-change',
    title: 'Climate Change Basics',
    description: 'Understanding global warming, greenhouse effects, and climate science fundamentals.',
    icon: '🌍',
    bgGradient: 'from-blue-400 to-cyan-300',
    textColor: 'text-blue-700',
    difficulty: 'Beginner',
    duration: '2-3 hours',
    points: 120,
    progress: 45,
    games: 4,
    realWorldImpact: 'Learn how your daily choices affect global climate patterns',
    localRelevance: 'Understand monsoon changes and extreme weather in India',
    isNew: true
  },
  {
    id: 'waste-management',
    title: 'Waste Management & Circular Economy',
    description: 'Master the 3Rs: Reduce, Reuse, Recycle. Learn waste segregation and circular economy principles.',
    icon: '♻️',
    bgGradient: 'from-green-400 to-emerald-300',
    textColor: 'text-green-700',
    difficulty: 'Beginner',
    duration: '1-2 hours',
    points: 90,
    progress: 0,
    games: 3,
    realWorldImpact: 'Implement zero-waste practices in your school and community',
    localRelevance: 'Address India\'s growing waste crisis in urban areas',
    isNew: false
  },
  {
    id: 'water-conservation',
    title: 'Water Conservation',
    description: 'Protecting our most precious resource through smart usage and conservation techniques.',
    icon: '💧',
    bgGradient: 'from-cyan-400 to-blue-300',
    textColor: 'text-cyan-700',
    difficulty: 'Beginner',
    duration: '2 hours',
    points: 100,
    progress: 80,
    games: 3,
    realWorldImpact: 'Save thousands of liters through simple daily changes',
    localRelevance: 'Address water scarcity challenges across Indian states',
    isNew: false
  },
  {
    id: 'biodiversity',
    title: 'Biodiversity Conservation',
    description: 'Explore ecosystems, endangered species, and conservation strategies for protecting nature.',
    icon: '🌱',
    bgGradient: 'from-green-500 to-lime-400',
    textColor: 'text-green-800',
    difficulty: 'Intermediate',
    duration: '3-4 hours',
    points: 150,
    progress: 20,
    games: 5,
    realWorldImpact: 'Participate in local wildlife conservation efforts',
    localRelevance: 'Protect India\'s rich biodiversity hotspots and endemic species',
    isNew: false
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy',
    description: 'Solar, wind, and hydro power. Understanding sustainable energy solutions for the future.',
    icon: '⚡',
    bgGradient: 'from-yellow-400 to-orange-300',
    textColor: 'text-yellow-700',
    difficulty: 'Advanced',
    duration: '4-5 hours',
    points: 180,
    progress: 0,
    games: 6,
    realWorldImpact: 'Advocate for clean energy adoption in your community',
    localRelevance: 'Support India\'s ambitious renewable energy targets',
    isNew: true
  },
  {
    id: 'sustainable-living',
    title: 'Sustainable Lifestyle',
    description: 'Practical tips for eco-friendly daily choices, from food to fashion to transportation.',
    icon: '🌿',
    bgGradient: 'from-teal-400 to-green-400',
    textColor: 'text-teal-700',
    difficulty: 'Intermediate',
    duration: '2-3 hours',
    points: 130,
    progress: 60,
    games: 4,
    realWorldImpact: 'Transform your lifestyle to reduce environmental footprint',
    localRelevance: 'Adopt sustainable practices suited to Indian lifestyle and culture',
    isNew: false
  }
];

const achievements = [
  { title: 'Eco Warrior', icon: '🏆', description: 'Complete 3 lessons', unlocked: true },
  { title: 'Climate Hero', icon: '🌟', description: 'Score 90%+ in climate lesson', unlocked: true },
  { title: 'Water Guardian', icon: '💧', description: 'Master water conservation', unlocked: false },
  { title: 'Green Champion', icon: '🌱', description: 'Complete all lessons', unlocked: false }
];


const LessonsPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredLessons = environmentalLessons.filter(lesson => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'beginner') return lesson.difficulty === 'Beginner';
    if (selectedFilter === 'intermediate') return lesson.difficulty === 'Intermediate';
    if (selectedFilter === 'advanced') return lesson.difficulty === 'Advanced';
    if (selectedFilter === 'new') return lesson.isNew;
    return true;
  });

  const totalPoints = environmentalLessons.reduce((sum, lesson) => sum + (lesson.points * lesson.progress / 100), 0);
  const completedLessons = environmentalLessons.filter(lesson => lesson.progress === 100).length;
  const averageProgress = environmentalLessons.reduce((sum, lesson) => sum + lesson.progress, 0) / environmentalLessons.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Hero Section with Parallax Effect */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white py-20"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🌍 Environmental Learning Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover, Learn, and Act for a Sustainable Future. Join millions of students across India in building environmental awareness through interactive lessons and real-world challenges.
            </p>
            <div className="flex justify-center space-x-6 text-sm md:text-base">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">📚 {environmentalLessons.length} Interactive Lessons</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">🎮 25+ Gamified Activities</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="font-semibold">🌱 Real-World Impact</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-20 left-10 text-4xl opacity-30"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🌿
        </motion.div>
        <motion.div 
          className="absolute bottom-20 right-10 text-4xl opacity-30"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          💧
        </motion.div>
      </motion.section>

      {/* Stats Dashboard */}
      <motion.section 
        className="py-16 bg-white/50 backdrop-blur-sm"
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-green-600 mb-2">{Math.round(totalPoints)}</div>
              <div className="text-gray-600 text-sm">EcoPoints Earned</div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{completedLessons}/{environmentalLessons.length}</div>
              <div className="text-gray-600 text-sm">Lessons Completed</div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round(averageProgress)}%</div>
              <div className="text-gray-600 text-sm">Average Progress</div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl font-bold text-orange-600 mb-2">🏆</div>
              <div className="text-gray-600 text-sm">Eco Warrior Level</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Filter Tabs */}
        <motion.div 
          className="flex justify-center space-x-2 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { id: 'all', label: 'All Lessons', icon: '📚' },
            { id: 'beginner', label: 'Beginner', icon: '🌱' },
            { id: 'intermediate', label: 'Intermediate', icon: '🌿' },
            { id: 'advanced', label: 'Advanced', icon: '🌳' },
            { id: 'new', label: 'New', icon: '✨' }
          ].map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedFilter === filter.id
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-green-100 shadow-md hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{filter.icon}</span>
              {filter.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredLessons.map((lesson, index) => (
              <motion.div
                key={lesson.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
                onHoverStart={() => setHoveredCard(lesson.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="group"
              >
                <Link to={`/lesson/${lesson.id}`} className="block">
                  <motion.div
                    className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 h-full ${
                      hoveredCard === lesson.id ? 'shadow-2xl -translate-y-3' : 'hover:shadow-xl hover:-translate-y-1'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Card Header with Gradient */}
                    <div className={`h-48 bg-gradient-to-br ${lesson.bgGradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      
                      {/* Floating Icon */}
                      <motion.div
                        className="absolute top-6 left-6 text-6xl opacity-90"
                        animate={hoveredCard === lesson.id ? { 
                          scale: [1, 1.2, 1], 
                          rotate: [0, 10, -10, 0] 
                        } : {}}
                        transition={{ duration: 0.6 }}
                      >
                        {lesson.icon}
                      </motion.div>

                      {/* New Badge */}
                      {lesson.isNew && (
                        <motion.div 
                          className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          NEW!
                        </motion.div>
                      )}

                      {/* Progress Ring */}
                      <div className="absolute bottom-4 right-4">
                        <div className="relative w-16 h-16">
                          <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              className="text-white/30"
                            />
                            <motion.circle
                              cx="32"
                              cy="32"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 28}`}
                              strokeDashoffset={`${2 * Math.PI * 28 * (1 - lesson.progress / 100)}`}
                              className="text-white"
                              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - lesson.progress / 100) }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                            {lesson.progress}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${lesson.textColor} bg-opacity-20`}>
                          {lesson.difficulty}
                        </span>
                        <span className="text-gray-500 text-sm">{lesson.duration}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                        {lesson.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {lesson.description}
                      </p>

                      {/* Impact Badges */}
                      <div className="space-y-2 mb-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                          <div className="text-xs font-semibold text-blue-700 mb-1">🌍 Global Impact</div>
                          <div className="text-xs text-blue-600">{lesson.realWorldImpact}</div>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                          <div className="text-xs font-semibold text-orange-700 mb-1">🇮🇳 Local Relevance</div>
                          <div className="text-xs text-orange-600">{lesson.localRelevance}</div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>🎮 {lesson.games} Games</span>
                          <span>⭐ {lesson.points} Points</span>
                        </div>
                        
                        <motion.div
                          className="text-green-600 font-semibold"
                          animate={hoveredCard === lesson.id ? { x: [0, 5, 0] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          Start →
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      initial={false}
                      animate={{ opacity: hoveredCard === lesson.id ? 1 : 0 }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Achievements Section */}
        <motion.section 
          className="mt-20 bg-white rounded-3xl shadow-xl p-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            🏆 Your Environmental Achievements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                className={`text-center p-6 rounded-2xl transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 shadow-lg' 
                    : 'bg-gray-50 border-2 border-gray-200 opacity-60'
                }`}
                whileHover={achievement.unlocked ? { scale: 1.05, y: -5 } : {}}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div 
                  className="text-4xl mb-3"
                  animate={achievement.unlocked ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                >
                  {achievement.icon}
                </motion.div>
                <h3 className={`font-bold mb-2 ${achievement.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                  {achievement.title}
                </h3>
                <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                  {achievement.description}
                </p>
                {achievement.unlocked && (
                  <motion.div 
                    className="mt-3 text-green-600 font-semibold text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    ✓ Unlocked!
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            🌱 Start Your Eco Journey Today!
          </motion.button>
          <p className="text-gray-600 mt-4">
            Join thousands of students making a difference for our planet
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LessonsPage;
