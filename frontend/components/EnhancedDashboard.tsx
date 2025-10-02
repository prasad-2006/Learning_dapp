import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useTheme } from "../App";

interface DashboardProps {
  onContinueLearning: () => void;
}

export default function Dashboard({ onContinueLearning }: DashboardProps) {
  const { account } = useWallet();
  const { userProgress, coursesData, theme } = useTheme();
  
  const nextLevelXP = userProgress.level * 1000;
  const currentLevelProgress = ((userProgress.xp % 1000) / 1000) * 100;

  const statsCards = [
    {
      title: "Level",
      value: userProgress.level.toString(),
      icon: "🎯",
      color: "from-blue-400 to-purple-500",
      change: `${userProgress.xp} Total XP`
    },
    {
      title: "Courses Completed",
      value: userProgress.completedCourses.length.toString(),
      icon: "📚",
      color: "from-green-400 to-emerald-500",
      change: `${coursesData.length - userProgress.completedCourses.length} remaining`
    },
    {
      title: "Certificates",
      value: userProgress.certificates.length.toString(),
      icon: "🏆",
      color: "from-purple-400 to-pink-500",
      change: "Blockchain verified"
    },
    {
      title: "Experience Points",
      value: userProgress.xp.toString(),
      icon: "⭐",
      color: "from-yellow-400 to-orange-500",
      change: `${nextLevelXP - userProgress.xp} to next level`
    }
  ];

  const recentCertificates = userProgress.certificates.slice(-3);
  const incompleteCourses = coursesData.filter(course => 
    !userProgress.completedCourses.includes(course.id)
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, Learner! 👋
        </h1>
        <p className="text-gray-300 text-lg">
          Ready to continue your learning journey?
        </p>
      </motion.div>

      {/* Continue Learning CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-8 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'} text-center`}
      >
        <h2 className="text-3xl font-bold text-white mb-4">🚀 Continue Your Learning</h2>
        <p className="text-gray-300 text-lg mb-6">
          {incompleteCourses.length > 0 
            ? `You have ${incompleteCourses.length} course${incompleteCourses.length > 1 ? 's' : ''} waiting for you!`
            : "🎉 Congratulations! You've completed all available courses!"
          }
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinueLearning}
          disabled={incompleteCourses.length === 0}
          className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
            incompleteCourses.length > 0
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          {incompleteCourses.length > 0 ? 'Continue Learning' : 'All Courses Complete'}
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-6 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Level {userProgress.level} Progress</h3>
          <span className="text-gray-300">
            {userProgress.xp % 1000}/{nextLevelXP - ((userProgress.level - 1) * 1000)} XP
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentLevelProgress}%` }}
            transition={{ duration: 1, delay: 0.8 }}
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {nextLevelXP - userProgress.xp} XP needed for level {userProgress.level + 1}
        </p>
      </motion.div>

      {/* Recent Certificates */}
      {recentCertificates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-6 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'}`}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">🏆</span>
            Recent Certificates
          </h3>
          <div className="space-y-3">
            {recentCertificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
              >
                <div>
                  <h4 className="font-semibold text-white">{cert.courseName}</h4>
                  <p className="text-gray-400 text-sm">
                    Score: {cert.score} • Level: {cert.level}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{cert.dateEarned}</p>
                  <span className="text-green-400 text-sm">✓ Verified</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Available Courses Preview */}
      {incompleteCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-6 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'}`}
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📚</span>
            Available Courses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incompleteCourses.slice(0, 4).map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer"
                onClick={onContinueLearning}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{course.image}</span>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{course.title}</h4>
                    <p className="text-gray-400 text-xs">{course.level} • {course.duration}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-xs">{course.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-yellow-400 text-xs">⭐ {course.xpReward} XP</span>
                  <span className="text-blue-400 text-xs">Start Learning →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
