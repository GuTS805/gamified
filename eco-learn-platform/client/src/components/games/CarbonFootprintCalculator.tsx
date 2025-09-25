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
  const [calculatingStep, setCalculatingStep] = useState(0);
  const [impactBreakdown, setImpactBreakdown] = useState<any>(null);

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
      
      // Step-by-step calculation animation
      const calculationSteps = [
        'Analyzing your transportation choices...',
        'Calculating food consumption impact...',
        'Processing energy usage data...',
        'Evaluating waste management practices...',
        'Assessing water consumption patterns...',
        'Computing total environmental impact...'
      ];
      
      let stepIndex = 0;
      const stepInterval = setInterval(() => {
        setCalculatingStep(stepIndex);
        stepIndex++;
        if (stepIndex >= calculationSteps.length) {
          clearInterval(stepInterval);
          
          // Calculate final impact breakdown
          const maxPossibleCarbon = questions.reduce((acc, q) => 
            acc + Math.max(...q.choices.map(c => c.carbonImpact)), 0
          );
          const minPossibleCarbon = questions.reduce((acc, q) => 
            acc + Math.min(...q.choices.map(c => c.carbonImpact)), 0
          );
          
          const ecoPoints = Math.max(20, Math.round(100 - (newTotal / maxPossibleCarbon) * 100));
          const percentileScore = Math.round(((maxPossibleCarbon - newTotal) / (maxPossibleCarbon - minPossibleCarbon)) * 100);
          
          // Calculate category breakdown
          const breakdown = selectedChoices.map((choice, index) => ({
            category: questions[index].category,
            icon: questions[index].icon,
            value: choice.carbonImpact,
            percentage: Math.round((choice.carbonImpact / newTotal) * 100),
            choice: choice.option,
            tips: choice.tips
          }));
          
          setImpactBreakdown({
            totalCarbon: newTotal,
            ecoPoints,
            percentileScore,
            maxPossible: maxPossibleCarbon,
            minPossible: minPossibleCarbon,
            breakdown,
            annualImpact: newTotal * 365, // Daily to annual
            equivalents: {
              trees: Math.round(newTotal * 365 / 22), // Trees needed to offset annually
              cars: Math.round(newTotal * 365 / 4600), // Car equivalent
              flights: Math.round(newTotal * 365 / 90) // Short flight equivalent
            }
          });
          
          setTimeout(() => {
            setGameComplete(true);
            onComplete(newTotal, ecoPoints);
          }, 1500);
        }
      }, 600);
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
    const breakdown = impactBreakdown || {
      totalCarbon,
      ecoPoints: Math.max(20, Math.round(100 - (totalCarbon / questions.reduce((acc, q) => 
        acc + Math.max(...q.choices.map(c => c.carbonImpact)), 0)) * 100)),
      breakdown: selectedChoices.map((choice, index) => ({
        category: questions[index].category,
        icon: questions[index].icon,
        value: choice.carbonImpact,
        percentage: Math.round((choice.carbonImpact / totalCarbon) * 100),
        choice: choice.option,
        tips: choice.tips
      })),
      annualImpact: totalCarbon * 365,
      equivalents: {
        trees: Math.round(totalCarbon * 365 / 22),
        cars: Math.round(totalCarbon * 365 / 4600),
        flights: Math.round(totalCarbon * 365 / 90)
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-lg"
      >
        {/* Header with celebration animation */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 15, -15, 0]
            }}
            transition={{ duration: 1, repeat: 3 }}
            className="text-6xl mb-4"
          >
            {rating.icon}
          </motion.div>
          
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            🌍 Your Environmental Impact Assessment
          </h3>
        </div>

        {/* Main Results Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Daily Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl font-bold mb-2 text-gray-900">
              {breakdown.totalCarbon.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mb-2">kg CO₂ / day</div>
            <div className={`text-lg font-semibold ${rating.color}`}>
              {rating.rating}
            </div>
            <p className="text-sm text-gray-600 mt-2">{rating.description}</p>
          </motion.div>

          {/* Annual Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl font-bold mb-2 text-gray-900">
              {(breakdown.annualImpact / 1000).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 mb-2">tonnes CO₂ / year</div>
            <div className="text-lg font-semibold text-orange-600">
              Annual Footprint
            </div>
            <p className="text-sm text-gray-600 mt-2">Your yearly carbon emissions</p>
          </motion.div>

          {/* EcoPoints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl font-bold mb-2 text-green-600">
              +{breakdown.ecoPoints}
            </div>
            <div className="text-sm text-gray-600 mb-2">EcoPoints</div>
            <div className="text-lg font-semibold text-green-600">
              Earned!
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="text-2xl mt-2"
            >
              🌟
            </motion.div>
          </motion.div>
        </div>

        {/* Environmental Equivalents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8"
        >
          <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
            🌎 Your Annual Impact Equals:
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🌳</div>
              <div className="text-2xl font-bold text-green-600">{breakdown.equivalents.trees}</div>
              <div className="text-sm text-gray-600">Trees needed to offset</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚗</div>
              <div className="text-2xl font-bold text-blue-600">{(breakdown.equivalents.cars / 1000).toFixed(1)}k</div>
              <div className="text-sm text-gray-600">km driven by car</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">✈️</div>
              <div className="text-2xl font-bold text-purple-600">{breakdown.equivalents.flights}</div>
              <div className="text-sm text-gray-600">Short flights taken</div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Breakdown by category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="space-y-4 mb-8"
        >
          <h4 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            📊 Your Daily Choices Impact Breakdown:
          </h4>
          <div className="grid gap-4">
            {breakdown.breakdown.map((item: any, index: number) => {
              const barWidth = (item.value / breakdown.totalCarbon) * 100;
              const colorMap: { [key: string]: string } = {
                'Transportation': 'from-blue-400 to-blue-600',
                'Food': 'from-green-400 to-green-600',
                'Energy': 'from-yellow-400 to-yellow-600',
                'Waste': 'from-purple-400 to-purple-600',
                'Water': 'from-cyan-400 to-cyan-600'
              };
              const bgColorMap: { [key: string]: string } = {
                'Transportation': 'from-blue-50 to-blue-100',
                'Food': 'from-green-50 to-green-100',
                'Energy': 'from-yellow-50 to-yellow-100',
                'Waste': 'from-purple-50 to-purple-100',
                'Water': 'from-cyan-50 to-cyan-100'
              };
              
              return (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + (index * 0.1) }}
                  className={`bg-gradient-to-r ${bgColorMap[item.category]} border border-gray-200 rounded-xl p-4 relative overflow-hidden`}
                >
                  {/* Progress bar background */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ delay: 1.4 + (index * 0.1), duration: 0.8 }}
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colorMap[item.category]} opacity-20 rounded-xl`}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <motion.span 
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ delay: 1.6 + (index * 0.1), duration: 0.5 }}
                          className="text-3xl"
                        >
                          {item.icon}
                        </motion.span>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{item.category}</div>
                          <div className="text-sm text-gray-600">{item.choice}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-lg">
                          {item.value} kg CO₂
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.percentage}% of total
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/70 border border-gray-300 rounded-lg p-3">
                      <p className="text-sm text-gray-800">
                        💡 <strong>Tip:</strong> {item.tips}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Improvement suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
        >
          <h4 className="font-semibold text-green-900 mb-4">🌱 Ways to Reduce Your Carbon Footprint:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
            <div>• Use public transport or cycle more often</div>
            <div>• Eat more plant-based meals</div>
            <div>• Turn off lights and unplug devices</div>
            <div>• Reduce, reuse, and recycle</div>
            <div>• Take shorter showers</div>
            <div>• Choose local and seasonal foods</div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Reset the game to play again
              setCurrentQuestionIndex(0);
              setSelectedChoices([]);
              setTotalCarbon(0);
              setGameComplete(false);
              setShowResult(false);
              setCalculatingStep(0);
              setImpactBreakdown(null);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <span>🔄</span>
            <span>Calculate Again</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Close the modal - this will be handled by parent component
              const event = new CustomEvent('closeGameModal');
              window.dispatchEvent(event);
            }}
            className="flex items-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            <span>✓</span>
            <span>Done</span>
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  if (showResult && !gameComplete) {
    const calculationSteps = [
      { text: 'Analyzing your transportation choices...', icon: '🚗', color: 'from-blue-400 to-blue-600' },
      { text: 'Calculating food consumption impact...', icon: '🍽️', color: 'from-green-400 to-green-600' },
      { text: 'Processing energy usage data...', icon: '💡', color: 'from-yellow-400 to-yellow-600' },
      { text: 'Evaluating waste management practices...', icon: '🗑️', color: 'from-purple-400 to-purple-600' },
      { text: 'Assessing water consumption patterns...', icon: '💧', color: 'from-cyan-400 to-cyan-600' },
      { text: 'Computing total environmental impact...', icon: '🌍', color: 'from-emerald-400 to-emerald-600' }
    ];

    const currentStep = calculationSteps[calculatingStep] || calculationSteps[calculationSteps.length - 1];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
            }}
            className="text-6xl mb-4"
          >
            {currentStep.icon}
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Calculating Your Impact</h3>
          
          <motion.p 
            key={calculatingStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-gray-600 mb-6"
          >
            {currentStep.text}
          </motion.p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-3 mb-6">
          {calculationSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3, x: -20 }}
              animate={{ 
                opacity: index <= calculatingStep ? 1 : 0.3,
                x: index <= calculatingStep ? 0 : -20
              }}
              className="flex items-center space-x-3"
            >
              <div className={`w-3 h-3 rounded-full ${
                index < calculatingStep ? 'bg-green-500' : 
                index === calculatingStep ? `bg-gradient-to-r ${step.color}` :
                'bg-gray-300'
              } transition-colors duration-300`} />
              
              <span className={`text-sm ${
                index <= calculatingStep ? 'text-gray-900' : 'text-gray-400'
              } transition-colors duration-300`}>
                {step.icon} {step.text}
              </span>
              
              {index < calculatingStep && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-green-500"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div
            className={`h-2 bg-gradient-to-r ${currentStep.color} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${((calculatingStep + 1) / calculationSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="text-center text-sm text-gray-500">
          Step {calculatingStep + 1} of {calculationSteps.length}
        </div>

        {impactBreakdown && calculatingStep >= calculationSteps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {impactBreakdown.totalCarbon.toFixed(1)} kg CO₂
              </div>
              <div className="text-sm text-gray-600 mb-2">Daily Carbon Footprint</div>
              <div className="text-lg font-semibold text-green-600">
                🌟 +{impactBreakdown.ecoPoints} EcoPoints Earned!
              </div>
            </div>
          </motion.div>
        )}
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
