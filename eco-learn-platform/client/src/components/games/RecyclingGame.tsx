import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WasteItem {
  id: string;
  name: string;
  icon: string;
  category: 'recyclable' | 'organic' | 'hazardous' | 'general';
  description: string;
}

interface RecyclingGameProps {
  onComplete: (score: number, totalPoints: number) => void;
  title: string;
}

const RecyclingGame: React.FC<RecyclingGameProps> = ({ onComplete, title }) => {
  const [wasteItems] = useState<WasteItem[]>([
    { id: '1', name: 'Plastic Bottle', icon: '🍼', category: 'recyclable', description: 'Clean plastic bottles can be recycled' },
    { id: '2', name: 'Apple Core', icon: '🍎', category: 'organic', description: 'Organic waste decomposes naturally' },
    { id: '3', name: 'Battery', icon: '🔋', category: 'hazardous', description: 'Batteries contain toxic materials' },
    { id: '4', name: 'Newspaper', icon: '📰', category: 'recyclable', description: 'Paper products are recyclable' },
    { id: '5', name: 'Banana Peel', icon: '🍌', category: 'organic', description: 'Food waste belongs in compost' },
    { id: '6', name: 'Light Bulb', icon: '💡', category: 'hazardous', description: 'Contains mercury and glass' },
    { id: '7', name: 'Aluminum Can', icon: '🥤', category: 'recyclable', description: 'Metal cans are highly recyclable' },
    { id: '8', name: 'Tissues', icon: '🧻', category: 'general', description: 'Used tissues go to general waste' },
    { id: '9', name: 'Glass Jar', icon: '🍯', category: 'recyclable', description: 'Glass containers are recyclable' },
    { id: '10', name: 'Leftover Rice', icon: '🍚', category: 'organic', description: 'Food scraps can be composted' },
  ]);

  const [currentItems, setCurrentItems] = useState<WasteItem[]>([]);
  const [completedItems, setCompletedItems] = useState<WasteItem[]>([]);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [draggedItem, setDraggedItem] = useState<WasteItem | null>(null);
  const [feedback, setFeedback] = useState<{ show: boolean; correct: boolean; message: string }>({
    show: false,
    correct: false,
    message: ''
  });

  const bins = [
    { 
      id: 'recyclable', 
      name: 'Recyclable', 
      icon: '♻️', 
      color: 'bg-blue-500',
      borderColor: 'border-blue-500',
      description: 'Clean plastics, metals, glass, paper'
    },
    { 
      id: 'organic', 
      name: 'Organic', 
      icon: '🌱', 
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      description: 'Food scraps, garden waste'
    },
    { 
      id: 'hazardous', 
      name: 'Hazardous', 
      icon: '⚠️', 
      color: 'bg-red-500',
      borderColor: 'border-red-500',
      description: 'Batteries, chemicals, electronics'
    },
    { 
      id: 'general', 
      name: 'General Waste', 
      icon: '🗑️', 
      color: 'bg-gray-500',
      borderColor: 'border-gray-500',
      description: 'Non-recyclable, non-organic waste'
    }
  ];

  useEffect(() => {
    // Shuffle and set 5 random items for the game
    const shuffled = [...wasteItems].sort(() => 0.5 - Math.random());
    setCurrentItems(shuffled.slice(0, 5));
  }, [wasteItems]);

  const handleDragStart = (item: WasteItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, binCategory: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const isCorrect = draggedItem.category === binCategory;
    const points = isCorrect ? 20 : 0;
    
    setScore(prevScore => prevScore + points);
    setCompletedItems(prev => [...prev, draggedItem]);
    setCurrentItems(prev => prev.filter(item => item.id !== draggedItem.id));

    // Show feedback
    setFeedback({
      show: true,
      correct: isCorrect,
      message: isCorrect 
        ? `✅ Correct! ${draggedItem.description}` 
        : `❌ Incorrect. ${draggedItem.description}`
    });

    // Hide feedback after 2 seconds
    setTimeout(() => {
      setFeedback({ show: false, correct: false, message: '' });
    }, 2000);

    setDraggedItem(null);

    // Check if game is complete
    if (currentItems.length === 1) {
      setTimeout(() => {
        setGameComplete(true);
        onComplete(score + points, score + points);
      }, 2500);
    }
  };


  if (gameComplete) {
    const maxScore = 5 * 20; // 5 items * 20 points each
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-white rounded-2xl shadow-lg"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 0.8, repeat: 2 }}
          className="text-6xl mb-4"
        >
          {percentage >= 80 ? '🏆' : percentage >= 60 ? '🥈' : '🥉'}
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Well Done!' : 'Good Try!'}
        </h3>
        
        <p className="text-lg text-gray-600 mb-4">
          You scored {score} out of {maxScore} points ({percentage}%)
        </p>
        
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-full font-semibold mb-4">
          🌟 +{score} EcoPoints Earned!
        </div>
        
        <div className="text-sm text-gray-600">
          <p className="mb-2">🎯 Items correctly sorted: {completedItems.filter(item => 
            currentItems.concat(completedItems).find(i => i.id === item.id)?.category === item.category
          ).length}/5</p>
          <p>Keep practicing to become a recycling champion! ♻️</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 mb-4">
          Drag and drop waste items into the correct bins to learn proper recycling!
        </p>
        <div className="flex justify-center space-x-8 text-sm">
          <div className="bg-blue-50 px-4 py-2 rounded-full">
            <span className="text-blue-600 font-semibold">Score: {score}</span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-full">
            <span className="text-green-600 font-semibold">
              Items Left: {currentItems.length}
            </span>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`text-center mb-6 p-4 rounded-xl ${
              feedback.correct ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
            }`}
          >
            <p className={`font-semibold ${feedback.correct ? 'text-green-800' : 'text-red-800'}`}>
              {feedback.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Waste Items */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🗑️ Waste Items</h3>
          <div className="grid grid-cols-2 gap-4">
            {currentItems.map((item) => (
              <motion.div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-4 cursor-move hover:border-gray-400 transition-colors"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{item.icon}</div>
                  <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {currentItems.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">✨</div>
              <p>All items sorted!</p>
            </div>
          )}
        </div>

        {/* Recycling Bins */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">♻️ Recycling Bins</h3>
          <div className="grid grid-cols-2 gap-4">
            {bins.map((bin) => (
              <motion.div
                key={bin.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, bin.id)}
                whileHover={{ scale: 1.02 }}
                className={`bg-white border-2 ${bin.borderColor} rounded-xl p-4 min-h-32 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all`}
              >
                <div className="text-4xl mb-2">{bin.icon}</div>
                <h4 className="font-bold text-gray-900 mb-1">{bin.name}</h4>
                <p className="text-xs text-gray-600">{bin.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Clean containers before recycling</li>
              <li>• Composting organic waste reduces methane emissions</li>
              <li>• Hazardous waste needs special disposal</li>
              <li>• When in doubt, check local recycling guidelines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecyclingGame;
