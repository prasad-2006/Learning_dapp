import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface LeaderboardEntry {
  rank: number;
  address: string;
  username: string;
  score: number;
  level: number;
  badges: number;
  coursesCompleted: number;
  avatar: string;
  streakDays: number;
}

export default function Leaderboard() {
  const { account } = useWallet();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    // Simulate fetching leaderboard data
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        rank: 1,
        address: "0x123...abc",
        username: "CryptoMaster",
        score: 15750,
        level: 12,
        badges: 25,
        coursesCompleted: 18,
        avatar: "🏆",
        streakDays: 45
      },
      {
        rank: 2,
        address: "0x456...def",
        username: "BlockchainPro",
        score: 14200,
        level: 11,
        badges: 22,
        coursesCompleted: 16,
        avatar: "🥈",
        streakDays: 32
      },
      {
        rank: 3,
        address: "0x789...ghi",
        username: "DeFiExplorer",
        score: 13800,
        level: 10,
        badges: 20,
        coursesCompleted: 15,
        avatar: "🥉",
        streakDays: 28
      },
      {
        rank: 4,
        address: "0xabc...123",
        username: "SmartContractDev",
        score: 12500,
        level: 9,
        badges: 18,
        coursesCompleted: 14,
        avatar: "📝",
        streakDays: 25
      },
      {
        rank: 5,
        address: "0xdef...456",
        username: "Web3Builder",
        score: 11800,
        level: 9,
        badges: 16,
        coursesCompleted: 13,
        avatar: "🔨",
        streakDays: 22
      },
      {
        rank: 6,
        address: "0xghi...789",
        username: "NFTCreator",
        score: 11200,
        level: 8,
        badges: 15,
        coursesCompleted: 12,
        avatar: "🎨",
        streakDays: 20
      },
      {
        rank: 7,
        address: account?.address?.toString() || "0x123...current",
        username: "You",
        score: 10500,
        level: 8,
        badges: 14,
        coursesCompleted: 11,
        avatar: "👤",
        streakDays: 18
      },
      {
        rank: 8,
        address: "0xjkl...012",
        username: "TokenTrader",
        score: 9800,
        level: 7,
        badges: 13,
        coursesCompleted: 10,
        avatar: "💱",
        streakDays: 15
      },
      {
        rank: 9,
        address: "0xmno...345",
        username: "DAOGuru",
        score: 9200,
        level: 7,
        badges: 12,
        coursesCompleted: 9,
        avatar: "🏛️",
        streakDays: 12
      },
      {
        rank: 10,
        address: "0xpqr...678",
        username: "MetaversePioneer",
        score: 8700,
        level: 6,
        badges: 11,
        coursesCompleted: 8,
        avatar: "🌐",
        streakDays: 10
      }
    ];

    setLeaderboard(mockLeaderboard);
    
    // Find current user's rank
    const currentUser = mockLeaderboard.find(entry => entry.address === account?.address?.toString());
    if (currentUser) {
      setUserRank(currentUser);
    }
  }, [account, timeframe]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return "from-yellow-400 to-yellow-600";
      case 2: return "from-gray-300 to-gray-500";
      case 3: return "from-orange-400 to-orange-600";
      default: return "from-blue-400 to-purple-500";
    }
  };

  const timeframeOptions = [
    { key: 'weekly', label: 'This Week', icon: '📅' },
    { key: 'monthly', label: 'This Month', icon: '🗓️' },
    { key: 'allTime', label: 'All Time', icon: '⏳' }
  ] as const;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-300 text-lg">
          See how you rank against other learners
        </p>
      </motion.div>

      {/* Timeframe Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-lg border border-white/20">
          {timeframeOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => setTimeframe(option.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                timeframe === option.key
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span>{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Current User Rank Card */}
      {userRank && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-lg border-yellow-400/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                👤 Your Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${getRankColor(userRank.rank)} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {getRankIcon(userRank.rank)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{userRank.username}</h3>
                    <p className="text-gray-300">Level {userRank.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">
                    {userRank.score.toLocaleString()}
                  </div>
                  <p className="text-gray-300 text-sm">points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-4 max-w-4xl mx-auto"
      >
        {/* 2nd Place */}
        <div className="order-1">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-b from-gray-300/20 to-gray-500/20 backdrop-blur-lg border-gray-300/30">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-2">
                    🥈
                  </div>
                  <h3 className="text-lg font-bold text-white">{leaderboard[1]?.username}</h3>
                  <p className="text-gray-300 text-sm">Level {leaderboard[1]?.level}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>⭐ {leaderboard[1]?.score.toLocaleString()} pts</div>
                  <div>🏅 {leaderboard[1]?.badges} badges</div>
                  <div>🔥 {leaderboard[1]?.streakDays} days</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 1st Place */}
        <div className="order-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-b from-yellow-400/20 to-yellow-600/20 backdrop-blur-lg border-yellow-400/30 transform scale-110">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-2">
                    🥇
                  </div>
                  <h3 className="text-xl font-bold text-white">{leaderboard[0]?.username}</h3>
                  <p className="text-gray-300">Level {leaderboard[0]?.level}</p>
                </div>
                <div className="space-y-2 text-gray-300">
                  <div>⭐ {leaderboard[0]?.score.toLocaleString()} pts</div>
                  <div>🏅 {leaderboard[0]?.badges} badges</div>
                  <div>🔥 {leaderboard[0]?.streakDays} days</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 3rd Place */}
        <div className="order-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-b from-orange-400/20 to-orange-600/20 backdrop-blur-lg border-orange-400/30">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-2">
                    🥉
                  </div>
                  <h3 className="text-lg font-bold text-white">{leaderboard[2]?.username}</h3>
                  <p className="text-gray-300 text-sm">Level {leaderboard[2]?.level}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>⭐ {leaderboard[2]?.score.toLocaleString()} pts</div>
                  <div>🏅 {leaderboard[2]?.badges} badges</div>
                  <div>🔥 {leaderboard[2]?.streakDays} days</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              📊 Full Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                    entry.address === account?.address?.toString() 
                      ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getRankColor(entry.rank)} rounded-full flex items-center justify-center text-white font-bold`}>
                      {entry.rank <= 3 ? getRankIcon(entry.rank) : entry.rank}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{entry.avatar}</div>
                      <div>
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          {entry.username}
                          {entry.address === account?.address?.toString() && (
                            <span className="bg-yellow-400/20 text-yellow-300 text-xs px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </h4>
                        <p className="text-gray-400 text-sm">Level {entry.level}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-yellow-400 font-bold">{entry.score.toLocaleString()}</div>
                      <div className="text-gray-400">Points</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400 font-bold">{entry.coursesCompleted}</div>
                      <div className="text-gray-400">Courses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400 font-bold">{entry.badges}</div>
                      <div className="text-gray-400">Badges</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-400 font-bold">{entry.streakDays}</div>
                      <div className="text-gray-400">Streak</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
