import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Choice {
  id: string;
  option: string;
  carbonImpact: number;
  description: string;
  tips: string;
}

interface Question {
  id: string;
  category: string;
  question: string;
  choices: Choice[];
  icon: string;
}

interface CarbonCalculatorProps {
  onComplete: (totalCarbon: number, ecoPoints: number) => void;
  title: string;
}

const CarbonFootprintCalculator: React.FC<CarbonCalculatorProps> = ({ onComplete, title }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Choice[]>([]);
  const [totalCarbon, setTotalCarbon] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const questions: Question[] = [
    {
      id: '1',
      category: 'Transportation',
      question: 'How do you usually get to school?',
      icon: '🚗',
      choices: [
        {
          id: '1a',
          option: 'Walk or cycle',
          carbonImpact: 0,
          description: 'Zero emissions - excellent choice!',
          tips: 'Walking and cycling are the most eco-friendly options and great for your health!'
        },
        {
          id: '1b',
          option: 'Public transport (bus/train)',
          carbonImpact: 2.5,
          description: 'Low emissions per person',
          tips: 'Public transport reduces individual carbon footprint significantly compared to private vehicles.'
        },
        {
          id: '1c',
          option: 'Car (shared with family)',
          carbonImpact: 4.2,
          description: 'Moderate emissions',
          tips: 'Carpooling reduces emissions per person. Consider electric or hybrid vehicles!'
        },
        {
          id: '1d',
          option: 'Private car/bike',
          carbonImpact: 8.9,
          description: 'High emissions',
          tips: 'Consider alternatives like cycling, walking, or public transport when possible.'
        }
      ]
    },
    {
      id: '2',
      category: 'Food',
      question: 'What do you typically eat for lunch?',
      icon: '🍽️',
      choices: [
        {
          id: '2a',
          option: 'Plant-based meal (vegetables, grains)',
          carbonImpact: 1.1,
          description: 'Very low carbon footprint',
          tips: 'Plant-based foods generally have much lower carbon emissions than animal products.'
        },
        {
          id: '2b',
          option: 'Mixed meal with some meat',
          carbonImpact: 3.3,
          description: 'Moderate carbon footprint',
          tips: 'Reducing meat consumption even slightly can make a significant environmental impact.'
        },
        {
          id: '2c',
          option: 'Meat-heavy meal',
          carbonImpact: 6.5,
          description: 'High carbon footprint',
          tips: 'Livestock farming produces significant greenhouse gases. Try "Meatless Monday" to reduce impact!'
        },
        {
          id: '2d',
          option: 'Fast food/processed foods',
          carbonImpact: 5.8,
          description: 'High carbon footprint',
          tips: 'Processed foods often have high carbon footprints due to production and packaging processes.'
        }
      ]
    },
    {
      id: '3',
      category: 'Energy',
      question: 'How do you use electricity at home?',
      icon: '💡',
      choices: [
        {
          id: '3a',
          option: 'Very conscious - turn off lights, unplug devices',
          carbonImpact: 2.1,
          description: 'Excellent energy habits',
          tips: 'Your energy-conscious habits are making a real difference!'
        },
        {
          id: '3b',
          option: 'Sometimes forget but generally careful',
          carbonImpact: 4.3,
          description: 'Good energy habits',
          tips: 'Small improvements like LED bulbs and smart power strips can help further.'
        },
        {
          id: '3c',
          option: 'Use electricity without much thought',
          carbonImpact: 7.2,
          description: 'High energy consumption',
          tips: 'Simple habits like turning off lights when leaving rooms can reduce your footprint significantly.'
        },
        {
          id: '3d',
          option: 'Leave devices on, rarely turn off lights',
          carbonImpact: 9.8,
          description: 'Very high energy consumption',
          tips: 'Start small: turn off one device or light each time you leave a room!'
        }
      ]
    },
    {
      id: '4',
      category: 'Waste',
      question: 'How do you handle waste at home?',
      icon: '🗑️',
      choices: [
        {
          id: '4a',
          option: 'Recycle, compost, minimize waste',
          carbonImpact: 0.8,
          description: 'Excellent waste management',
          tips: 'Your comprehensive approach to waste reduction is exemplary!'
        },
        {
          id: '4b',
          option: 'Recycle regularly',
          carbonImpact: 2.5,
          description: 'Good waste habits',
          tips: 'Consider adding composting to further reduce your environmental impact.'
        },
        {
          id: '4c',
          option: 'Sometimes recycle',
          carbonImpact: 4.7,
          description: 'Room for improvement',
          tips: 'Consistent recycling and reducing single-use items can make a big difference.'
        },
        {
          id: '4d',
          option: 'Rarely think about waste separation',
          carbonImpact: 6.9,
          description: 'High waste impact',
          tips: 'Start by separating just one type of waste - even small steps help!'
        }
      ]
    },
    {
      id: '5',
      category: 'Water',
      question: 'How do you use water at home?',
      icon: '💧',
      choices: [
        {
          id: '5a',
          option: 'Short showers, turn off tap while brushing',
          carbonImpact: 1.2,
          description: 'Excellent water conservation',
          tips: 'Water conservation also reduces energy used to heat and treat water!'
        },
        {
          id: '5b',
          option: 'Generally careful with water usage',
          carbonImpact: 2.8,
          description: 'Good water habits',
          tips: 'Consider installing low-flow showerheads for even better conservation.'
        },
        {
          id: '5c',
          option: 'Use water normally without much thought',
          carbonImpact: 4.5,
          description: 'Average water consumption',
          tips: 'Simple changes like shorter showers can significantly reduce water and energy use.'
        },
        {
          id: '5d',
          option: 'Long showers, leave tap running',
          carbonImpact: 7.1,
          description: 'High water consumption',
          tips: 'Try timing your showers and turning off the tap while soaping or brushing teeth!'
        }
      ]
    }
  ];

  const handleChoiceSelect = (choice: Choice) => {
    const newTotal = totalCarbon + choice.carbonImpact;
    setTotalCarbon(newTotal);
    setSelectedChoices([...selectedChoices, choice]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResult(true);
      setTimeout(() => {
        setGameComplete(true);
        // Calculate eco points based on how low the carbon footprint is
        const maxPossibleCarbon = questions.reduce((acc, q) => 
          acc + Math.max(...q.choices.map(c => c.carbonImpact)), 0
        );
        const ecoPoints = Math.max(20, Math.round(100 - (newTotal / maxPossibleCarbon) * 100));
        onComplete(newTotal, ecoPoints);
      }, 3000);
    }
  };

  const getCarbonRating = (carbon: number) => {
    if (carbon <= 10) return { rating: 'Excellent', color: 'text-green-600', icon: '🌱', description: 'You have a very low carbon footprint!' };
    if (carbon <= 20) return { rating: 'Good', color: 'text-lime-600', icon: '🌿', description: 'Your carbon footprint is below average.' };
    if (carbon <= 30) return { rating: 'Average', color: 'text-yellow-600', icon: '⚠️', description: 'Your carbon footprint is about average.' };
    if (carbon <= 40) return { rating: 'High', color: 'text-orange-600', icon: '🔥', description: 'Your carbon footprint is above average.' };
    return { rating: 'Very High', color: 'text-red-600', icon: '🚨', description: 'Your carbon footprint is quite high.' };
  };

  if (gameComplete) {
    const rating = getCarbonRating(totalCarbon);
    const maxPossibleCarbon = questions.reduce((acc, q) => 
      acc + Math.max(...q.choices.map(c => c.carbonImpact)), 0
    );
    const ecoPoints = Math.max(20, Math.round(100 - (totalCarbon / maxPossibleCarbon) * 100));

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
            {rating.icon}
          </motion.div>
          
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Your Carbon Footprint Assessment
          </h3>
          
          <div className="bg-gray-100 rounded-2xl p-6 mb-6">
            <div className="text-4xl font-bold mb-2 text-gray-900">
              {totalCarbon.toFixed(1)} kg CO₂
            </div>
            <div className={`text-xl font-semibold mb-2 ${rating.color}`}>
              {rating.rating}
            </div>
            <p className="text-gray-600">{rating.description}</p>
          </div>

          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full font-semibold mb-6 inline-block">
            🌟 +{ecoPoints} EcoPoints Earned!
          </div>
        </div>

        {/* Breakdown by category */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">📊 Your Choices Breakdown:</h4>
          {selectedChoices.map((choice, index) => (
            <motion.div
              key={choice.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{questions[index].icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900">{questions[index].category}</div>
                    <div className="text-sm text-gray-600">{choice.option}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{choice.carbonImpact} kg CO₂</div>
                  <div className="text-xs text-gray-500">{choice.description}</div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <p className="text-sm text-blue-800">💡 {choice.tips}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Improvement suggestions */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <h4 className="font-semibold text-green-900 mb-4">🌱 Ways to Reduce Your Carbon Footprint:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
            <div>• Use public transport or cycle more often</div>
            <div>• Eat more plant-based meals</div>
            <div>• Turn off lights and unplug devices</div>
            <div>• Reduce, reuse, and recycle</div>
            <div>• Take shorter showers</div>
            <div>• Choose local and seasonal foods</div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-white rounded-2xl shadow-lg"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-4"
        >
          🌍
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Calculating Your Impact...</h3>
        <p className="text-lg text-gray-600">Analyzing your choices and environmental impact</p>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 mb-6">
          Answer questions about your daily habits to calculate your carbon footprint
        </p>
        
        {/* Progress */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <span className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <div className="w-48 bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Current carbon total */}
        <div className="bg-gray-100 rounded-full px-6 py-2 inline-block mb-6">
          <span className="text-gray-700 font-semibold">
            Current total: {totalCarbon.toFixed(1)} kg CO₂
          </span>
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{currentQuestion.icon}</div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full inline-block mb-4 font-semibold">
            {currentQuestion.category}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="grid gap-4">
          {currentQuestion.choices.map((choice) => (
            <motion.button
              key={choice.id}
              onClick={() => handleChoiceSelect(choice)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="text-left p-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {choice.option}
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-700">{choice.carbonImpact} kg CO₂</div>
                  <div className="text-xs text-gray-500">{choice.description}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                💡 {choice.tips}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default CarbonFootprintCalculator;
