import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { useTheme } from "../App";
import { useEffect, useState } from "react";

interface DashboardProps {
  onContinueLearning: () => void;
}

interface UserProgress {
  totalXP: number;
  completedCourses: number;
  currentLevel: number;
  certificatesCount: number;
  streakDays: number;
  lastLearningDate: string | null;
}

// Helper function to calculate level from XP
const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1; // 100 XP per level
};

// Helper function to get real user progress from localStorage
const getUserProgress = (): UserProgress => {
  try {
    // Get certificates
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    const certificatesCount = certificates.length;
    
    // Calculate total XP from completed quizzes (each perfect quiz = 50 XP)
    const totalXP = certificatesCount * 50;
    
    // Calculate level
    const currentLevel = calculateLevel(totalXP);
    
    // Get last learning date and calculate streak
    const lastLearningDate = localStorage.getItem('lastLearningDate');
    const today = new Date().toDateString();
    let streakDays = parseInt(localStorage.getItem('streakDays') || '0');
    
    // Update streak if learning today
    if (lastLearningDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLearningDate === yesterday.toDateString()) {
        streakDays += 1;
      } else if (lastLearningDate !== today) {
        streakDays = 1; // Reset streak if more than 1 day gap
      }
      
      localStorage.setItem('streakDays', streakDays.toString());
      localStorage.setItem('lastLearningDate', today);
    }
    
    return {
      totalXP,
      completedCourses: certificatesCount, // Each certificate represents a completed course
      currentLevel,
      certificatesCount,
      streakDays,
      lastLearningDate
    };
  } catch (error) {
    console.error('Error calculating user progress:', error);
    return {
      totalXP: 0,
      completedCourses: 0,
      currentLevel: 1,
      certificatesCount: 0,
      streakDays: 0,
      lastLearningDate: null
    };
  }
};

export default function Dashboard({ onContinueLearning }: DashboardProps) {
  const { theme } = useTheme();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXP: 0,
    completedCourses: 0,
    currentLevel: 1,
    certificatesCount: 0,
    streakDays: 0,
    lastLearningDate: null
  });

  useEffect(() => {
    // Update progress when component mounts and periodically
    const updateProgress = () => {
      const progress = getUserProgress();
      setUserProgress(progress);
    };
    
    updateProgress();
    
    // Listen for certificate updates
    const handleStorageChange = () => {
      updateProgress();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check every 10 seconds in case certificates were added in same tab
    const interval = setInterval(updateProgress, 10000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const stats = [
    { 
      title: "Experience Points", 
      value: userProgress.totalXP, 
      change: userProgress.totalXP > 0 ? `Level ${userProgress.currentLevel}` : "Start learning!",
      icon: "⭐"
    },
    { 
      title: "Courses Completed", 
      value: userProgress.completedCourses, 
      change: userProgress.completedCourses > 0 ? "Great progress!" : "Take your first quiz!",
      icon: "📚"
    },
    { 
      title: "Current Level", 
      value: userProgress.currentLevel, 
      change: `${100 - (userProgress.totalXP % 100)} XP to next level`,
      icon: "🎯"
    },
    { 
      title: "Learning Streak", 
      value: userProgress.streakDays, 
      change: userProgress.streakDays > 1 ? "Keep it up!" : "Start your streak today!",
      icon: "🔥"
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome back, Learner! 🚀
        </h1>
        <p className="text-gray-300 text-lg">
          Ready to continue your crypto learning journey?
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <Card className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'} hover:border-blue-500/50 transition-all duration-300`}>
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300 mb-1">{stat.title}</div>
                <div className="text-xs text-gray-400">{stat.change}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`${theme === 'dark' ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20' : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10'} backdrop-blur-lg rounded-2xl p-6 border ${theme === 'dark' ? 'border-blue-700/30' : 'border-blue-400/20'}`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">
              Continue Learning
            </h2>
            <p className="text-gray-300 mb-4">
              Pick up where you left off with "Blockchain Fundamentals"
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>📖 Beginner</span>
              <span>⏱️ 2-3 hours</span>
              <span>🪙 500 XP</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinueLearning}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue Learning →
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-6 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'}`}
      >
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          📊 Your Progress Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-1">
              {userProgress.totalXP > 0 ? `${Math.round((userProgress.totalXP % 100))}%` : '0%'}
            </div>
            <div className="text-gray-400 text-sm">Progress to Next Level</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {userProgress.completedCourses}
            </div>
            <div className="text-gray-400 text-sm">Completed Courses</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {userProgress.streakDays}
            </div>
            <div className="text-gray-400 text-sm">Day Streak</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
