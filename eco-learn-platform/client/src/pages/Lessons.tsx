import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface MiniGame {
  type: 'drag-drop' | 'click-collect' | 'memory-flip' | 'connect-dots' | 'paint-bucket' | 'tap-counter';
  title: string;
  instruction: string;
  items?: { id: string; emoji: string; name: string; category?: string }[];
  targets?: { id: string; emoji: string; name: string }[];
  pairs?: { id: string; emoji: string }[];
  goal?: number;
  successMessage: string;
}

interface LessonTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgGradient: string;
  textColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  lessons: number;
  points: number;
  completionRate: number;
  tags: string[];
  miniGame: MiniGame;
}

const Lessons: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);
  const [gameStates, setGameStates] = useState<{ [key: string]: any }>({});
  
  // Force user to be always available for demo
  const currentUser = user || {
    id: 'demo-user',
    name: 'Demo Student',
    email: 'demo@example.com',
    role: 'student' as const,
    school: 'Demo School',
    ecoPoints: 250,
    level: 3,
    streakDays: 7,
    gameProgress: [],
    badges: []
  };

  const topics: LessonTopic[] = [
    {
      id: 'climate-change',
      title: 'Climate Change Basics',
      description: 'Understanding global warming, greenhouse effects, and climate science fundamentals.',
      icon: '🌍',
      bgGradient: 'from-blue-400 to-cyan-300',
      textColor: 'text-blue-700',
      difficulty: 'Beginner',
      duration: '2-3 hours',
      lessons: 8,
      points: 120,
      completionRate: 85,
      tags: ['Science', 'Global', 'Weather'],
      miniGame: {
        type: 'quiz',
        question: 'What is the main cause of climate change?',
        options: ['Solar flares', 'Human activities', 'Natural cycles', 'Ocean currents'],
        correctAnswer: 1,
        feedback: {
          correct: '🎉 Correct! Human activities like burning fossil fuels are the main cause.',
          incorrect: '❌ Not quite! Human activities are the primary driver of climate change.'
        }
      }
    },
    {
      id: 'waste-management',
      title: 'Waste Management',
      description: 'Learn the 3 Rs: Reduce, Reuse, Recycle. Master waste segregation and circular economy.',
      icon: '♻️',
      bgGradient: 'from-green-400 to-emerald-300',
      textColor: 'text-green-700',
      difficulty: 'Beginner',
      duration: '1-2 hours',
      lessons: 6,
      points: 90,
      completionRate: 92,
      tags: ['Practical', 'Daily Life', 'Action'],
      miniGame: {
        type: 'sorting',
        question: 'Sort this item: Plastic Water Bottle',
        options: ['🗑️ General Waste', '♻️ Recyclable', '🌱 Compost', '⚠️ Hazardous'],
        correctAnswer: 1,
        feedback: {
          correct: '🎉 Perfect! Clean plastic bottles are recyclable!',
          incorrect: '❌ Try again! Plastic bottles should go in recyclable waste.'
        }
      }
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
      lessons: 10,
      points: 150,
      completionRate: 78,
      tags: ['Nature', 'Wildlife', 'Conservation'],
      miniGame: {
        type: 'matching',
        question: 'Match the animal with its conservation status:',
        pairs: [
          { left: '🐼 Panda', right: 'Vulnerable' },
          { left: '🦏 Tiger', right: 'Endangered' },
          { left: '🐘 Elephant', right: 'Endangered' }
        ],
        feedback: {
          correct: '🎉 Great! You know your conservation statuses!',
          incorrect: '❌ Keep learning about wildlife conservation!'
        }
      }
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
      lessons: 12,
      points: 180,
      completionRate: 65,
      tags: ['Technology', 'Innovation', 'Future'],
      miniGame: {
        type: 'slider',
        question: 'What percentage of global electricity should come from renewables by 2030?',
        minValue: 0,
        maxValue: 100,
        targetValue: 70,
        feedback: {
          correct: '🎉 Excellent! 70% renewables by 2030 is the target!',
          incorrect: '❌ Close! The target is around 70% renewable energy by 2030.'
        }
      }
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
      lessons: 7,
      points: 100,
      completionRate: 88,
      tags: ['Resource', 'Conservation', 'Health'],
      miniGame: {
        type: 'choice',
        question: 'Which action saves the most water?',
        options: ['5-minute shower', '10-minute shower', 'Bath', 'Leaving tap running'],
        correctAnswer: 0,
        feedback: {
          correct: '🎉 Correct! Short showers save the most water!',
          incorrect: '❌ Try shorter showers - they use much less water than baths!'
        }
      }
    },
    {
      id: 'sustainable-living',
      title: 'Sustainable Living',
      description: 'Adopt eco-friendly lifestyle choices that reduce your environmental footprint.',
      icon: '🏠',
      bgGradient: 'from-teal-400 to-green-300',
      textColor: 'text-teal-700',
      difficulty: 'Intermediate',
      duration: '3 hours',
      lessons: 9,
      points: 135,
      completionRate: 82,
      tags: ['Lifestyle', 'Home', 'Habits'],
      miniGame: {
        type: 'quiz',
        question: 'Which transport option has the lowest carbon footprint?',
        options: ['🚗 Car', '🚌 Bus', '🚲 Bicycle', '✈️ Airplane'],
        correctAnswer: 2,
        feedback: {
          correct: '🎉 Perfect! Cycling has zero emissions!',
          incorrect: '❌ Bicycles are the most eco-friendly transport option!'
        }
      }
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleGameAnswer = (topicId: string, answer: any, game: MiniGame) => {
    const isCorrect = answer === game.correctAnswer;
    const currentState = gameStates[topicId] || {};
    
    setGameStates({
      ...gameStates,
      [topicId]: {
        ...currentState,
        answered: true,
        correct: isCorrect,
        selectedAnswer: answer,
        feedback: isCorrect ? game.feedback.correct : game.feedback.incorrect
      }
    });
    
    // Clear feedback after 3 seconds
    setTimeout(() => {
      setGameStates(prev => ({
        ...prev,
        [topicId]: {
          ...prev[topicId],
          feedback: null
        }
      }));
    }, 3000);
  };

  const resetGame = (topicId: string) => {
    setGameStates({
      ...gameStates,
      [topicId]: {
        answered: false,
        correct: false,
        selectedAnswer: null,
        feedback: null
      }
    });
  };

  const renderMiniGame = (topic: LessonTopic) => {
    const gameState = gameStates[topic.id] || {};
    const game = topic.miniGame;
    
    if (game.type === 'quiz' || game.type === 'choice' || game.type === 'sorting') {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-3">{game.question}</h4>
          <div className="space-y-2">
            {game.options?.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleGameAnswer(topic.id, index, game)}
                disabled={gameState.answered}
                whileHover={{ scale: gameState.answered ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-3 text-left rounded-lg border transition-all ${
                  gameState.selectedAnswer === index
                    ? gameState.correct
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : 'border-red-500 bg-red-100 text-red-700'
                    : gameState.answered
                    ? index === game.correctAnswer
                      ? 'border-green-500 bg-green-100 text-green-700'
                      : 'border-gray-200 bg-gray-100 text-gray-500'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-white cursor-pointer'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
          {gameState.feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 rounded-lg ${
                gameState.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {gameState.feedback}
            </motion.div>
          )}
          {gameState.answered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => resetGame(topic.id)}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Try Again
            </motion.button>
          )}
        </div>
      );
    }
    
    if (game.type === 'slider') {
      const sliderValue = gameStates[topic.id]?.sliderValue || 50;
      const setSliderValue = (value: number) => {
        setGameStates(prev => ({
          ...prev,
          [topic.id]: {
            ...prev[topic.id],
            sliderValue: value
          }
        }));
      };
      
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-3">{game.question}</h4>
          <div className="mb-4">
            <input
              type="range"
              min={game.minValue}
              max={game.maxValue}
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={gameState.answered}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>{game.minValue}%</span>
              <span className="font-semibold">{sliderValue}%</span>
              <span>{game.maxValue}%</span>
            </div>
          </div>
          <motion.button
            onClick={() => {
              const isCorrect = Math.abs(sliderValue - (game.targetValue || 50)) <= 10;
              handleGameAnswer(topic.id, sliderValue, {
                ...game,
                correctAnswer: game.targetValue
              });
            }}
            disabled={gameState.answered}
            whileHover={{ scale: gameState.answered ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Submit Answer
          </motion.button>
          {gameState.feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-3 p-3 rounded-lg ${
                gameState.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {gameState.feedback}
            </motion.div>
          )}
          {gameState.answered && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                resetGame(topic.id);
                setSliderValue(50);
              }}
              className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🔄 Try Again
            </motion.button>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Floating Background Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-16 left-10 text-4xl opacity-30"
        >
          📚
        </motion.div>
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-32 right-16 text-3xl opacity-30"
        >
          🎓
        </motion.div>
        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [0, 8, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 left-1/4 text-5xl opacity-30"
        >
          🌿
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">Environmental</span>{' '}
              <span className="text-green-600">Lessons</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover interactive lessons designed to build environmental awareness 
              and inspire sustainable action in your daily life.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <span className="text-green-600 font-semibold">📊 {topics.length} Topic Areas</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <span className="text-blue-600 font-semibold">🎯 {topics.reduce((acc, topic) => acc + topic.lessons, 0)} Interactive Lessons</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
                <span className="text-purple-600 font-semibold">🏆 Up to {Math.max(...topics.map(t => t.points))} EcoPoints</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {topics.map((topic, index) => (
              <motion.div
                key={topic.id}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                onHoverStart={() => setHoveredTopic(topic.id)}
                onHoverEnd={() => setHoveredTopic(null)}
                onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                className="relative bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer group"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${topic.bgGradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${topic.bgGradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.completionRate}%` }}
                    transition={{ duration: 1.5, delay: index * 0.1 }}
                  />
                </div>

                <div className="p-8">
                  {/* Icon and Title */}
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      animate={hoveredTopic === topic.id ? {
                        scale: 1.2,
                        rotate: [0, -10, 10, 0]
                      } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-5xl mb-2"
                    >
                      {topic.icon}
                    </motion.div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                        {topic.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className={`text-2xl font-bold mb-3 ${topic.textColor} group-hover:text-gray-900 transition-colors`}>
                    {topic.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {topic.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-500">⏱️</span>
                      <span className="text-gray-600">{topic.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-500">📖</span>
                      <span className="text-gray-600">{topic.lessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">🏆</span>
                      <span className="text-gray-600">{topic.points} points</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-500">📊</span>
                      <span className="text-gray-600">{topic.completionRate}% rate</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${topic.bgGradient} hover:shadow-lg transition-all duration-300`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTopic(selectedTopic === topic.id ? null : topic.id);
                    }}
                  >
                    {selectedTopic === topic.id ? '⬆️ Hide Mini-Game' : '🎮 Play Mini-Game'}
                  </motion.button>
                  
                  {/* Full Course Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-2 py-2 px-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lessons/${topic.id}`);
                    }}
                  >
                    🚀 Full Course
                  </motion.button>
                </div>

                {/* Expanded Details with Mini-Game */}
                {selectedTopic === topic.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-200 bg-gray-50 p-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">🎮 Quick Challenge:</h4>
                        {renderMiniGame(topic)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">What you'll learn:</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            <span>Interactive multimedia content</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            <span>Real-world applications and examples</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            <span>Hands-on activities and challenges</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                            <span>Progress tracking and achievements</span>
                          </li>
                        </ul>
                        
                        <div className="mt-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/lessons/${topic.id}`)}
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${topic.bgGradient} hover:shadow-lg transition-all duration-300`}
                          >
                            🚀 Start Full Course
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Environmental Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students learning to make a positive impact on our planet.
            </p>
            {!currentUser ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-block bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    🌱 Start Learning Free
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/challenges"
                    className="inline-block border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-colors"
                  >
                    🎯 Explore Challenges
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
                  className="inline-block bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  📊 View Your Progress
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Lessons;
