import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tap {
  id: string;
  x: number;
  y: number;
  isLeaking: boolean;
  leakRate: number; // liters per second
  isFixed: boolean;
  repairProgress: number;
}

interface Pipe {
  id: string;
  x: number;
  y: number;
  isBroken: boolean;
  isFixed: boolean;
  repairProgress: number;
  leakRate: number;
}

interface Level {
  level: number;
  taps: number;
  pipes: number;
  timeLimit: number;
  targetSavings: number;
  description: string;
}

interface WaterSaverChallengeProps {
  onComplete: (waterSaved: number, ecoPoints: number) => void;
  title: string;
}

const WaterSaverChallenge: React.FC<WaterSaverChallengeProps> = ({ onComplete, title }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [taps, setTaps] = useState<Tap[]>([]);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [waterWasted, setWaterWasted] = useState(0);
  const [waterSaved, setWaterSaved] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [repairTools, setRepairTools] = useState(3);
  const [levelComplete, setLevelComplete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const levels: Level[] = [
    {
      level: 1,
      taps: 3,
      pipes: 2,
      timeLimit: 60,
      targetSavings: 50,
      description: "Stop the basic leaks! Close taps and fix simple pipe breaks."
    },
    {
      level: 2,
      taps: 5,
      pipes: 3,
      timeLimit: 90,
      targetSavings: 100,
      description: "More leaks appear! Manage multiple taps and pipe repairs efficiently."
    },
    {
      level: 3,
      taps: 7,
      pipes: 5,
      timeLimit: 120,
      targetSavings: 200,
      description: "Water crisis! Handle maximum leaks with limited repair tools."
    }
  ];

  const currentLevelData = levels[currentLevel - 1];

  // Initialize level
  useEffect(() => {
    if (currentLevelData) {
      initializeLevel();
    }
  }, [currentLevel]);

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, timeLeft]);

  // Water waste calculation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive) {
      interval = setInterval(() => {
        let wasteRate = 0;

        taps.forEach(tap => {
          if (tap.isLeaking && !tap.isFixed) {
            wasteRate += tap.leakRate;
          }
        });

        pipes.forEach(pipe => {
          if (pipe.isBroken && !pipe.isFixed) {
            wasteRate += pipe.leakRate;
          }
        });

        setWaterWasted(prev => prev + wasteRate);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, taps, pipes]);

  const initializeLevel = () => {
    if (!gameAreaRef.current) return;

    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const newTaps: Tap[] = [];
    const newPipes: Pipe[] = [];

    // Generate taps
    for (let i = 0; i < currentLevelData.taps; i++) {
      newTaps.push({
        id: `tap-${i}`,
        x: Math.random() * 80 + 10, // 10-90% of container width
        y: Math.random() * 60 + 20, // 20-80% of container height
        isLeaking: Math.random() > 0.3, // 70% chance of leaking
        leakRate: 2 + Math.random() * 3, // 2-5 liters per second
        isFixed: false,
        repairProgress: 0
      });
    }

    // Generate pipes
    for (let i = 0; i < currentLevelData.pipes; i++) {
      newPipes.push({
        id: `pipe-${i}`,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        isBroken: Math.random() > 0.4, // 60% chance of being broken
        isFixed: false,
        repairProgress: 0,
        leakRate: 3 + Math.random() * 4 // 3-7 liters per second
      });
    }

    setTaps(newTaps);
    setPipes(newPipes);
    setWaterWasted(0);
    setWaterSaved(0);
    setTimeLeft(currentLevelData.timeLimit);
    setRepairTools(Math.max(2, currentLevel));
    setLevelComplete(false);
    setSelectedItem(null);
  };

  const startGame = () => {
    setGameActive(true);
  };

  const endGame = () => {
    setGameActive(false);
    const totalSaved = Math.max(0, currentLevelData.targetSavings - waterWasted);
    setWaterSaved(totalSaved);

    if (currentLevel < levels.length && totalSaved >= currentLevelData.targetSavings) {
      setLevelComplete(true);
    } else {
      setGameComplete(true);
      const finalPoints = Math.round(totalSaved * 2);
      onComplete(totalSaved, finalPoints);
    }
  };

  const nextLevel = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel(prev => prev + 1);
      setLevelComplete(false);
    } else {
      setGameComplete(true);
      const finalPoints = Math.round(waterSaved * 2);
      onComplete(waterSaved, finalPoints);
    }
  };

  const handleTapClick = (tapId: string) => {
    if (!gameActive || repairTools <= 0) return;

    setTaps(prev => prev.map(tap => {
      if (tap.id === tapId && tap.isLeaking && !tap.isFixed) {
        setRepairTools(tools => tools - 1);
        const saved = tap.leakRate * (timeLeft);
        setWaterSaved(prevSaved => prevSaved + saved);
        return { ...tap, isFixed: true, isLeaking: false };
      }
      return tap;
    }));

    setSelectedItem(tapId);
    setTimeout(() => setSelectedItem(null), 500);
  };

  const handlePipeClick = (pipeId: string) => {
    if (!gameActive || repairTools <= 0) return;

    setPipes(prev => prev.map(pipe => {
      if (pipe.id === pipeId && pipe.isBroken && !pipe.isFixed) {
        setRepairTools(tools => tools - 1);
        const saved = pipe.leakRate * (timeLeft);
        setWaterSaved(prevSaved => prevSaved + saved);
        return { ...pipe, isFixed: true, isBroken: false };
      }
      return pipe;
    }));

    setSelectedItem(pipeId);
    setTimeout(() => setSelectedItem(null), 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameComplete) {
    const efficiency = Math.round((waterSaved / (waterSaved + waterWasted)) * 100) || 0;
    const maxPossiblePoints = levels.reduce((acc, level) => acc + level.targetSavings, 0) * 2;
    const earnedPoints = Math.round(waterSaved * 2);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 1, repeat: 2 }}
          className="text-6xl mb-4"
        >
          {efficiency >= 80 ? '🏆' : efficiency >= 60 ? '💧' : '🚰'}
        </motion.div>

        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Water Saver Challenge Complete!
        </h3>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">{Math.round(waterSaved)}L</div>
            <div className="text-sm text-gray-600">Water Saved</div>
          </div>
          <div className="bg-red-50 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-red-600 mb-2">{Math.round(waterWasted)}L</div>
            <div className="text-sm text-gray-600">Water Wasted</div>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-green-600 mb-2">{efficiency}%</div>
            <div className="text-sm text-gray-600">Efficiency</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-8 py-4 rounded-full font-semibold mb-8 inline-block">
          🌟 +{earnedPoints} EcoPoints Earned!
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6 mb-6">
          <h4 className="font-semibold text-cyan-900 mb-4">🎯 Level Performance:</h4>
          <div className="space-y-2 text-sm text-cyan-800">
            {levels.slice(0, currentLevel).map((level, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>Level {level.level}: {level.description}</span>
                <span className="font-semibold">
                  {index < currentLevel - 1 ? '✅ Complete' : waterSaved >= level.targetSavings ? '✅ Complete' : '❌ Failed'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h4 className="font-semibold text-blue-900 mb-3">💡 Water Conservation Tips:</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Fix leaks immediately - a single dripping tap can waste 3,000+ liters annually</p>
            <p>• Check pipes regularly to prevent major water loss</p>
            <p>• Use water-efficient fixtures and appliances</p>
            <p>• Report community leaks to local authorities</p>
            <p>• Every drop saved makes a difference for our planet! 🌍</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (levelComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.8, repeat: 3 }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-900 mb-4">Level {currentLevel} Complete!</h3>

        <p className="text-lg text-gray-600 mb-6">
          Great job! You saved {Math.round(waterSaved)} liters of water.
        </p>

        <div className="bg-green-100 border border-green-300 rounded-xl p-4 mb-6">
          <p className="text-green-800">
            🏆 Target: {currentLevelData.targetSavings}L | Your Achievement: {Math.round(waterSaved)}L
          </p>
        </div>

        {currentLevel < levels.length && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextLevel}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg"
          >
            Continue to Level {currentLevel + 1} 🚀
          </motion.button>
        )}
      </motion.div>
    );
  }

  if (!gameActive) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <div className="text-6xl mb-4">💧</div>
          <p className="text-lg text-gray-600 mb-6">
            Water taps are leaking and pipes are broken! Use your repair tools to stop the waste and save precious water.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Level {currentLevel}</h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-3">🎯 Mission</h4>
              <p className="text-blue-800 text-sm mb-4">{currentLevelData.description}</p>
              <div className="space-y-2 text-sm text-blue-700">
                <div>🚰 Leaking Taps: {currentLevelData.taps}</div>
                <div>🔧 Broken Pipes: {currentLevelData.pipes}</div>
                <div>⏰ Time Limit: {formatTime(currentLevelData.timeLimit)}</div>
                <div>💧 Target Savings: {currentLevelData.targetSavings}L</div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h4 className="font-semibold text-green-900 mb-3">🎮 How to Play</h4>
              <div className="space-y-2 text-sm text-green-800">
                <div>• Click on leaking taps to close them instantly</div>
                <div>• Click on broken pipes to repair them</div>
                <div>• Each repair uses one repair tool</div>
                <div>• Stop leaks quickly to save more water</div>
                <div>• Reach the target savings to advance!</div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg"
            >
              🚀 Start Water Saving Mission
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Level {currentLevel} - Water Crisis!</h2>

        <div className="flex justify-center space-x-4 mb-4 flex-wrap gap-2">
          <div className="bg-red-50 px-4 py-2 rounded-full border border-red-200">
            <span className="text-red-600 font-semibold">⏰ {formatTime(timeLeft)}</span>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
            <span className="text-blue-600 font-semibold">💧 Saved: {Math.round(waterSaved)}L</span>
          </div>
          <div className="bg-red-50 px-4 py-2 rounded-full border border-red-200">
            <span className="text-red-600 font-semibold">🚰 Wasted: {Math.round(waterWasted)}L</span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-full border border-green-200">
            <span className="text-green-600 font-semibold">🔧 Tools: {repairTools}</span>
          </div>
        </div>

        <div className="max-w-md mx-auto bg-gray-200 rounded-full h-3">
          <motion.div
            className="h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((waterSaved / currentLevelData.targetSavings) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Target: {currentLevelData.targetSavings}L saved
        </p>
      </div>

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative bg-gradient-to-b from-sky-100 to-blue-200 rounded-2xl p-8 shadow-lg"
        style={{ height: '500px', overflow: 'hidden' }}
      >
        <div className="absolute inset-0 bg-pattern opacity-20"></div>

        {/* Taps */}
        {taps.map((tap) => (
          <motion.div
            key={tap.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${selectedItem === tap.id ? 'z-20' : 'z-10'}`}
            style={{ left: `${tap.x}%`, top: `${tap.y}%` }}
            onClick={() => handleTapClick(tap.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={selectedItem === tap.id ? { scale: [1, 1.3, 1] } : {}}
          >
            <div className={`relative p-3 rounded-full shadow-lg transition-all duration-300 ${tap.isFixed ? 'bg-green-100 border-2 border-green-400' :
                tap.isLeaking ? 'bg-red-100 border-2 border-red-400' :
                  'bg-blue-100 border-2 border-blue-400'
              }`}>
              <div className="text-3xl">
                {tap.isFixed ? '✅' : tap.isLeaking ? '🚰' : '🚿'}
              </div>

              {/* Water drip animation for leaking taps */}
              {tap.isLeaking && !tap.isFixed && (
                <motion.div
                  className="absolute top-full left-1/2 transform -translate-x-1/2"
                  animate={{ y: [0, 20, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="text-blue-500 text-lg">💧</div>
                </motion.div>
              )}
            </div>

            {tap.isLeaking && !tap.isFixed && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded shadow text-xs font-semibold text-red-600">
                -{tap.leakRate.toFixed(1)}L/s
              </div>
            )}
          </motion.div>
        ))}

        {/* Pipes */}
        {pipes.map((pipe) => (
          <motion.div
            key={pipe.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${selectedItem === pipe.id ? 'z-20' : 'z-10'}`}
            style={{ left: `${pipe.x}%`, top: `${pipe.y}%` }}
            onClick={() => handlePipeClick(pipe.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={selectedItem === pipe.id ? { scale: [1, 1.3, 1] } : {}}
          >
            <div className={`relative p-3 rounded-full shadow-lg transition-all duration-300 ${pipe.isFixed ? 'bg-green-100 border-2 border-green-400' :
                pipe.isBroken ? 'bg-red-100 border-2 border-red-400' :
                  'bg-gray-100 border-2 border-gray-400'
              }`}>
              <div className="text-3xl">
                {pipe.isFixed ? '✅' : pipe.isBroken ? '🔧' : '🔩'}
              </div>

              {/* Water leak animation for broken pipes */}
              {pipe.isBroken && !pipe.isFixed && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-blue-400 text-sm"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    💦💦
                  </motion.div>
                </div>
              )}
            </div>

            {pipe.isBroken && !pipe.isFixed && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded shadow text-xs font-semibold text-red-600">
                -{pipe.leakRate.toFixed(1)}L/s
              </div>
            )}
          </motion.div>
        ))}

        {/* Repair tools warning */}
        {repairTools === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl text-center shadow-xl">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Repair Tools Left!</h3>
              <p className="text-gray-600">Wait for the timer to run out...</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-cyan-50 border border-cyan-200 rounde
      d-xl p-4">
        <p className="text-cyan-800 text-sm text-center">
          💡 <strong>Quick tip:</strong> Click on red items (🚰 leaking taps and 🔧 broken pipes) to fix them instantly. Each repair saves water for the remaining time!
        </p>
      </div>
    </div>
  );
};

export default WaterSaverChallenge;
