import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface GameState {
  temperature: number; // Global temperature rise in °C
  co2Level: number; // CO2 concentration in ppm
  biodiversity: number; // Biodiversity index (0-100%)
  score: number; // Player score
  currentScenario: number;
}

interface Impact {
  temperature: number;
  co2: number;
  biodiversity: number;
  score: number;
}

interface Decision {
  text: string;
  consequence: string;
  impact: Impact;
}

interface Scenario {
  id: number;
  title: string;
  description: string;
  category: string;
  level: number;
  image?: string;
  decisions: Decision[];
  educational?: string;
}

interface ClimateQuestProps {
  onComplete: (finalScore: number, ecoPoints: number) => void;
  title: string;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "Energy Crisis in Megacity",
    description: "Your city faces an energy shortage. Coal power is cheap and immediate, but renewable energy requires investment and time. Citizens demand action as blackouts increase.",
    category: "Energy Policy",
    level: 1,
    image: "/renewable-city.jpg",
    decisions: [
      {
        text: "Build more coal power plants immediately",
        consequence: "Lights stay on, but emissions soar and air quality worsens. Citizens happy short-term.",
        impact: { temperature: 0.3, co2: 50, biodiversity: -10, score: -50 }
      },
      {
        text: "Invest heavily in renewable energy infrastructure", 
        consequence: "Higher taxes but cleaner future. Some initial protests but long-term benefits.",
        impact: { temperature: -0.1, co2: -20, biodiversity: 5, score: 100 }
      },
      {
        text: "Implement energy rationing and efficiency programs",
        consequence: "Reduced consumption through smart planning. Citizens adapt to conservation lifestyle.",
        impact: { temperature: -0.05, co2: -10, biodiversity: 2, score: 75 }
      }
    ],
    educational: "Coal power plants emit 2.2 pounds of CO₂ per kWh, while solar emits only 0.1 pounds per kWh over their lifetime."
  },
  {
    id: 2,
    title: "Amazon Rainforest Development",
    description: "A logging company offers millions for rainforest rights, promising jobs for thousands. Environmental groups warn of irreversible damage to the 'lungs of the Earth.'",
    category: "Conservation",
    level: 2,
    image: "/melting-glaciers.jpg",
    decisions: [
      {
        text: "Approve large-scale logging for economic development",
        consequence: "Immediate economic boost but massive carbon emissions and species loss accelerate climate change.",
        impact: { temperature: 0.4, co2: 80, biodiversity: -25, score: -100 }
      },
      {
        text: "Create protected reserves and eco-tourism instead",
        consequence: "Slower economic growth but preserved ecosystems. Sustainable jobs in conservation and tourism.",
        impact: { temperature: -0.2, co2: -30, biodiversity: 15, score: 120 }
      },
      {
        text: "Allow selective sustainable logging with strict oversight",
        consequence: "Balanced approach with some environmental cost but controlled economic benefit.",
        impact: { temperature: 0.1, co2: 20, biodiversity: -5, score: 50 }
      }
    ],
    educational: "The Amazon rainforest absorbs 2 billion tons of CO₂ annually and produces 20% of the world's oxygen."
  },
  {
    id: 3,
    title: "Rising Sea Levels",
    description: "Coastal cities are flooding more frequently. Millions face displacement. Do you build sea walls, relocate populations, or try innovative solutions?",
    category: "Adaptation",
    level: 3,
    decisions: [
      {
        text: "Build massive sea walls and flood barriers",
        consequence: "Protects current populations but enormous cost and only temporary solution as seas keep rising.",
        impact: { temperature: 0, co2: 40, biodiversity: -8, score: 25 }
      },
      {
        text: "Relocate coastal populations inland",
        consequence: "Difficult transition but safer long-term. Social disruption but climate-resilient communities.",
        impact: { temperature: 0, co2: -10, biodiversity: 3, score: 80 }
      },
      {
        text: "Invest in floating cities and amphibious architecture",
        consequence: "Innovative adaptation allowing coastal living. High-tech solutions but experimental and costly.",
        impact: { temperature: -0.05, co2: 10, biodiversity: 8, score: 90 }
      }
    ],
    educational: "Sea levels are rising 3.3mm per year and could rise 1-3 feet by 2100, affecting 570 cities worldwide."
  },
  {
    id: 4,
    title: "Agricultural Revolution",
    description: "Climate change is destroying traditional farming. Crops fail, food prices soar. You must choose between industrial agriculture, sustainable farming, or lab-grown alternatives.", 
    category: "Food Security",
    level: 4,
    decisions: [
      {
        text: "Expand industrial agriculture with GMOs and chemicals",
        consequence: "Higher yields but soil degradation, water pollution, and long-term sustainability issues.",
        impact: { temperature: 0.2, co2: 35, biodiversity: -15, score: -25 }
      },
      {
        text: "Support regenerative and sustainable farming practices",
        consequence: "Lower initial yields but healthier soil, better biodiversity, and climate resilience.",
        impact: { temperature: -0.15, co2: -25, biodiversity: 20, score: 110 }
      },
      {
        text: "Invest in lab-grown meat and vertical farming",
        consequence: "Revolutionary food production with minimal environmental impact but high technology costs.",
        impact: { temperature: -0.3, co2: -45, biodiversity: 10, score: 150 }
      }
    ],
    educational: "Agriculture accounts for 24% of global greenhouse gas emissions. Regenerative farming can sequester 3-15 tons of CO₂ per hectare annually."
  },
  {
    id: 5,
    title: "Transportation Revolution", 
    description: "Your nation's transportation system needs overhaul. Cars dominate but cause massive emissions. Choose the future of mobility for millions of citizens.",
    category: "Transportation",
    level: 5,
    decisions: [
      {
        text: "Subsidize electric vehicles for everyone",
        consequence: "Cleaner personal transport but still requires massive infrastructure and battery production.",
        impact: { temperature: -0.1, co2: -15, biodiversity: -3, score: 60 }
      },
      {
        text: "Build comprehensive public transportation network",
        consequence: "Efficient mass transit reduces individual car dependency and emissions significantly.",
        impact: { temperature: -0.25, co2: -40, biodiversity: 5, score: 120 }
      },
      {
        text: "Develop walkable cities with bike infrastructure",
        consequence: "Healthiest option promoting active transport, but requires complete urban redesign.",
        impact: { temperature: -0.2, co2: -35, biodiversity: 12, score: 140 }
      }
    ],
    educational: "Transportation accounts for 16% of global emissions. A single bus can replace 40 cars during peak hours."
  }
];

