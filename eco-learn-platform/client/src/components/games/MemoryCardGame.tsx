import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Card {
  id: string;
  content: string;
  type: 'image' | 'text';
  pairId: string;
  description: string;
}

interface MemoryGameProps {
  onComplete: (score: number, totalPoints: number) => void;
  title: string;
  theme: 'climate' | 'biodiversity' | 'energy' | 'water';
}

const MemoryCardGame: React.FC<MemoryGameProps> = ({ onComplete, title, theme }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const moveIncrementedRef = useRef(false);

  const cardSets = useMemo(() => ({
    climate: [
      { pairId: 'greenhouse', image: '🏦', text: 'Greenhouse Effect', description: 'Trapping of heat in atmosphere by greenhouse gases' },
      { pairId: 'solar', image: '☀️', text: 'Solar Energy', description: 'Clean renewable energy from the sun' },
      { pairId: 'fossil', image: '⛽', text: 'Fossil Fuels', description: 'Coal, oil, and gas that release CO2 when burned' },
      { pairId: 'temperature', image: '🌡️', text: 'Global Warming', description: 'Rising average temperatures worldwide' },
      { pairId: 'ice', image: '🧊', text: 'Melting Ice Caps', description: 'Polar ice melting due to rising temperatures' },
      { pairId: 'weather', image: '🌪️', text: 'Extreme Weather', description: 'More frequent storms and weather events' }
    ],
    biodiversity: [
      { pairId: 'forest', image: '🌳', text: 'Deforestation', description: 'Loss of forests affects biodiversity' },
      { pairId: 'species', image: '🐅', text: 'Endangered Species', description: 'Animals at risk of extinction' },
      { pairId: 'habitat', image: '🏖️', text: 'Habitat Loss', description: 'Destruction of natural living spaces' },
      { pairId: 'pollination', image: '🐝', text: 'Pollination', description: 'Bees help plants reproduce' },
      { pairId: 'ecosystem', image: '🌿', text: 'Ecosystem Balance', description: 'All living things are interconnected' },
      { pairId: 'conservation', image: '🦋', text: 'Conservation', description: 'Protecting species and their habitats' }
    ],
    energy: [
      { pairId: 'wind', image: '💨', text: 'Wind Power', description: 'Clean energy from wind turbines' },
      { pairId: 'hydro', image: '💧', text: 'Hydroelectric', description: 'Energy from flowing water' },
      { pairId: 'nuclear', image: '⚛️', text: 'Nuclear Energy', description: 'Low-carbon energy from nuclear reactions' },
      { pairId: 'efficiency', image: '💡', text: 'Energy Efficiency', description: 'Using less energy to do the same task' },
      { pairId: 'battery', image: '🔋', text: 'Energy Storage', description: 'Storing renewable energy for later use' },
      { pairId: 'grid', image: '🔌', text: 'Smart Grid', description: 'Intelligent electricity distribution system' }
    ],
    water: [
      { pairId: 'conservation', image: '💧', text: 'Water Conservation', description: 'Using water efficiently and responsibly' },
      { pairId: 'pollution', image: '🏦', text: 'Water Pollution', description: 'Contamination of water sources' },
      { pairId: 'treatment', image: '🚰', text: 'Water Treatment', description: 'Cleaning water for safe consumption' },
      { pairId: 'drought', image: '🌵', text: 'Drought', description: 'Extended periods without rainfall' },
      { pairId: 'ocean', image: '🌊', text: 'Ocean Protection', description: 'Preserving marine ecosystems' },
      { pairId: 'cycle', image: '☔', text: 'Water Cycle', description: 'Continuous movement of water on Earth' }
    ]
  }), []);

  useEffect(() => {
    const selectedCards = cardSets[theme];
    const gameCards: Card[] = [];
    
    selectedCards.forEach(card => {
      gameCards.push({
        id: `${card.pairId}-image`,
        content: card.image,
        type: 'image',
        pairId: card.pairId,
        description: card.description
      });
      gameCards.push({
        id: `${card.pairId}-text`,
        content: card.text,
        type: 'text',
        pairId: card.pairId,
        description: card.description
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  }, [theme]);

  useEffect(() => {
    if (gameStarted && !gameComplete) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameComplete]);

  useEffect(() => {
    if (flippedCards.length === 2 && !moveIncrementedRef.current) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);

      // Increment moves only once per pair attempt
      setMoves(prev => prev + 1);
      moveIncrementedRef.current = true;

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found
        setMatchedPairs(prev => [...prev, firstCard.pairId]);
        setTimeout(() => {
          setFlippedCards([]);
        }, 500);
        setScore(prev => prev + Math.max(10, 50 - moves * 2));
      } else {
        // No match - wait then flip cards back
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);

  // Reset the move increment flag when cards are reset
  useEffect(() => {
    if (flippedCards.length === 0) {
      moveIncrementedRef.current = false;
    }
  }, [flippedCards]);

  useEffect(() => {
    if (matchedPairs.length === cardSets[theme].length) {
      setGameComplete(true);
      const timeBonus = Math.max(0, 100 - timeElapsed);
      const moveBonus = Math.max(0, 100 - moves * 5);
      const totalScore = score + timeBonus + moveBonus;
      onComplete(totalScore, totalScore);
    }
  }, [matchedPairs, cardSets, theme, score, timeElapsed, moves, onComplete]);

  const handleCardClick = (cardId: string) => {
    if (!gameStarted) setGameStarted(true);
    
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || 
        matchedPairs.includes(cards.find(card => card.id === cardId)?.pairId || '')) {
      return;
    }
    
    setFlippedCards(prev => [...prev, cardId]);
  };

  const isCardFlipped = (cardId: string) => {
    return flippedCards.includes(cardId) || 
           matchedPairs.includes(cards.find(card => card.id === cardId)?.pairId || '');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameComplete) {
    const timeBonus = Math.max(0, 100 - timeElapsed);
    const moveBonus = Math.max(0, 100 - moves * 5);
    const totalScore = score + timeBonus + moveBonus;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 1, repeat: 2 }}
          className="text-6xl mb-4"
        >
          🧠
        </motion.div>
        
        <h3 className="text-3xl font-bold text-gray-900 mb-6">Memory Master!</h3>
        
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Base Score</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-green-600">+{timeBonus}</div>
            <div className="text-sm text-gray-600">Time Bonus</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">+{moveBonus}</div>
            <div className="text-sm text-gray-600">Move Bonus</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full font-semibold mb-6 inline-block">
          🌟 +{totalScore} EcoPoints Earned!
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>⏱️ Time: {formatTime(timeElapsed)}</div>
          <div>🎯 Moves: {moves}</div>
          <div>🎮 Pairs Found: {matchedPairs.length}/{cardSets[theme].length}</div>
          <div>📈 Accuracy: {moves > 0 ? Math.round((matchedPairs.length / moves) * 100) : 0}%</div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-blue-900 mb-2">🧠 Memory Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Practice regularly to improve memory</li>
            <li>• Create mental associations</li>
            <li>• Use visualization techniques</li>
            <li>• Stay focused and avoid distractions</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Reset the memory game
              setFlippedCards([]);
              setMatchedPairs([]);
              setMoves(0);
              setGameComplete(false);
              setScore(0);
              setTimeElapsed(0);
              setGameStarted(false);
              moveIncrementedRef.current = false;
              // Re-shuffle cards
              const selectedCards = cardSets[theme];
              const gameCards: any[] = [];
              selectedCards.forEach(card => {
                gameCards.push({
                  id: `${card.pairId}-image`,
                  content: card.image,
                  type: 'image',
                  pairId: card.pairId,
                  description: card.description
                });
                gameCards.push({
                  id: `${card.pairId}-text`,
                  content: card.text,
                  type: 'text',
                  pairId: card.pairId,
                  description: card.description
                });
              });
              setCards(gameCards.sort(() => Math.random() - 0.5));
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <span>🔄</span>
            <span>Play Again</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const event = new CustomEvent('closeGameModal');
              window.dispatchEvent(event);
            }}
            className="flex items-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            <span>✓</span>
            <span>Done</span>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  const progress = (matchedPairs.length / cardSets[theme].length) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 mb-6">
          Match environmental concepts with their descriptions to test your memory!
        </p>
        
        {/* Game Stats */}
        <div className="flex justify-center space-x-8 mb-6">
          <div className="bg-blue-50 px-4 py-2 rounded-full">
            <span className="text-blue-600 font-semibold">Time: {formatTime(timeElapsed)}</span>
          </div>
          <div className="bg-green-50 px-4 py-2 rounded-full">
            <span className="text-green-600 font-semibold score-display">Moves: {moves}</span>
          </div>
          <div className="bg-purple-50 px-4 py-2 rounded-full">
            <span className="text-purple-600 font-semibold">Score: {score}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative h-32 cursor-pointer"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl shadow-lg"
              animate={{ 
                rotateY: isCardFlipped(card.id) ? 0 : 180,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Card Back */}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="text-white text-4xl">🌍</div>
              </div>

              {/* Card Front */}
              <div 
                className={`absolute inset-0 flex flex-col items-center justify-center bg-white rounded-xl shadow-lg p-4 ${
                  matchedPairs.includes(card.pairId) ? 'bg-green-50 border-2 border-green-300' : ''
                }`}
                style={{ backfaceVisibility: "hidden" }}
              >
                {card.type === 'image' ? (
                  <div className="text-4xl mb-2">{card.content}</div>
                ) : (
                  <div className="text-center">
                    <div className="font-semibold text-gray-900 text-sm mb-1">
                      {card.content}
                    </div>
                    <div className="text-xs text-gray-600">
                      {card.description.substring(0, 40)}...
                    </div>
                  </div>
                )}
                
                {matchedPairs.includes(card.pairId) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 text-green-500"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      {!gameStarted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 text-center"
        >
          <h4 className="font-semibold text-blue-900 mb-2">🎮 How to Play:</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Click cards to flip them and reveal their content</p>
            <p>• Match environmental concepts with their descriptions</p>
            <p>• Complete all pairs with fewest moves and fastest time for maximum points</p>
            <p>• Click any card to start the game!</p>
          </div>
        </motion.div>
      )}

      {/* Current pair feedback */}
      <AnimatePresence>
        {flippedCards.length === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 border"
          >
            {(() => {
              const [first, second] = flippedCards;
              const firstCard = cards.find(card => card.id === first);
              const secondCard = cards.find(card => card.id === second);
              const isMatch = firstCard?.pairId === secondCard?.pairId;
              
              return (
                <div className={`text-center ${isMatch ? 'text-green-600' : 'text-red-600'}`}>
                  <div className="font-semibold">
                    {isMatch ? '✅ Perfect Match!' : '❌ Try Again'}
                  </div>
                  {isMatch && firstCard && (
                    <div className="text-sm text-gray-600 mt-1">
                      {firstCard.description}
                    </div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryCardGame;
