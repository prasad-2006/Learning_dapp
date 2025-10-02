import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category: string;
  earnedDate?: string;
  isEarned: boolean;
  progress?: number;
  requirement: string;
}

export default function BadgeCollection() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [hoveredBadge, setHoveredBadge] = useState<Badge | null>(null);

  useEffect(() => {
    // Get real badge data based on actual achievements
    const calculateBadges = (): Badge[] => {
      try {
        // Get user's actual progress from localStorage
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        const certificatesCount = certificates.length;
        const totalXP = certificatesCount * 50;
        const currentLevel = Math.floor(totalXP / 100) + 1;
        const streakDays = parseInt(localStorage.getItem('streakDays') || '0');
        
        // Count perfect quiz scores
        const perfectQuizzes = certificates.filter((cert: any) => cert.score === 100).length;
        
        return [
          {
            id: 1,
            name: "First Steps",
            description: "Complete your first quiz with perfect score",
            icon: "👶",
            rarity: "Common",
            category: "Progress",
            earnedDate: certificatesCount > 0 ? certificates[0]?.date : undefined,
            isEarned: certificatesCount >= 1,
            requirement: "Complete 1 quiz with 100%"
          },
          {
            id: 2,
            name: "Knowledge Seeker",
            description: "Complete 3 quizzes with perfect scores",
            icon: "🔍",
            rarity: "Common",
            category: "Progress",
            earnedDate: certificatesCount >= 3 ? certificates[2]?.date : undefined,
            isEarned: certificatesCount >= 3,
            progress: certificatesCount < 3 ? Math.round((certificatesCount / 3) * 100) : undefined,
            requirement: "Complete 3 quizzes with 100%"
          },
          {
            id: 3,
            name: "Quiz Master",
            description: "Complete 5 quizzes with perfect scores",
            icon: "🎓",
            rarity: "Rare",
            category: "Progress",
            earnedDate: certificatesCount >= 5 ? certificates[4]?.date : undefined,
            isEarned: certificatesCount >= 5,
            progress: certificatesCount < 5 ? Math.round((certificatesCount / 5) * 100) : undefined,
            requirement: "Complete 5 quizzes with 100%"
          },
          {
            id: 4,
            name: "Perfect Student",
            description: "Achieve 100% on every quiz taken",
            icon: "⭐",
            rarity: "Epic",
            category: "Achievement",
            earnedDate: certificatesCount >= 3 && perfectQuizzes === certificatesCount ? certificates[certificatesCount - 1]?.date : undefined,
            isEarned: certificatesCount >= 3 && perfectQuizzes === certificatesCount,
            progress: certificatesCount > 0 ? Math.round((perfectQuizzes / certificatesCount) * 100) : undefined,
            requirement: "100% accuracy on all quizzes (min 3)"
          },
          {
            id: 5,
            name: "Streak Keeper",
            description: "Maintain a 7-day learning streak",
            icon: "🔥",
            rarity: "Rare",
            category: "Consistency",
            earnedDate: streakDays >= 7 ? new Date().toISOString() : undefined,
            isEarned: streakDays >= 7,
            progress: streakDays < 7 ? Math.round((streakDays / 7) * 100) : undefined,
            requirement: "7-day learning streak"
          },
          {
            id: 6,
            name: "Dedication Master",
            description: "Maintain a 30-day learning streak",
            icon: "💪",
            rarity: "Epic",
            category: "Consistency",
            earnedDate: streakDays >= 30 ? new Date().toISOString() : undefined,
            isEarned: streakDays >= 30,
            progress: streakDays < 30 ? Math.round((streakDays / 30) * 100) : undefined,
            requirement: "30-day learning streak"
          },
          {
            id: 7,
            name: "Blockchain Enthusiast",
            description: "Complete blockchain fundamentals quiz",
            icon: "⛓️",
            rarity: "Common",
            category: "Subject",
            earnedDate: certificates.some((cert: any) => cert.courseName?.includes('Blockchain')) ? 
              certificates.find((cert: any) => cert.courseName?.includes('Blockchain'))?.date : undefined,
            isEarned: certificates.some((cert: any) => cert.courseName?.includes('Blockchain')),
            requirement: "Complete Blockchain Fundamentals quiz"
          },
          {
            id: 8,
            name: "Smart Contract Expert",
            description: "Complete smart contract development quiz",
            icon: "�",
            rarity: "Rare",
            category: "Subject",
            earnedDate: certificates.some((cert: any) => cert.courseName?.includes('Smart Contract')) ? 
              certificates.find((cert: any) => cert.courseName?.includes('Smart Contract'))?.date : undefined,
            isEarned: certificates.some((cert: any) => cert.courseName?.includes('Smart Contract')),
            requirement: "Complete Smart Contract Development quiz"
          },
          {
            id: 9,
            name: "DeFi Pioneer",
            description: "Complete DeFi protocols quiz",
            icon: "💰",
            rarity: "Rare",
            category: "Subject",
            earnedDate: certificates.some((cert: any) => cert.courseName?.includes('DeFi')) ? 
              certificates.find((cert: any) => cert.courseName?.includes('DeFi'))?.date : undefined,
            isEarned: certificates.some((cert: any) => cert.courseName?.includes('DeFi')),
            requirement: "Complete DeFi Protocols quiz"
          },
          {
            id: 10,
            name: "Level Up Champion",
            description: "Reach level 5",
            icon: "🚀",
            rarity: "Epic",
            category: "Progress",
            earnedDate: currentLevel >= 5 ? new Date().toISOString() : undefined,
            isEarned: currentLevel >= 5,
            progress: currentLevel < 5 ? Math.round((currentLevel / 5) * 100) : undefined,
            requirement: "Reach level 5 (500 XP)"
          },
          {
            id: 11,
            name: "Certificate Collector",
            description: "Earn 10 certificates",
            icon: "�",
            rarity: "Legendary",
            category: "Achievement",
            earnedDate: certificatesCount >= 10 ? certificates[9]?.date : undefined,
            isEarned: certificatesCount >= 10,
            progress: certificatesCount < 10 ? Math.round((certificatesCount / 10) * 100) : undefined,
            requirement: "Earn 10 certificates"
          },
          {
            id: 12,
            name: "Blockchain Scholar",
            description: "Complete all available quizzes",
            icon: "🎯",
            rarity: "Legendary",
            category: "Mastery",
            earnedDate: certificatesCount >= 3 ? certificates[certificatesCount - 1]?.date : undefined, // Assuming 3 quizzes available
            isEarned: certificatesCount >= 3, // Update this number based on actual quiz count
            progress: certificatesCount < 3 ? Math.round((certificatesCount / 3) * 100) : undefined,
            requirement: "Complete all available quizzes"
          }
        ];
      } catch (error) {
        console.error('Error calculating badges:', error);
        return [];
      }
    };

    const calculatedBadges = calculateBadges();
    setBadges(calculatedBadges);
    
    // Listen for updates to certificates
    const handleStorageChange = () => {
      const updatedBadges = calculateBadges();
      setBadges(updatedBadges);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check every 10 seconds for same-tab updates
    const interval = setInterval(() => {
      const updatedBadges = calculateBadges();
      setBadges(updatedBadges);
    }, 10000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'from-gray-400 to-gray-600';
      case 'Rare': return 'from-blue-400 to-blue-600';
      case 'Epic': return 'from-purple-400 to-purple-600';
      case 'Legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'shadow-lg shadow-gray-500/25';
      case 'Rare': return 'shadow-lg shadow-blue-500/25';
      case 'Epic': return 'shadow-lg shadow-purple-500/25';
      case 'Legendary': return 'shadow-lg shadow-yellow-500/25';
      default: return 'shadow-lg shadow-gray-500/25';
    }
  };

  const categories = ['All', ...Array.from(new Set(badges.map(badge => badge.category)))];
  const rarities = ['All', 'Common', 'Rare', 'Epic', 'Legendary'];

  const filteredBadges = badges.filter(badge => {
    const categoryMatch = selectedCategory === 'All' || badge.category === selectedCategory;
    const rarityMatch = selectedRarity === 'All' || badge.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  const earnedCount = badges.filter(badge => badge.isEarned).length;
  const totalCount = badges.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">🏅 Badge Collection</h1>
        <p className="text-gray-300 text-lg">
          {earnedCount}/{totalCount} badges earned
        </p>
        <div className="w-full max-w-md mx-auto mt-4">
          <div className="bg-white/10 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${(earnedCount / totalCount) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {Math.round((earnedCount / totalCount) * 100)}% Complete
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <div className="flex gap-2 items-center">
          <span className="text-white font-medium">Category:</span>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2 items-center">
          <span className="text-white font-medium">Rarity:</span>
          {rarities.map(rarity => (
            <button
              key={rarity}
              onClick={() => setSelectedRarity(rarity)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedRarity === rarity
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {filteredBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onHoverStart={() => setHoveredBadge(badge)}
            onHoverEnd={() => setHoveredBadge(null)}
            className="relative"
          >
            <Card className={`${
              badge.isEarned 
                ? `bg-gradient-to-b ${getRarityColor(badge.rarity)} ${getRarityGlow(badge.rarity)}` 
                : 'bg-white/5 border-gray-600/20'
            } backdrop-blur-lg transition-all duration-300 cursor-pointer`}>
              <CardContent className="p-6 text-center">
                <div className={`text-4xl mb-3 ${badge.isEarned ? '' : 'opacity-30 grayscale'}`}>
                  {badge.icon}
                </div>
                <h3 className={`font-bold text-sm mb-1 ${
                  badge.isEarned ? 'text-white' : 'text-gray-500'
                }`}>
                  {badge.name}
                </h3>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  badge.isEarned ? 'bg-white/20 text-white' : 'bg-gray-600/20 text-gray-500'
                }`}>
                  {badge.rarity}
                </div>
                
                {!badge.isEarned && badge.progress && (
                  <div className="mt-3">
                    <div className="bg-gray-600/20 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-300"
                        style={{ width: `${badge.progress}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{badge.progress}%</p>
                  </div>
                )}
                
                {badge.isEarned && badge.earnedDate && (
                  <p className="text-gray-300 text-xs mt-2">
                    Earned: {new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Hover Details */}
      <AnimatePresence>
        {hoveredBadge && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-black/90 backdrop-blur-lg border-white/20 max-w-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">{hoveredBadge.icon}</div>
                  <div>
                    <h4 className="text-white font-bold">{hoveredBadge.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getRarityColor(hoveredBadge.rarity)}`}>
                      {hoveredBadge.rarity}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2">{hoveredBadge.description}</p>
                <p className="text-gray-400 text-xs">
                  Requirement: {hoveredBadge.requirement}
                </p>
                {hoveredBadge.isEarned && hoveredBadge.earnedDate && (
                  <p className="text-green-400 text-xs mt-1">
                    ✅ Earned on {new Date(hoveredBadge.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Common",
            count: badges.filter(b => b.rarity === 'Common' && b.isEarned).length,
            total: badges.filter(b => b.rarity === 'Common').length,
            color: "from-gray-400 to-gray-600"
          },
          {
            label: "Rare",
            count: badges.filter(b => b.rarity === 'Rare' && b.isEarned).length,
            total: badges.filter(b => b.rarity === 'Rare').length,
            color: "from-blue-400 to-blue-600"
          },
          {
            label: "Epic",
            count: badges.filter(b => b.rarity === 'Epic' && b.isEarned).length,
            total: badges.filter(b => b.rarity === 'Epic').length,
            color: "from-purple-400 to-purple-600"
          },
          {
            label: "Legendary",
            count: badges.filter(b => b.rarity === 'Legendary' && b.isEarned).length,
            total: badges.filter(b => b.rarity === 'Legendary').length,
            color: "from-yellow-400 to-orange-600"
          }
        ].map((stat) => (
          <Card key={stat.label} className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-4 text-center">
              <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-full mx-auto mb-2`}></div>
              <div className="text-lg font-bold text-white">{stat.count}/{stat.total}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
