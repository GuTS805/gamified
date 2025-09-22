import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  participants: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  requirements: string[];
  bgGradient: string;
  status: 'upcoming' | 'active' | 'ending_soon';
  endDate: string;
}

const Challenges: React.FC = () => {
  const { user } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const challenges: Challenge[] = [
    {
      id: 'plant-tree',
      title: 'Plant a Tree',
      description: 'Plant a tree in your community and share a photo with location proof.',
      icon: '🌳',
      points: 50,
      participants: 1245,
      duration: '7 days',
      difficulty: 'Easy',
      category: 'Conservation',
      requirements: ['Photo evidence', 'GPS location', 'Tree species identification'],
      bgGradient: 'from-green-500 to-emerald-400',
      status: 'active',
      endDate: '2024-10-15'
    },
    {
      id: 'zero-waste',
      title: 'Zero Waste Week',
      description: 'Challenge yourself to produce zero waste for an entire week.',
      icon: '♻️',
      points: 100,
      participants: 892,
      duration: '7 days',
      difficulty: 'Hard',
      category: 'Lifestyle',
      requirements: ['Daily photo diary', 'Waste audit', 'Alternatives documentation'],
      bgGradient: 'from-blue-500 to-cyan-400',
      status: 'active',
      endDate: '2024-10-20'
    },
    {
      id: 'energy-saver',
      title: 'Energy Saver Challenge',
      description: 'Reduce your home energy consumption by 20% this month.',
      icon: '⚡',
      points: 75,
      participants: 1567,
      duration: '30 days',
      difficulty: 'Medium',
      category: 'Energy',
      requirements: ['Energy meter readings', 'Weekly progress photos', 'Action plan'],
      bgGradient: 'from-yellow-500 to-orange-400',
      status: 'ending_soon',
      endDate: '2024-10-25'
    },
    {
      id: 'water-hero',
      title: 'Water Conservation Hero',
      description: 'Implement water-saving techniques and track your usage reduction.',
      icon: '💧',
      points: 60,
      participants: 734,
      duration: '14 days',
      difficulty: 'Easy',
      category: 'Conservation',
      requirements: ['Water usage tracking', 'Conservation methods video', 'Results summary'],
      bgGradient: 'from-cyan-500 to-blue-400',
      status: 'active',
      endDate: '2024-11-01'
    },
    {
      id: 'plastic-free',
      title: 'Plastic-Free Champion',
      description: 'Eliminate single-use plastics from your daily routine for 2 weeks.',
      icon: '🥤',
      points: 85,
      participants: 623,
      duration: '14 days',
      difficulty: 'Medium',
      category: 'Lifestyle',
      requirements: ['Alternative products showcase', 'Daily challenge log', 'Impact measurement'],
      bgGradient: 'from-purple-500 to-pink-400',
      status: 'upcoming',
      endDate: '2024-11-10'
    },
    {
      id: 'eco-transport',
      title: 'Eco Transport Week',
      description: 'Use only eco-friendly transportation methods for one week.',
      icon: '🚲',
      points: 65,
      participants: 456,
      duration: '7 days',
      difficulty: 'Medium',
      category: 'Transport',
      requirements: ['Transportation log', 'Route photos', 'Carbon footprint calculation'],
      bgGradient: 'from-indigo-500 to-purple-400',
      status: 'upcoming',
      endDate: '2024-11-05'
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'ending_soon': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'upcoming': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredChallenges = filter === 'all' 
    ? challenges 
    : challenges.filter(challenge => challenge.status === filter);

  const categories = ['all', 'active', 'ending_soon', 'upcoming'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Floating Background Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-16 right-10 text-6xl opacity-20"
        >
          🎯
        </motion.div>
        <motion.div
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-32 left-16 text-4xl opacity-20"
        >
          🏆
        </motion.div>
        <motion.div
          animate={{
            rotate: [0, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-1/4 text-5xl opacity-20"
        >
          🌍
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Environmental</span>{' '}
              <span className="text-green-600">Challenges</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take on real-world environmental challenges, earn points, and make a 
              measurable impact on our planet's future.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <span className="text-green-600 font-semibold">🎯 {challenges.length} Active Challenges</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <span className="text-blue-600 font-semibold">👥 {challenges.reduce((acc, c) => acc + c.participants, 0).toLocaleString()} Participants</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <span className="text-purple-600 font-semibold">🏆 Up to {Math.max(...challenges.map(c => c.points))} EcoPoints</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  filter === category
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                {category !== 'all' && (
                  <span className="ml-2 text-xs opacity-75">
                    ({challenges.filter(c => c.status === category).length})
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                onClick={() => setSelectedChallenge(selectedChallenge === challenge.id ? null : challenge.id)}
                className="relative bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer group"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(challenge.status)}`}>
                    {challenge.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${challenge.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="p-8 relative z-10">
                  {/* Icon and Difficulty */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{
                        scale: 1.2,
                        rotate: [0, -5, 5, 0]
                      }}
                      transition={{ duration: 0.5 }}
                      className="text-5xl"
                    >
                      {challenge.icon}
                    </motion.div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {challenge.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {challenge.description}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">🏆</span>
                      <span className="text-gray-600">{challenge.points} points</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-500">👥</span>
                      <span className="text-gray-600">{challenge.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-500">⏰</span>
                      <span className="text-gray-600">{challenge.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">🏷️</span>
                      <span className="text-gray-600">{challenge.category}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${challenge.bgGradient} hover:shadow-lg transition-all duration-300`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        window.location.href = '/login';
                      } else {
                        console.log(`Joining challenge: ${challenge.title}`);
                      }
                    }}
                  >
                    {user ? '🚀 Join Challenge' : '🔐 Login to Join'}
                  </motion.button>
                </div>

                {/* Expanded Details */}
                {selectedChallenge === challenge.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 bg-gray-50 p-6"
                  >
                    <h4 className="font-bold text-gray-900 mb-3">Requirements:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {challenge.requirements.map((req, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <p className="text-sm text-gray-600">
                        <strong>Ends:</strong> {new Date(challenge.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make a Real Impact?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join our community of environmental champions taking action for our planet.
            </p>
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    🌱 Join the Movement
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/lessons"
                    className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                  >
                    📚 Learn First
                  </Link>
                </motion.div>
              </div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  📊 Track Your Impact
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Challenges;
