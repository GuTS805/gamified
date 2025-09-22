import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
    }
  };

  const features = [
    {
      icon: '📚',
      title: 'Interactive Lessons',
      description: 'Engage with multimedia content covering climate change, sustainability, and environmental science.',
    },
    {
      icon: '🎯',
      title: 'Real-world Challenges',
      description: 'Complete hands-on environmental tasks like tree planting and waste segregation for points.',
    },
    {
      icon: '🏆',
      title: 'Gamified Learning',
      description: 'Earn eco-points, unlock badges, and compete with classmates in sustainability competitions.',
    },
    {
      icon: '📊',
      title: 'Track Progress',
      description: 'Monitor your environmental learning journey with detailed analytics and achievements.',
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Students Engaged' },
    { number: '500+', label: 'Lessons Completed Daily' },
    { number: '1,000+', label: 'Trees Planted' },
    { number: '50+', label: 'Schools Connected' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-green-100">
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 text-6xl opacity-20"
        >
          🌱
        </motion.div>
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-32 right-20 text-5xl opacity-20"
        >
          🌍
        </motion.div>
        <motion.div
          animate={{
            y: [0, -25, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-20 text-4xl opacity-20"
        >
          🌳
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-gradient">Learn.</span>{' '}
            <span className="text-green-600">Act.</span>{' '}
            <span className="text-blue-600">Impact.</span>
          </motion.h1>
          
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed"
          >
            Transform environmental education through gamified learning experiences. 
            Build sustainable habits while competing with peers and making a real difference.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {!user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Learning Today
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/lessons"
                    className="inline-block border-2 border-green-500 text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300"
                  >
                    Explore Lessons
                  </Link>
                </motion.div>
              </>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Continue Learning
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-gradient">GyanSetu?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with proven educational methods 
              to create an engaging environmental learning experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="card-hover bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
              >
                <div className="text-5xl mb-4 animate-bounce-slow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-500">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-white"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl md:text-6xl font-bold mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-lg md:text-xl opacity-90">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-green">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Make a <span className="text-gradient">Difference?</span>
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Join thousands of students who are learning, competing, and creating 
              positive environmental impact every day.
            </p>
            {!user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-block bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Join the Movement
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
