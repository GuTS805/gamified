import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

interface QuizGameProps {
  questions: Question[];
  onComplete: (score: number, totalPoints: number) => void;
  title: string;
  theme: string;
}

const QuizGame: React.FC<QuizGameProps> = ({ questions, onComplete, title, theme }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showExplanation) {
      handleTimeout();
    }
  }, [timeLeft, isTimerActive, showExplanation]);

  const handleTimeout = () => {
    setSelectedAnswer(-1);
    setShowExplanation(true);
    setIsTimerActive(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    setIsTimerActive(false);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      const points = Math.max(10, Math.floor((timeLeft / 30) * questions[currentQuestion].points));
      setScore(score + points);
      setTotalPoints(totalPoints + points);
    }
    
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
      setIsTimerActive(true);
    } else {
      setGameComplete(true);
      onComplete(score, totalPoints);
    }
  };

  const getThemeColors = () => {
    switch (theme) {
      case 'climate':
        return {
          primary: 'from-blue-400 to-cyan-300',
          correct: 'bg-green-500',
          incorrect: 'bg-red-500',
          timer: 'stroke-blue-500'
        };
      case 'waste':
        return {
          primary: 'from-green-400 to-emerald-300',
          correct: 'bg-green-500',
          incorrect: 'bg-red-500',
          timer: 'stroke-green-500'
        };
      default:
        return {
          primary: 'from-teal-400 to-green-300',
          correct: 'bg-green-500',
          incorrect: 'bg-red-500',
          timer: 'stroke-teal-500'
        };
    }
  };

  const colors = getThemeColors();

  if (gameComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-white rounded-2xl shadow-lg"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          🏆
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h3>
        <p className="text-lg text-gray-600 mb-4">
          You scored {score} out of {questions.reduce((acc, q) => acc + q.points, 0)} points!
        </p>
        <div className="mb-6">
          <div className="flex justify-center mb-6">
            <div className={`px-6 py-3 bg-gradient-to-r ${colors.primary} text-white rounded-full font-semibold`}>
              🌟 +{totalPoints} EcoPoints Earned!
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Reset the quiz to play again
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setScore(0);
                setTotalPoints(0);
                setShowExplanation(false);
                setGameComplete(false);
                setTimeLeft(30);
                setIsTimerActive(true);
              }}
              className={`flex items-center space-x-2 bg-gradient-to-r ${colors.primary} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
            >
              <span>🔄</span>
              <span>Take Quiz Again</span>
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
        </div>
      </motion.div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </div>
          {/* Timer */}
          <div className="relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-gray-200"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={colors.timer}
                strokeWidth="2"
                strokeDasharray={`${(timeLeft / 30) * 100} 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700">{timeLeft}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <motion.div
          className={`h-2 bg-gradient-to-r ${colors.primary} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQ.question}
        </h3>

        {/* Answer Options */}
        <div className="grid gap-4 mb-6">
          {currentQ.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                selectedAnswer === null
                  ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  : selectedAnswer === index
                  ? index === currentQ.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : index === currentQ.correctAnswer && showExplanation
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === index
                    ? index === currentQ.correctAnswer
                      ? 'border-green-500 bg-green-500'
                      : 'border-red-500 bg-red-500'
                    : index === currentQ.correctAnswer && showExplanation
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                }`}>
                  {(selectedAnswer === index || (index === currentQ.correctAnswer && showExplanation)) && (
                    <span className="text-white text-sm font-bold">
                      {index === currentQ.correctAnswer ? '✓' : '✗'}
                    </span>
                  )}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"
            >
              <h4 className="font-semibold text-blue-900 mb-2">
                {selectedAnswer === currentQ.correctAnswer ? '🎉 Correct!' : '🤔 Not quite right'}
              </h4>
              <p className="text-blue-800">{currentQ.explanation}</p>
              {selectedAnswer === currentQ.correctAnswer && (
                <p className="text-green-600 font-semibold mt-2">
                  +{Math.max(10, Math.floor((timeLeft / 30) * currentQ.points))} points earned!
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        {showExplanation && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNextQuestion}
            className={`w-full py-3 px-6 bg-gradient-to-r ${colors.primary} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}
          >
            {currentQuestion < questions.length - 1 ? 'Next Question →' : 'Complete Quiz 🏆'}
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default QuizGame;