const ImpactMeter: React.FC<{
  title: string;
  value: number;
  maxValue: number;
  unit: string;
  icon: string;
  color: 'success' | 'warning' | 'destructive' | 'primary';
}> = ({ title, value, maxValue, unit, icon, color }) => {
  const percentage = Math.min((Math.abs(value) / maxValue) * 100, 100);
  
  const getColorClass = () => {
    switch (color) {
      case "success": return "text-green-600";
      case "warning": return "text-yellow-600";  
      case "destructive": return "text-red-600";
      case "primary": return "text-blue-600";
      default: return "text-blue-600";
    }
  };

  const getBarColor = () => {
    switch (color) {
      case "success": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "destructive": return "bg-red-500";
      case "primary": return "bg-blue-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xl ${getColorClass()}`}>{icon}</span>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-3">
        {value.toFixed(1)}{unit}
      </div>
      <div className="space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getBarColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 text-right">
          Max: {maxValue}{unit}
        </div>
      </div>
      
      <div className={`absolute top-0 right-0 w-1 h-full ${getBarColor()}`} />
    </div>
  );
};

const DecisionCard: React.FC<{
  scenario: Scenario;
  onDecision: (decision: Decision) => void;
}> = ({ scenario, onDecision }) => {
  const getImpactColor = (value: number) => {
    if (value > 0) return "text-green-600 bg-green-50";
    if (value < 0) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const getImpactText = (value: number, unit: string = "") => {
    if (value === 0) return "No change";
    return `${value > 0 ? "+" : ""}${value}${unit}`;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg">
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            {scenario.category}
          </span>
          <span className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
            Level {scenario.level}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{scenario.title}</h2>
        <p className="text-base text-gray-600 leading-relaxed">
          {scenario.description}
        </p>
      </div>
      
      {scenario.image && (
        <div className="px-6">
          <img 
            src={scenario.image} 
            alt={scenario.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        </div>
      )}

      <div className="p-6 space-y-6">
        <h4 className="font-semibold text-lg text-gray-900">What will you do?</h4>
        
        <div className="space-y-4">
          {scenario.decisions.map((decision, index) => (
            <motion.div 
              key={index} 
              className="p-4 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-blue-300"
              onClick={() => onDecision(decision)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h5 className="font-medium text-base group-hover:text-blue-600 transition-colors">
                    {decision.text}
                  </h5>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg">
                    Choose
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {decision.consequence}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getImpactColor(decision.impact.temperature)}`}>
                    Temp: {getImpactText(decision.impact.temperature, "°C")}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getImpactColor(decision.impact.co2)}`}>
                    CO₂: {getImpactText(decision.impact.co2, " ppm")}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getImpactColor(decision.impact.biodiversity)}`}>
                    Nature: {getImpactText(decision.impact.biodiversity, "%")}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getImpactColor(decision.impact.score)}`}>
                    Score: {getImpactText(decision.impact.score)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {scenario.educational && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h5 className="font-semibold mb-2 flex items-center gap-2 text-blue-900">
              💡 Did you know?
            </h5>
            <p className="text-sm text-blue-800 leading-relaxed">
              {scenario.educational}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ClimateQuest: React.FC<ClimateQuestProps> = ({ onComplete, title }) => {
  const [gameState, setGameState] = useState<GameState>({
    temperature: 0,
    co2Level: 400,
    biodiversity: 100,
    score: 0,
    currentScenario: 0,
  });

  const [showResults, setShowResults] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showDecisionImpact, setShowDecisionImpact] = useState(false);
  const [lastDecision, setLastDecision] = useState<Decision | null>(null);
  
  const currentScenario = scenarios[gameState.currentScenario];

  const handleDecision = (decision: Decision) => {
    setLastDecision(decision);
    
    const newState = {
      ...gameState,
      temperature: Math.max(0, gameState.temperature + decision.impact.temperature),
      co2Level: Math.max(300, gameState.co2Level + decision.impact.co2),
      biodiversity: Math.max(0, Math.min(100, gameState.biodiversity + decision.impact.biodiversity)),
      score: gameState.score + decision.impact.score,
    };

    setGameState(newState);
    setShowDecisionImpact(true);

    // Auto-advance after showing results
    setTimeout(() => {
      setShowDecisionImpact(false);
      if (gameState.currentScenario < scenarios.length - 1) {
        setGameState(prev => ({ ...prev, currentScenario: prev.currentScenario + 1 }));
      } else {
        setShowResults(true);
        setTimeout(() => {
          setGameComplete(true);
          const ecoPoints = Math.max(50, Math.round(newState.score / 2));
          onComplete(newState.score, ecoPoints);
        }, 3000);
      }
    }, 3000);
  };

  const getGameStatus = () => {
    if (gameState.temperature > 3) return { status: "Critical", color: "destructive" };
    if (gameState.temperature > 2) return { status: "Dangerous", color: "warning" };
    if (gameState.temperature > 1) return { status: "Concerning", color: "warning" };
    return { status: "Safe", color: "success" };
  };

  if (gameComplete) {
    const status = getGameStatus();
    const totalPossibleScore = scenarios.reduce((acc, scenario) => 
      acc + Math.max(...scenario.decisions.map(d => d.impact.score)), 0
    );
    const percentage = Math.round((gameState.score / totalPossibleScore) * 100);

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
          {percentage >= 80 ? '🌍' : percentage >= 60 ? '🌱' : '⚠️'}
        </motion.div>

        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Climate Quest Complete!
        </h3>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-red-50 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-red-600 mb-2">+{gameState.temperature.toFixed(1)}°C</div>
            <div className="text-sm text-gray-600">Temperature Rise</div>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-gray-600 mb-2">{gameState.co2Level}</div>
            <div className="text-sm text-gray-600">CO₂ Level (ppm)</div>
          </div>
          <div className="bg-green-50 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-green-600 mb-2">{gameState.biodiversity}%</div>
            <div className="text-sm text-gray-600">Biodiversity</div>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">{gameState.score}</div>
            <div className="text-sm text-gray-600">Final Score</div>
          </div>
        </div>

        <div className="mb-6">
          <div className={`text-2xl font-semibold mb-2 ${
            status.color === 'success' ? 'text-green-600' : 
            status.color === 'warning' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            Climate Status: {status.status}
          </div>
          <p className="text-gray-600">{percentage >= 80 ? 'Excellent leadership!' : percentage >= 60 ? 'Good decisions overall.' : 'Room for improvement.'}</p>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-full font-semibold mb-8 inline-block">
          🌟 +{Math.round(gameState.score / 2)} EcoPoints Earned!
        </div>

        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-6">
          <h4 className="font-semibold text-cyan-900 mb-4">🌍 Climate Action Impact:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-cyan-800">
            <div>• Every 0.1°C matters for global ecosystems</div>
            <div>• Biodiversity loss is irreversible without action</div>
            <div>• Policy decisions affect millions of lives</div>
            <div>• Sustainable solutions create lasting benefits</div>
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
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-6xl mb-4"
        >
          🌍
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Analyzing Global Impact...</h3>
        <p className="text-lg text-gray-600">Calculating the consequences of your climate decisions</p>
      </motion.div>
    );
  }

  if (showDecisionImpact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg text-center"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Decision Impact</h3>
        
        {lastDecision && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Your Choice:</h4>
              <p className="text-blue-800 text-sm">{lastDecision.text}</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Consequence:</h4>
              <p className="text-gray-700 text-sm">{lastDecision.consequence}</p>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing climate impact...</p>
        </div>
      </motion.div>
    );
  }

  const status = getGameStatus();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-700">{title}</h1>
          <p className="text-lg text-gray-600">
            Make decisions to protect our planet's future
          </p>
          <span className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${
            status.color === 'success' ? 'text-green-700 bg-green-100' :
            status.color === 'warning' ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'
          }`}>
            Climate Status: {status.status}
          </span>
        </div>

        {/* Impact Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ImpactMeter
            title="Temperature Rise"
            value={gameState.temperature}
            maxValue={5}
            unit="°C"
            icon="🌡️"
            color={gameState.temperature > 2 ? "destructive" : gameState.temperature > 1 ? "warning" : "success"}
          />
          <ImpactMeter
            title="CO₂ Levels"
            value={gameState.co2Level}
            maxValue={600}
            unit=" ppm"
            icon="🏭"
            color={gameState.co2Level > 450 ? "destructive" : gameState.co2Level > 420 ? "warning" : "success"}
          />
          <ImpactMeter
            title="Biodiversity"
            value={gameState.biodiversity}
            maxValue={100}
            unit="%"
            icon="🌲"
            color={gameState.biodiversity < 50 ? "destructive" : gameState.biodiversity < 75 ? "warning" : "success"}
          />
          <ImpactMeter
            title="Score"
            value={gameState.score}
            maxValue={1000}
            unit=" pts"
            icon="💧"
            color="primary"
          />
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Quest Progress</span>
            <span className="text-sm text-gray-500">
              {gameState.currentScenario + 1} / {scenarios.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((gameState.currentScenario + 1) / scenarios.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Game Content */}
        <DecisionCard
          scenario={currentScenario}
          onDecision={handleDecision}
        />

      </div>
    </div>
  );
};

export default ClimateQuest;
