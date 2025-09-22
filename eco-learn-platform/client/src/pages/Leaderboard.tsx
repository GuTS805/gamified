import React from 'react';
import { motion } from 'framer-motion';

const Leaderboard: React.FC = () => {
  const topUsers = [
    { name: 'Arjun Sharma', school: 'Green Valley High', points: 1250, level: 12, rank: 1 },
    { name: 'Priya Patel', school: 'Eco International School', points: 1180, level: 11, rank: 2 },
    { name: 'Rahul Kumar', school: 'Nature Academy', points: 1150, level: 11, rank: 3 },
    { name: 'Anita Singh', school: 'Earth Science School', points: 980, level: 9, rank: 4 },
    { name: 'Vikram Joshi', school: 'Future Leaders School', points: 920, level: 9, rank: 5 }
  ];

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-orange-500';
      default: return 'text-gray-600';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20"
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Leaderboard</h1>
          <p className="text-xl text-gray-600">
            See how you rank among environmental champions!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6">
            <h2 className="text-2xl font-bold text-white text-center">🏆 Top Eco Champions 🏆</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {topUsers.map((user, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`text-3xl ${getRankColor(user.rank)}`}>
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.school}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          {user.points} pts
                        </div>
                        <div className="text-sm text-gray-500">
                          Level {user.level}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block bg-yellow-100 p-4 rounded-xl"
          >
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-yellow-800 font-semibold">
              Complete more lessons and challenges to climb the leaderboard!
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
