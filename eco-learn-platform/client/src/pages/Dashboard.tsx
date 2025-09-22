import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900">Please log in to view your dashboard</h2>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'EcoPoints', value: user.ecoPoints || 0, icon: '🏆', color: 'green' },
    { label: 'Level', value: user.level || 1, icon: '⭐', color: 'yellow' },
    { label: 'Streak', value: user.streakDays || 0, icon: '🔥', color: 'red' },
    { label: 'Badges', value: user.badges?.length || 0, icon: '🎖️', color: 'blue' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-gray-900 mb-2"
          >
            Welcome back, {user.name}! 👋
          </motion.h1>
          <p className="text-xl text-gray-600">
            {user.school} • {user.role === 'student' ? `Grade ${user.grade}` : 'Teacher'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center card-hover"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="font-medium">Completed lesson: "Climate Change Basics"</p>
                  <p className="text-sm text-gray-600">+20 EcoPoints • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-medium">Joined challenge: "Water Conservation Week"</p>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <span className="text-2xl">🏆</span>
                <div>
                  <p className="font-medium">Earned badge: "Sustainability Champion"</p>
                  <p className="text-sm text-gray-600">3 days ago</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recommended Actions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended for You</h2>
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border-2 border-green-200 rounded-lg cursor-pointer hover:border-green-400 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h3 className="font-bold text-green-700">Start "Renewable Energy" lesson</h3>
                    <p className="text-sm text-gray-600">Earn up to 25 EcoPoints</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border-2 border-blue-200 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌳</span>
                  <div>
                    <h3 className="font-bold text-blue-700">Join "Plant a Tree" challenge</h3>
                    <p className="text-sm text-gray-600">50 EcoPoints reward</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 border-2 border-purple-200 rounded-lg cursor-pointer hover:border-purple-400 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📝</span>
                  <div>
                    <h3 className="font-bold text-purple-700">Take quiz on Waste Management</h3>
                    <p className="text-sm text-gray-600">Test your knowledge</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
