import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface UserProfile {
  username: string;
  level: number;
  experiencePoints: number;
  totalScore: number;
  coursesCompleted: number;
  badgesEarned: number;
  streakDays: number;
  joinDate: string;
  favoriteCategory: string;
  totalStudyTime: number;
  achievements: Achievement[];
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

export default function Profile() {
  const { account } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");

  useEffect(() => {
    // Try to load profile from localStorage first
    const savedProfile = localStorage.getItem('userProfile');
    
    let loadedProfile: UserProfile;
    if (savedProfile) {
      try {
        loadedProfile = JSON.parse(savedProfile);
      } catch (error) {
        console.error('Error loading saved profile:', error);
        loadedProfile = getDefaultProfile();
      }
    } else {
      loadedProfile = getDefaultProfile();
    }

    setProfile(loadedProfile);
    setEditUsername(loadedProfile.username);
  }, [account]);

  const getDefaultProfile = (): UserProfile => ({
    username: "CryptoLearner",
    level: 8,
    experiencePoints: 7250,
    totalScore: 12450,
    coursesCompleted: 11,
    badgesEarned: 14,
    streakDays: 18,
    joinDate: "2024-06-15",
    favoriteCategory: "Blockchain",
    totalStudyTime: 85, // hours
    achievements: [
      {
        id: 1,
        name: "First Steps",
        description: "Completed your first course",
        icon: "👶",
        earnedDate: "2024-06-20",
        rarity: "Common"
      },
      {
        id: 2,
        name: "Quiz Master",
        description: "Achieved 100% on 5 quizzes",
        icon: "🧠",
        earnedDate: "2024-07-10",
        rarity: "Rare"
      },
      {
        id: 3,
        name: "Streak Keeper",
        description: "Maintained a 30-day learning streak",
        icon: "🔥",
        earnedDate: "2024-08-01",
        rarity: "Epic"
      }
    ]
  });

  const currentLevelProgress = profile ? (profile.experiencePoints % 1000) / 10 : 0;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'from-gray-400 to-gray-600';
      case 'Rare': return 'from-blue-400 to-blue-600';
      case 'Epic': return 'from-purple-400 to-purple-600';
      case 'Legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const handleSaveProfile = () => {
    if (profile) {
      const updatedProfile = { ...profile, username: editUsername };
      setProfile(updatedProfile);
      // Save to localStorage for other components to access
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setIsEditing(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">👤 Your Profile</h1>
        <p className="text-gray-300 text-lg">Track your learning journey</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  👤
                </div>
                <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-400 to-purple-500 text-white text-sm px-3 py-1 rounded-full font-bold`}>
                  Level {profile.level}
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center"
                  />
                  <div className="flex gap-2 justify-center">
                    <Button onClick={handleSaveProfile} size="sm" className="bg-green-600 hover:bg-green-700">
                      Save
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsEditing(false);
                        setEditUsername(profile.username);
                      }} 
                      size="sm" 
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <CardTitle className="text-white text-xl mb-2">{profile.username}</CardTitle>
                  <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                    Edit Profile
                  </Button>
                </div>
              )}
              
              <p className="text-gray-400 text-sm mt-2">
                Member since {new Date(profile.joinDate).toLocaleDateString()}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Level Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Level Progress</span>
                  <span className="text-white">{profile.experiencePoints % 1000} / 1000 XP</span>
                </div>
                <Progress value={currentLevelProgress} />
              </div>

              {/* Wallet Info */}
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Wallet Address</p>
                <p className="text-white text-sm font-mono">
                  {account?.address?.toString().slice(0, 6)}...{account?.address?.toString().slice(-4)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats and Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Stats Grid */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">📊 Learning Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Score", value: profile.totalScore.toLocaleString(), icon: "⭐", color: "from-yellow-400 to-orange-500" },
                  { label: "Courses", value: profile.coursesCompleted.toString(), icon: "📚", color: "from-green-400 to-teal-500" },
                  { label: "Badges", value: profile.badgesEarned.toString(), icon: "🏅", color: "from-purple-400 to-pink-500" },
                  { label: "Streak", value: `${profile.streakDays} days`, icon: "🔥", color: "from-red-400 to-orange-500" },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 rounded-lg p-4 text-center"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-2xl mx-auto mb-2`}>
                      {stat.icon}
                    </div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">📈 Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Study Time</span>
                  <span className="text-white font-semibold">{profile.totalStudyTime}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Favorite Category</span>
                  <span className="text-white font-semibold">{profile.favoriteCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Current Streak</span>
                  <span className="text-white font-semibold">{profile.streakDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Completion Rate</span>
                  <span className="text-green-400 font-semibold">92%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">🎯 Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Weekly Goal</span>
                    <span className="text-white">3/5 courses</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Monthly Streak</span>
                    <span className="text-white">18/30 days</span>
                  </div>
                  <Progress value={60} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Level Progress</span>
                    <span className="text-white">Level {profile.level} → {profile.level + 1}</span>
                  </div>
                  <Progress value={currentLevelProgress} />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🏆 Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} p-1 rounded-lg`}
                >
                  <div className="bg-black/50 rounded-lg p-4 text-center">
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h4 className="font-bold text-white mb-1">{achievement.name}</h4>
                    <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white bg-white/20 px-2 py-1 rounded">
                        {achievement.rarity}
                      </span>
                      <span className="text-gray-400">
                        {new Date(achievement.earnedDate).toLocaleDateString()}
                      </span>
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
