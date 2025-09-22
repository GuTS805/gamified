import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Import game components
import QuizGame from '../components/games/QuizGame';
import RecyclingGame from '../components/games/RecyclingGame';
import CarbonFootprintCalculator from '../components/games/CarbonFootprintCalculator';
import MemoryCardGame from '../components/games/MemoryCardGame';
import WaterConservationSimulator from '../components/games/WaterConservationSimulator';

interface LessonContent {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgGradient: string;
  textColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  points: number;
  sections: {
    overview: {
      title: string;
      content: string[];
      keyPoints: string[];
    };
    games: {
      id: string;
      title: string;
      description: string;
      type: 'quiz' | 'recycling' | 'carbon' | 'memory' | 'water';
      icon: string;
      points: number;
      data?: any;
    }[];
    resources: {
      title: string;
      links: { name: string; url: string; type: string }[];
      videos: { title: string; duration: string; thumbnail: string }[];
    };
  };
}

const LessonDetail: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { user, updateGameProgress, getGameProgress } = useAuth();
  const navigate = useNavigate();
  
  const [currentSection, setCurrentSection] = useState<'overview' | 'games' | 'resources'>('overview');
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  
  // Demo mode - always have a working user
  const [demoGameProgress, setDemoGameProgress] = useState<any[]>([]);
  const [demoEcoPoints, setDemoEcoPoints] = useState(0);
  
  const currentUser = {
    id: 'demo-user',
    name: 'Demo Student',
    email: 'demo@example.com',
    role: 'student' as const,
    school: 'Demo School',
    ecoPoints: 250 + demoEcoPoints,
    level: 3,
    streakDays: 7,
    gameProgress: demoGameProgress,
    badges: []
  };

  const lessons: { [key: string]: LessonContent } = {
    'climate-change': {
      id: 'climate-change',
      title: 'Climate Change Basics',
      description: 'Understanding global warming, greenhouse effects, and climate science fundamentals.',
      icon: '🌍',
      bgGradient: 'from-blue-400 to-cyan-300',
      textColor: 'text-blue-700',
      difficulty: 'Beginner',
      duration: '2-3 hours',
      points: 120,
      sections: {
        overview: {
          title: 'Climate Change Fundamentals',
          content: [
            'Climate change refers to long-term shifts in global temperatures and weather patterns. While climate variations occur naturally, scientific evidence shows that human activities have been the main driver since the 1800s.',
            'The greenhouse effect is a natural process where certain gases in the atmosphere trap heat from the sun, keeping Earth warm enough to support life. However, human activities have increased the concentration of these greenhouse gases, intensifying this effect.',
            'The main greenhouse gases include carbon dioxide (CO2), methane (CH4), nitrous oxide (N2O), and fluorinated gases. CO2 is the most significant, primarily released through burning fossil fuels.',
            'Climate change impacts include rising temperatures, melting ice sheets, rising sea levels, changes in precipitation patterns, and more frequent extreme weather events.'
          ],
          keyPoints: [
            'Global average temperature has risen by 1.1°C since pre-industrial times',
            'CO2 levels in the atmosphere are at their highest in 3 million years',
            'Arctic sea ice is declining at a rate of 13% per decade',
            'Sea levels have risen 21-24 cm since 1880',
            'Immediate action is needed to limit warming to 1.5°C'
          ]
        },
        games: [
          {
            id: 'climate-quiz',
            title: 'Climate Science Quiz',
            description: 'Test your knowledge of climate change facts and science',
            type: 'quiz',
            icon: '🧠',
            points: 50,
            data: [
              {
                id: 1,
                question: 'What is the main cause of climate change since the 1800s?',
                options: ['Natural solar cycles', 'Volcanic eruptions', 'Human activities', 'Ocean currents'],
                correctAnswer: 2,
                explanation: 'Scientific evidence shows that human activities, particularly burning fossil fuels, have been the main driver of climate change since the industrial revolution.',
                points: 10
              },
              {
                id: 2,
                question: 'Which greenhouse gas is most abundant in the atmosphere due to human activities?',
                options: ['Methane (CH4)', 'Carbon dioxide (CO2)', 'Nitrous oxide (N2O)', 'Water vapor (H2O)'],
                correctAnswer: 1,
                explanation: 'Carbon dioxide (CO2) is the most abundant greenhouse gas from human activities, primarily from burning fossil fuels.',
                points: 10
              },
              {
                id: 3,
                question: 'By how much has global average temperature risen since pre-industrial times?',
                options: ['0.5°C', '1.1°C', '2.0°C', '3.5°C'],
                correctAnswer: 1,
                explanation: 'Global average temperature has risen by approximately 1.1°C since pre-industrial times (1850-1900 baseline).',
                points: 10
              },
              {
                id: 4,
                question: 'What is the Paris Agreement\'s main goal for limiting global warming?',
                options: ['1.0°C', '1.5°C', '2.0°C', '2.5°C'],
                correctAnswer: 1,
                explanation: 'The Paris Agreement aims to limit global warming to well below 2°C, preferably 1.5°C, compared to pre-industrial levels.',
                points: 10
              },
              {
                id: 5,
                question: 'Which sector is the largest contributor to global greenhouse gas emissions?',
                options: ['Transportation', 'Energy production', 'Agriculture', 'Buildings'],
                correctAnswer: 1,
                explanation: 'Energy production (electricity, heat) is the largest source of global greenhouse gas emissions, accounting for about 25% of total emissions.',
                points: 10
              }
            ]
          },
          {
            id: 'carbon-calculator',
            title: 'Personal Carbon Footprint',
            description: 'Calculate your daily carbon footprint and learn reduction strategies',
            type: 'carbon',
            icon: '📊',
            points: 40
          },
          {
            id: 'climate-memory',
            title: 'Climate Concepts Memory Game',
            description: 'Match climate change terms with their definitions',
            type: 'memory',
            icon: '🧠',
            points: 30
          }
        ],
        resources: {
          title: 'Learn More About Climate Change',
          links: [
            { name: 'IPCC Climate Report', url: 'https://ipcc.ch', type: 'Scientific Report' },
            { name: 'NASA Climate Kids', url: 'https://climatekids.nasa.gov', type: 'Educational' },
            { name: 'Climate Action Tracker', url: 'https://climateactiontracker.org', type: 'Data & Analysis' }
          ],
          videos: [
            { title: 'How Climate Change Works', duration: '8:32', thumbnail: '🎬' },
            { title: 'Renewable Energy Solutions', duration: '12:15', thumbnail: '🎬' },
            { title: 'Individual Climate Actions', duration: '6:45', thumbnail: '🎬' }
          ]
        }
      }
    },
    'waste-management': {
      id: 'waste-management',
      title: 'Waste Management',
      description: 'Learn the 3 Rs: Reduce, Reuse, Recycle. Master waste segregation and circular economy.',
      icon: '♻️',
      bgGradient: 'from-green-400 to-emerald-300',
      textColor: 'text-green-700',
      difficulty: 'Beginner',
      duration: '1-2 hours',
      points: 90,
      sections: {
        overview: {
          title: 'Waste Management Principles',
          content: [
            'Waste management involves the collection, treatment, and disposal of waste materials. Effective waste management is crucial for environmental protection, public health, and resource conservation.',
            'The waste hierarchy, commonly known as the "3 Rs" (Reduce, Reuse, Recycle), provides a framework for minimizing waste and maximizing resource efficiency. Prevention and reduction are the most preferred options.',
            'The circular economy model aims to eliminate waste by designing out waste and pollution, keeping products and materials in use, and regenerating natural systems.',
            'Proper waste segregation at source is essential for effective recycling and waste processing. Different materials require different treatment methods.'
          ],
          keyPoints: [
            'The average person generates 4.5 pounds of waste per day',
            'Only 9% of all plastic waste has been recycled',
            'Food waste accounts for 30-40% of food supply',
            'Recycling one aluminum can saves enough energy to power a TV for 3 hours',
            'Composting can divert 30% of household waste from landfills'
          ]
        },
        games: [
          {
            id: 'recycling-game',
            title: 'Waste Sorting Challenge',
            description: 'Sort different waste items into the correct recycling bins',
            type: 'recycling',
            icon: '♻️',
            points: 60
          },
          {
            id: 'waste-quiz',
            title: 'Waste Management Quiz',
            description: 'Test your knowledge about recycling and waste reduction',
            type: 'quiz',
            icon: '🧠',
            points: 30,
            data: [
              {
                id: 1,
                question: 'What does the "3 Rs" stand for in waste management?',
                options: ['Read, Write, Repeat', 'Reduce, Reuse, Recycle', 'Run, Rest, Recover', 'Red, Green, Blue'],
                correctAnswer: 1,
                explanation: 'The 3 Rs stand for Reduce (minimize waste), Reuse (find new uses for items), and Recycle (process materials into new products).',
                points: 10
              },
              {
                id: 2,
                question: 'Which type of plastic is most commonly recycled?',
                options: ['PET (Polyethylene Terephthalate)', 'PVC (Polyvinyl Chloride)', 'PS (Polystyrene)', 'Other plastics'],
                correctAnswer: 0,
                explanation: 'PET plastic, commonly used in water bottles and food containers, is the most widely recycled plastic type.',
                points: 10
              },
              {
                id: 3,
                question: 'How long does it take for a plastic bottle to decompose in a landfill?',
                options: ['1-5 years', '10-20 years', '50-100 years', '450+ years'],
                correctAnswer: 3,
                explanation: 'Plastic bottles can take 450 years or more to decompose in landfills, which is why recycling is so important.',
                points: 10
              }
            ]
          }
        ],
        resources: {
          title: 'Waste Management Resources',
          links: [
            { name: 'EPA Recycling Guidelines', url: 'https://epa.gov/recycle', type: 'Government Resource' },
            { name: 'Zero Waste International Alliance', url: 'https://zwia.org', type: 'Organization' },
            { name: 'Ellen MacArthur Foundation', url: 'https://ellenmacarthurfoundation.org', type: 'Circular Economy' }
          ],
          videos: [
            { title: 'The Story of Stuff', duration: '21:17', thumbnail: '🎬' },
            { title: 'Recycling Process Explained', duration: '9:43', thumbnail: '🎬' },
            { title: 'Zero Waste Lifestyle Tips', duration: '14:28', thumbnail: '🎬' }
          ]
        }
      }
    },
    'water-conservation': {
      id: 'water-conservation',
      title: 'Water Conservation',
      description: 'Protecting our most precious resource through smart usage and conservation techniques.',
      icon: '💧',
      bgGradient: 'from-cyan-400 to-blue-300',
      textColor: 'text-cyan-700',
      difficulty: 'Beginner',
      duration: '2 hours',
      points: 100,
      sections: {
        overview: {
          title: 'Water Conservation Essentials',
          content: [
            'Water is essential for all life on Earth, yet freshwater represents only 3% of all water on the planet. Of this, only 1% is easily accessible for human use.',
            'Water conservation involves using water efficiently to reduce unnecessary water usage. This is important for environmental sustainability, economic benefits, and ensuring water availability for future generations.',
            'Household water use varies by region, but typically includes indoor uses (toilets, showers, washing machines) and outdoor uses (landscaping, pools).',
            'Simple changes in daily habits can significantly reduce water consumption without impacting quality of life.'
          ],
          keyPoints: [
            '1 billion people lack access to clean drinking water',
            'Water scarcity affects 40% of global population',
            'Agriculture uses 70% of global freshwater',
            'A dripping faucet can waste 3,000 gallons per year',
            'Low-flow fixtures can reduce water use by 20-60%'
          ]
        },
        games: [
          {
            id: 'water-simulator',
            title: 'Water Conservation Simulator',
            description: 'Make daily water choices and see their conservation impact',
            type: 'water',
            icon: '💧',
            points: 70
          },
          {
            id: 'water-memory',
            title: 'Water Facts Memory Game',
            description: 'Match water conservation concepts with their descriptions',
            type: 'memory',
            icon: '🧠',
            points: 30
          }
        ],
        resources: {
          title: 'Water Conservation Resources',
          links: [
            { name: 'EPA WaterSense', url: 'https://epa.gov/watersense', type: 'Government Program' },
            { name: 'Water.org', url: 'https://water.org', type: 'Non-profit' },
            { name: 'UN Water', url: 'https://unwater.org', type: 'International Organization' }
          ],
          videos: [
            { title: 'Water Cycle Explained', duration: '7:22', thumbnail: '🎬' },
            { title: 'Home Water Conservation Tips', duration: '11:35', thumbnail: '🎬' },
            { title: 'Global Water Crisis', duration: '15:47', thumbnail: '🎬' }
          ]
        }
      }
    },
    'biodiversity': {
      id: 'biodiversity',
      title: 'Biodiversity Conservation',
      description: 'Explore ecosystems, endangered species, and conservation strategies for protecting nature.',
      icon: '🌱',
      bgGradient: 'from-green-500 to-lime-400',
      textColor: 'text-green-800',
      difficulty: 'Intermediate',
      duration: '3-4 hours',
      points: 150,
      sections: {
        overview: {
          title: 'Biodiversity and Ecosystems',
          content: [
            'Biodiversity refers to the variety of life on Earth - from genes and species to ecosystems. It is the foundation for ecosystem services that all life depends on.',
            'Ecosystems are complex networks of living and non-living components that work together. Each species plays a crucial role in maintaining the balance.',
            'Human activities are causing species extinction at rates 1,000 to 10,000 times faster than natural background rates.',
            'Conservation efforts include protecting habitats, establishing wildlife corridors, and restoring damaged ecosystems.'
          ],
          keyPoints: [
            'Over 1 million species are threatened with extinction',
            'Tropical rainforests contain 50% of terrestrial species',
            'Wetlands provide $23.2 trillion in ecosystem services annually',
            'Pollinators contribute $235 billion to global food production',
            'Protected areas cover only 15% of terrestrial surfaces'
          ]
        },
        games: [
          {
            id: 'biodiversity-memory',
            title: 'Ecosystem Memory Game',
            description: 'Match species with their ecological roles and habitats',
            type: 'memory',
            icon: '🌿',
            points: 50
          },
          {
            id: 'conservation-quiz',
            title: 'Conservation Knowledge Quiz',
            description: 'Test your understanding of biodiversity and conservation',
            type: 'quiz',
            icon: '🧠',
            points: 40,
            data: [
              {
                id: 1,
                question: 'What percentage of known species are insects?',
                options: ['25%', '50%', '75%', '80%'],
                correctAnswer: 3,
                explanation: 'Insects make up about 80% of all known animal species, representing the most diverse group of organisms.',
                points: 10
              },
              {
                id: 2,
                question: 'Which biome has the highest biodiversity?',
                options: ['Tropical rainforest', 'Coral reefs', 'Grasslands', 'Temperate forests'],
                correctAnswer: 0,
                explanation: 'Tropical rainforests contain the highest diversity of species per unit area of any terrestrial biome.',
                points: 10
              }
            ]
          }
        ],
        resources: {
          title: 'Biodiversity Resources',
          links: [
            { name: 'IUCN Red List', url: 'https://iucnredlist.org', type: 'Conservation Database' },
            { name: 'World Wildlife Fund', url: 'https://wwf.org', type: 'Conservation Organization' },
            { name: 'Convention on Biological Diversity', url: 'https://cbd.int', type: 'International Treaty' }
          ],
          videos: [
            { title: 'The Importance of Biodiversity', duration: '10:15', thumbnail: '🎬' },
            { title: 'Ecosystem Services Explained', duration: '8:45', thumbnail: '🎬' },
            { title: 'Conservation Success Stories', duration: '12:30', thumbnail: '🎬' }
          ]
        }
      }
    },
    'renewable-energy': {
      id: 'renewable-energy',
      title: 'Renewable Energy',
      description: 'Solar, wind, and hydro power. Understanding sustainable energy solutions for the future.',
      icon: '⚡',
      bgGradient: 'from-yellow-400 to-orange-300',
      textColor: 'text-yellow-700',
      difficulty: 'Advanced',
      duration: '4-5 hours',
      points: 180,
      sections: {
        overview: {
          title: 'Renewable Energy Technologies',
          content: [
            'Renewable energy comes from natural sources that are replenished constantly, unlike finite fossil fuels.',
            'The main renewable energy sources include solar, wind, hydroelectric, geothermal, and biomass energy.',
            'Renewable energy technologies are becoming more efficient and cost-effective, making them competitive with fossil fuels.',
            'Transitioning to renewable energy is crucial for reducing greenhouse gas emissions and combating climate change.'
          ],
          keyPoints: [
            'Renewable energy capacity grew by 280 GW globally in 2022',
            'Solar and wind are now the cheapest sources of electricity',
            'Renewable energy employed 13.7 million people worldwide in 2022',
            'Denmark generates 140% of its electricity from wind power',
            'Battery storage costs have fallen 90% since 2010'
          ]
        },
        games: [
          {
            id: 'energy-memory',
            title: 'Energy Technologies Memory Game',
            description: 'Match renewable energy sources with their applications',
            type: 'memory',
            icon: '⚡',
            points: 60
          },
          {
            id: 'energy-quiz',
            title: 'Renewable Energy Quiz',
            description: 'Test your knowledge of clean energy technologies',
            type: 'quiz',
            icon: '🧠',
            points: 50,
            data: [
              {
                id: 1,
                question: 'Which renewable energy source has the largest global capacity?',
                options: ['Solar', 'Wind', 'Hydroelectric', 'Geothermal'],
                correctAnswer: 2,
                explanation: 'Hydroelectric power has the largest installed capacity globally, though solar and wind are growing rapidly.',
                points: 10
              },
              {
                id: 2,
                question: 'What percentage of global electricity came from renewables in 2022?',
                options: ['15%', '22%', '30%', '38%'],
                correctAnswer: 2,
                explanation: 'Renewable sources generated about 30% of global electricity in 2022, a significant increase from previous years.',
                points: 10
              }
            ]
          }
        ],
        resources: {
          title: 'Renewable Energy Resources',
          links: [
            { name: 'International Renewable Energy Agency (IRENA)', url: 'https://irena.org', type: 'International Organization' },
            { name: 'U.S. Department of Energy', url: 'https://energy.gov', type: 'Government Agency' },
            { name: 'Renewable Energy World', url: 'https://renewableenergyworld.com', type: 'Industry News' }
          ],
          videos: [
            { title: 'How Solar Panels Work', duration: '9:20', thumbnail: '🎬' },
            { title: 'Wind Power Explained', duration: '11:45', thumbnail: '🎬' },
            { title: 'The Future of Energy Storage', duration: '13:15', thumbnail: '🎬' }
          ]
        }
      }
    },
    'sustainable-living': {
      id: 'sustainable-living',
      title: 'Sustainable Living',
      description: 'Adopt eco-friendly lifestyle choices that reduce your environmental footprint.',
      icon: '🏠',
      bgGradient: 'from-teal-400 to-green-300',
      textColor: 'text-teal-700',
      difficulty: 'Intermediate',
      duration: '3 hours',
      points: 135,
      sections: {
        overview: {
          title: 'Sustainable Lifestyle Principles',
          content: [
            'Sustainable living means adopting lifestyle choices that reduce our environmental impact and resource consumption.',
            'Key principles include minimizing waste, choosing renewable resources, reducing energy consumption, and supporting sustainable products.',
            'Small daily choices, when multiplied across millions of people, can have significant environmental benefits.',
            'Sustainable living often leads to cost savings, improved health, and increased life satisfaction.'
          ],
          keyPoints: [
            'The average American generates 4.9 pounds of waste daily',
            'Households account for 29% of global energy consumption',
            'Transportation represents 29% of US greenhouse gas emissions',
            'Local food travels 1,500 miles less than imported alternatives',
            'LED bulbs use 75% less energy than incandescent bulbs'
          ]
        },
        games: [
          {
            id: 'sustainable-choices',
            title: 'Daily Choices Impact Calculator',
            description: 'See how your daily decisions affect the environment',
            type: 'carbon',
            icon: '🏠',
            points: 70
          },
          {
            id: 'eco-memory',
            title: 'Eco-Friendly Products Memory Game',
            description: 'Match sustainable products with their environmental benefits',
            type: 'memory',
            icon: '🌱',
            points: 35
          }
        ],
        resources: {
          title: 'Sustainable Living Resources',
          links: [
            { name: 'EPA Sustainable Living', url: 'https://epa.gov/sustainability', type: 'Government Resource' },
            { name: 'Green Living Ideas', url: 'https://greenlivingideas.com', type: 'Lifestyle Blog' },
            { name: 'Sustainable Brands', url: 'https://sustainablebrands.com', type: 'Business Resource' }
          ],
          videos: [
            { title: 'Zero Waste Home Tour', duration: '15:30', thumbnail: '🎬' },
            { title: 'Sustainable Fashion Guide', duration: '12:10', thumbnail: '🎬' },
            { title: 'Green Home Energy Tips', duration: '8:55', thumbnail: '🎬' }
          ]
        }
      }
    }
  };

  const currentLesson = lessonId ? lessons[lessonId] : null;

  useEffect(() => {
    if (!currentLesson) {
      navigate('/lessons');
      return;
    }
  }, [currentLesson, navigate]);

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h2>
          <button
            onClick={() => navigate('/lessons')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  const handleGameComplete = (gameId: string, score: number, ecoPoints: number) => {
    // Demo mode - update local state
    if (lessonId) {
      const existingIndex = demoGameProgress.findIndex(
        p => p.lessonId === lessonId && p.gameId === gameId
      );
      
      const newProgress = {
        gameId,
        lessonId,
        score,
        completed: true,
        completedAt: new Date().toISOString(),
        attempts: 1
      };
      
      if (existingIndex >= 0) {
        const updatedProgress = [...demoGameProgress];
        updatedProgress[existingIndex] = { ...updatedProgress[existingIndex], score: Math.max(score, updatedProgress[existingIndex].score) };
        setDemoGameProgress(updatedProgress);
      } else {
        setDemoGameProgress([...demoGameProgress, newProgress]);
      }
      
      setDemoEcoPoints(demoEcoPoints + ecoPoints);
    }
    setShowGameModal(false);
    setSelectedGame(null);
  };

  const isGameCompleted = (gameId: string) => {
    if (!lessonId) return false;
    return demoGameProgress.some(
      p => p.lessonId === lessonId && p.gameId === gameId && p.completed
    );
  };

  const getGameScore = (gameId: string) => {
    if (!lessonId) return 0;
    const progress = demoGameProgress.find(
      p => p.lessonId === lessonId && p.gameId === gameId
    );
    return progress?.score || 0;
  };

  const getTotalEcoPointsEarned = () => {
    return demoEcoPoints;
  };

  const openGame = (game: any) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const renderGame = () => {
    if (!selectedGame) return null;

    const commonProps = {
      onComplete: (score: number, ecoPoints: number) => 
        handleGameComplete(selectedGame.id, score, ecoPoints),
      title: selectedGame.title
    };

    switch (selectedGame.type) {
      case 'quiz':
        return (
          <QuizGame
            {...commonProps}
            questions={selectedGame.data || []}
            theme={currentLesson.id.split('-')[0]}
          />
        );
      case 'recycling':
        return <RecyclingGame {...commonProps} />;
      case 'carbon':
        return <CarbonFootprintCalculator {...commonProps} />;
      case 'memory':
        return (
          <MemoryCardGame
            {...commonProps}
            theme={currentLesson.id.includes('climate') ? 'climate' : 
                   currentLesson.id.includes('water') ? 'water' : 
                   currentLesson.id.includes('biodiversity') ? 'biodiversity' : 'energy'}
          />
        );
      case 'water':
        return <WaterConservationSimulator {...commonProps} />;
      default:
        return null;
    }
  };

  const completionPercentage = currentLesson ? Math.round(
    (currentLesson.sections.games.filter(game => isGameCompleted(game.id)).length / currentLesson.sections.games.length) * 100
  ) : 0;
  
  const totalEcoPoints = getTotalEcoPointsEarned();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${currentLesson.bgGradient} text-white`}>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/lessons')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>Back to Lessons</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">Progress: {completionPercentage}%</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="font-semibold">EcoPoints: {totalEcoPoints}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 mb-6">
            <div className="text-6xl">{currentLesson.icon}</div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{currentLesson.title}</h1>
              <p className="text-xl text-white/90 mb-4">{currentLesson.description}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <span>⏱️</span>
                  <span>{currentLesson.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>{currentLesson.difficulty}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🏆</span>
                  <span>{currentLesson.points} points</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="h-2 bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: '📖' },
              { id: 'games', name: 'Interactive Games', icon: '🎮' },
              { id: 'resources', name: 'Resources', icon: '📚' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentSection(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-semibold transition-colors ${
                  currentSection === tab.id
                    ? `border-blue-500 ${currentLesson.textColor}`
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentLesson.sections.overview.title}</h2>
                    <div className="space-y-4">
                      {currentLesson.sections.overview.content.map((paragraph, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Key Facts</h3>
                    <ul className="space-y-3">
                      {currentLesson.sections.overview.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span className="text-gray-700 text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentSection === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentLesson.sections.games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-lg p-6 relative"
                  >
                    {isGameCompleted(game.id) && (
                      <div className="absolute top-4 right-4 text-green-500">
                        <div className="bg-green-100 rounded-full p-2">
                          ✓
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">{game.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
                      <p className="text-gray-600 text-sm">{game.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Points Available:</span>
                        <span className="font-semibold text-blue-600">{game.points}</span>
                      </div>
                      
                      {isGameCompleted(game.id) && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">Your Score:</span>
                          <span className="font-semibold text-green-600">{getGameScore(game.id)}</span>
                        </div>
                      )}
                      
                      <button
                        onClick={() => openGame(game)}
                        className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
                          isGameCompleted(game.id)
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : `bg-gradient-to-r ${currentLesson.bgGradient} text-white hover:shadow-lg`
                        }`}
                      >
                        {isGameCompleted(game.id) ? '🔄 Play Again' : '🚀 Start Game'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentSection === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">External Resources</h3>
                  <div className="space-y-4">
                    {currentLesson.sections.resources.links.map((link, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{link.name}</h4>
                            <p className="text-sm text-gray-600">{link.type}</p>
                          </div>
                          <button className="text-blue-500 hover:text-blue-600">
                            🔗
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Educational Videos</h3>
                  <div className="space-y-4">
                    {currentLesson.sections.resources.videos.map((video, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{video.thumbnail}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{video.title}</h4>
                            <p className="text-sm text-gray-600">Duration: {video.duration}</p>
                          </div>
                          <button className="text-blue-500 hover:text-blue-600">
                            ▶️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Game Modal */}
      <AnimatePresence>
        {showGameModal && selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-full overflow-y-auto relative"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">{selectedGame.title}</h2>
                <button
                  onClick={() => {
                    setShowGameModal(false);
                    setSelectedGame(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                {renderGame()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonDetail;
