import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface WaterActivity {
  id: string;
  name: string;
  icon: string;
  baseUsage: number; // liters per minute or per use
  unit: 'per_minute' | 'per_use';
  category: 'bathroom' | 'kitchen' | 'laundry' | 'outdoor';
  conservationTips: {
    tip: string;
    waterSaved: number;
    description: string;
  }[];
}

interface WaterSimulatorProps {
  onComplete: (waterSaved: number, ecoPoints: number) => void;
  title: string;
}

const WaterConservationSimulator: React.FC<WaterSimulatorProps> = ({ onComplete, title }) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [totalWaterUsed, setTotalWaterUsed] = useState(0);
  const [totalWaterSaved, setTotalWaterSaved] = useState(0);
  const [selectedTips, setSelectedTips] = useState<string[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const waterActivities: WaterActivity[] = [
    {
      id: 'shower',
      name: 'Taking a Shower',
      icon: '🚿',
      baseUsage: 15,
      unit: 'per_minute',
      category: 'bathroom',
      conservationTips: [
        {
          tip: 'Take 5-minute showers instead of 10 minutes',
          waterSaved: 75,
          description: 'Reducing shower time is the most effective way to save water'
        },
        {
          tip: 'Install a low-flow showerhead',
          waterSaved: 50,
          description: 'Low-flow showerheads reduce water usage by 40-60%'
        },
        {
          tip: 'Turn off water while soaping',
          waterSaved: 30,
          description: 'Navy showers can save significant amounts of water'
        },
        {
          tip: 'Continue normal shower habits',
          waterSaved: 0,
          description: 'No conservation measures taken'
        }
      ]
    },
    {
      id: 'teeth',
      name: 'Brushing Teeth',
      icon: '🦷',
      baseUsage: 6,
      unit: 'per_minute',
      category: 'bathroom',
      conservationTips: [
        {
          tip: 'Turn off tap while brushing',
          waterSaved: 18,
          description: 'Can save up to 3 liters per brushing session'
        },
        {
          tip: 'Use a cup for rinsing',
          waterSaved: 12,
          description: 'Using a cup instead of running water saves 2 liters'
        },
        {
          tip: 'Keep water running throughout',
          waterSaved: 0,
          description: 'No conservation measures taken'
        }
      ]
    },
    {
      id: 'dishes',
      name: 'Washing Dishes',
      icon: '🍽️',
      baseUsage: 25,
      unit: 'per_use',
      category: 'kitchen',
      conservationTips: [
        {
          tip: 'Use a dishwasher (full load)',
          waterSaved: 35,
          description: 'Modern dishwashers use less water than hand washing'
        },
        {
          tip: 'Fill basin instead of running water',
          waterSaved: 20,
          description: 'Washing in a basin uses 80% less water'
        },
        {
          tip: 'Scrape dishes instead of rinsing',
          waterSaved: 15,
          description: 'Pre-rinsing uses unnecessary water'
        },
        {
          tip: 'Wash under running water',
          waterSaved: 0,
          description: 'Traditional method uses most water'
        }
      ]
    },
    {
      id: 'laundry',
      name: 'Doing Laundry',
      icon: '👕',
      baseUsage: 150,
      unit: 'per_use',
      category: 'laundry',
      conservationTips: [
        {
          tip: 'Wait for full loads',
          waterSaved: 75,
          description: 'Full loads use water most efficiently'
        },
        {
          tip: 'Use high-efficiency washer',
          waterSaved: 60,
          description: 'HE washers use 40% less water'
        },
        {
          tip: 'Choose appropriate water level',
          waterSaved: 30,
          description: 'Matching water level to load size saves water'
        },
        {
          tip: 'Use maximum water setting always',
          waterSaved: 0,
          description: 'No conservation measures taken'
        }
      ]
    },
    {
      id: 'garden',
      name: 'Watering Garden',
      icon: '🌱',
      baseUsage: 200,
      unit: 'per_use',
      category: 'outdoor',
      conservationTips: [
        {
          tip: 'Water early morning or evening',
          waterSaved: 80,
          description: 'Reduces evaporation by 60-70%'
        },
        {
          tip: 'Install drip irrigation',
          waterSaved: 120,
          description: 'Drip systems are 90% efficient vs 60% for sprinklers'
        },
        {
          tip: 'Use mulch around plants',
          waterSaved: 40,
          description: 'Mulch reduces water evaporation from soil'
        },
        {
          tip: 'Water during midday',
          waterSaved: 0,
          description: 'Most water is lost to evaporation'
        }
      ]
    }
  ];

  const handleTipSelection = (tip: any) => {
    const activity = waterActivities[currentActivityIndex];
    const waterUsed = activity.baseUsage;
    const waterSaved = tip.waterSaved;
    
    setTotalWaterUsed(prev => prev + waterUsed);
    setTotalWaterSaved(prev => prev + waterSaved);
    setSelectedTips(prev => [...prev, tip.tip]);

    if (currentActivityIndex < waterActivities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      setTimeout(() => {
        setGameComplete(true);
        const ecoPoints = Math.round(totalWaterSaved + waterSaved);
        onComplete(totalWaterSaved + waterSaved, ecoPoints);
      }, 3000);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bathroom': return 'from-blue-400 to-cyan-300';
      case 'kitchen': return 'from-green-400 to-emerald-300';
      case 'laundry': return 'from-purple-400 to-pink-300';
      case 'outdoor': return 'from-yellow-400 to-orange-300';
      default: return 'from-gray-400 to-gray-300';
    }
  };

  const getWaterSavingLevel = (waterSaved: number) => {
    if (waterSaved >= 300) return { level: 'Excellent', color: 'text-green-600', icon: '🌊', description: 'Outstanding water conservation!' };
    if (waterSaved >= 200) return { level: 'Very Good', color: 'text-blue-600', icon: '💧', description: 'Great water saving efforts!' };
    if (waterSaved >= 100) return { level: 'Good', color: 'text-teal-600', icon: '💦', description: 'Good conservation practices!' };
    if (waterSaved >= 50) return { level: 'Fair', color: 'text-yellow-600', icon: '💧', description: 'Some conservation efforts made.' };
    return { level: 'Poor', color: 'text-red-600', icon: '🚰', description: 'More conservation needed.' };
  };

  if (gameComplete) {
    const savingLevel = getWaterSavingLevel(totalWaterSaved);
    const totalPotentialUsage = waterActivities.reduce((acc, activity) => acc + activity.baseUsage, 0);
    const actualUsage = totalPotentialUsage - totalWaterSaved;
    const percentageSaved = Math.round((totalWaterSaved / totalPotentialUsage) * 100);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 1, repeat: 2 }}
            className="text-6xl mb-4"
          >
            {savingLevel.icon}
          </motion.div>
          
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Water Conservation Results</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalWaterSaved}L</div>
              <div className="text-sm text-gray-600">Water Saved</div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-gray-600 mb-2">{actualUsage}L</div>
              <div className="text-sm text-gray-600">Water Used</div>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{percentageSaved}%</div>
              <div className="text-sm text-gray-600">Reduction</div>
            </div>
          </div>

          <div className={`text-2xl font-semibold mb-2 ${savingLevel.color}`}>
            {savingLevel.level} Conservation
          </div>
          <p className="text-gray-600 mb-6">{savingLevel.description}</p>

          <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold mb-8 inline-block">
            🌟 +{Math.round(totalWaterSaved)} EcoPoints Earned!
          </div>
        </div>

        {/* Conservation breakdown */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">💧 Your Water Conservation Choices:</h4>
          {selectedTips.map((tip, index) => {
            const activity = waterActivities[index];
            const selectedTip = activity.conservationTips.find(t => t.tip === tip);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-900">{activity.name}</div>
                      <div className="text-sm text-gray-600">{tip}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      {selectedTip ? `-${selectedTip.waterSaved}L` : '0L'}
                    </div>
                    <div className="text-xs text-gray-500">saved</div>
                  </div>
                </div>
                {selectedTip && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                    <p className="text-sm text-blue-800">💡 {selectedTip.description}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Water conservation facts */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
          <h4 className="font-semibold text-cyan-900 mb-4">🌍 Water Conservation Impact:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-cyan-800">
            <div>• 1 billion people lack access to clean water</div>
            <div>• Water scarcity affects 40% of the global population</div>
            <div>• Agriculture uses 70% of global freshwater</div>
            <div>• Small changes at home can save thousands of liters yearly</div>
          </div>
          <div className="mt-4 p-3 bg-cyan-100 rounded-lg">
            <p className="text-sm text-cyan-800 font-semibold">
              💧 Your annual impact: Saving {totalWaterSaved} liters daily = {(totalWaterSaved * 365).toLocaleString()} liters per year!
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-white rounded-2xl shadow-lg"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-4"
        >
          💧
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Calculating Your Water Impact...</h3>
        <p className="text-lg text-gray-600">Analyzing your conservation choices</p>
      </motion.div>
    );
  }

  const currentActivity = waterActivities[currentActivityIndex];
  const progress = ((currentActivityIndex + 1) / waterActivities.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 mb-6">
          Make choices about daily water activities and see their conservation impact
        </p>
        
        {/* Progress */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <span className="text-sm text-gray-600">
            Activity {currentActivityIndex + 1} of {waterActivities.length}
          </span>
          <div className="w-48 bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Current stats */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
          <div className="bg-blue-50 px-4 py-2 rounded-full">
            <span className="text-blue-600 font-semibold">
              Water Saved: {totalWaterSaved}L
            </span>
          </div>
          <div className="bg-gray-50 px-4 py-2 rounded-full">
            <span className="text-gray-600 font-semibold">
              Water Used: {totalWaterUsed}L
            </span>
          </div>
        </div>
      </div>

      {/* Current Activity */}
      <motion.div
        key={currentActivityIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{currentActivity.icon}</div>
          <div className={`bg-gradient-to-r ${getCategoryColor(currentActivity.category)} text-white px-4 py-2 rounded-full inline-block mb-4 font-semibold`}>
            {currentActivity.category.charAt(0).toUpperCase() + currentActivity.category.slice(1)}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {currentActivity.name}
          </h3>
          <p className="text-gray-600">
            Base usage: {currentActivity.baseUsage} liters {currentActivity.unit === 'per_minute' ? 'per minute' : 'per use'}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Choose your conservation approach:
          </h4>
          
          {currentActivity.conservationTips.map((tip, index) => (
            <motion.button
              key={index}
              onClick={() => handleTipSelection(tip)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-left p-6 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {tip.tip}
                </div>
                <div className="text-right">
                  <div className={`font-bold ${tip.waterSaved > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                    {tip.waterSaved > 0 ? `-${tip.waterSaved}L` : 'No savings'}
                  </div>
                  <div className="text-xs text-gray-500">water saved</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                💡 {tip.description}
              </div>
              
              {/* Water saving indicator */}
              <div className="mt-3 flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      tip.waterSaved > 50 ? 'bg-green-500' : 
                      tip.waterSaved > 20 ? 'bg-yellow-500' : 
                      tip.waterSaved > 0 ? 'bg-orange-500' : 'bg-gray-400'
                    }`}
                    style={{ 
                      width: `${Math.min((tip.waterSaved / Math.max(...currentActivity.conservationTips.map(t => t.waterSaved))) * 100, 100)}%` 
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {tip.waterSaved > 50 ? 'High' : 
                   tip.waterSaved > 20 ? 'Medium' : 
                   tip.waterSaved > 0 ? 'Low' : 'None'} impact
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Water facts sidebar */}
      <div className="mt-8 bg-cyan-50 border border-cyan-200 rounded-xl p-6">
        <h4 className="font-semibold text-cyan-900 mb-3">💡 Did You Know?</h4>
        <div className="text-sm text-cyan-800">
          {currentActivity.category === 'bathroom' && (
            <p>The bathroom accounts for about 60% of indoor water use in most homes. Small changes here have big impacts!</p>
          )}
          {currentActivity.category === 'kitchen' && (
            <p>A running faucet uses about 6 liters per minute. Turning it off while scrubbing can save significant water.</p>
          )}
          {currentActivity.category === 'laundry' && (
            <p>Washing machines are the third-largest water user in homes. Efficient use can save thousands of liters yearly.</p>
          )}
          {currentActivity.category === 'outdoor' && (
            <p>Outdoor watering can account for 30% of total household water use. Smart watering saves both water and money.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterConservationSimulator;
