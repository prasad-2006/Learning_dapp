import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../App";

interface CourseListProps {
  onCourseEnroll: (course: any) => void;
}

export default function CourseList({ onCourseEnroll }: CourseListProps) {
  const { theme } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState('All');

  const coursesData = [
    {
      id: 1,
      title: "Blockchain Fundamentals",
      description: "Learn the basics of blockchain technology, cryptocurrencies, and decentralized systems.",
      level: "Beginner",
      duration: "2-3 hours",
      xpReward: 500,
      thumbnail: "🔗",
      students: 1250,
      rating: 4.8,
      enrolled: false,
      progress: 0,
      quizQuestions: 5,
      quizTopics: ["Blockchain Definition", "SHA-256 Hashing", "Consensus Mechanisms", "Decentralization", "Cryptographic Linking"]
    },
    {
      id: 2,
      title: "Smart Contract Development",
      description: "Build and deploy smart contracts on Ethereum using Solidity programming language.",
      level: "Intermediate", 
      duration: "4-6 hours",
      xpReward: 750,
      thumbnail: "📝",
      students: 890,
      rating: 4.9,
      enrolled: true,
      progress: 45,
      quizQuestions: 5,
      quizTopics: ["Smart Contract Basics", "Solidity Language", "Visibility Modifiers", "Gas Mechanism", "Contract Immutability"]
    },
    {
      id: 3,
      title: "DeFi Protocols Deep Dive",
      description: "Explore decentralized finance protocols, yield farming, and liquidity mining.",
      level: "Advanced",
      duration: "6-8 hours", 
      xpReward: 1000,
      thumbnail: "💰",
      students: 560,
      rating: 4.7,
      enrolled: false,
      progress: 0,
      quizQuestions: 5,
      quizTopics: ["DeFi Overview", "Automated Market Makers", "Constant Product Formula", "Impermanent Loss", "Yield Farming"]
    },
    {
      id: 4,
      title: "NFT Marketplace Creation",
      description: "Build and deploy your own NFT marketplace using React and Web3 technologies.",
      level: "Intermediate",
      duration: "5-7 hours",
      xpReward: 850,
      thumbnail: "🎨",
      students: 720,
      rating: 4.6,
      enrolled: true,
      progress: 20,
      quizQuestions: 5,
      quizTopics: ["NFT Definition", "ERC-721 Standard", "NFT Uniqueness", "Metadata Storage", "tokenURI Function"]
    }
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = selectedLevel === 'All' 
    ? coursesData 
    : coursesData.filter(course => course.level === selectedLevel);

  const handleEnroll = (courseId: number) => {
    const course = coursesData.find(c => c.id === courseId);
    if (course) {
      onCourseEnroll(course);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          📚 Available Courses
        </h1>
        <p className="text-gray-300 text-lg">
          Choose a course to start your learning journey
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {levels.map((level) => (
          <motion.button
            key={level}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedLevel(level)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              selectedLevel === level
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : theme === 'dark'
                ? 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50'
                : 'bg-white/10 text-gray-200 hover:bg-white/20'
            }`}
          >
            {level}
          </motion.button>
        ))}
      </motion.div>

      {/* Courses Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-6 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'} hover:border-blue-500/50 transition-all duration-300`}
          >
            {/* Course Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{course.thumbnail}</div>
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  course.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                  course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-red-500/20 text-red-300'
                }`}>
                  {course.level}
                </span>
              </div>
            </div>

            {/* Course Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{course.description}</p>
              </div>

              {/* Course Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                <span>⏱️ {course.duration}</span>
                <span>👥 {course.students}</span>
                <span>⭐ {course.rating}</span>
              </div>

              {/* Quiz Information */}
              <div className="bg-white/5 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-semibold text-sm">📝 Quiz Content</span>
                  <span className="text-purple-400 text-xs">{course.quizQuestions} Questions</span>
                </div>
                <div className="space-y-1">
                  {course.quizTopics.slice(0, 3).map((topic: string, index: number) => (
                    <div key={index} className="text-xs text-gray-300 flex items-center">
                      <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                      {topic}
                    </div>
                  ))}
                  {course.quizTopics.length > 3 && (
                    <div className="text-xs text-gray-400 italic">
                      +{course.quizTopics.length - 3} more topics...
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar (if enrolled) */}
              {course.enrolled && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Enrollment Button */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-1 text-yellow-400">
                  <span className="text-lg">🪙</span>
                  <span className="font-bold">{course.xpReward}</span>
                  <span className="text-gray-400 text-sm">XP</span>
                </div>
                
                {course.enrolled ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEnroll(course.id)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    Continue Learning
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEnroll(course.id)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    Enroll Now
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-400 py-12"
        >
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p>Try adjusting your filters to see more courses.</p>
        </motion.div>
      )}

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-6 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-1">
              {coursesData.length}
            </div>
            <div className="text-gray-400 text-sm">Total Courses</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-400 mb-1">
              2
            </div>
            <div className="text-gray-400 text-sm">Enrolled</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              0
            </div>
            <div className="text-gray-400 text-sm">Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              50%
            </div>
            <div className="text-gray-400 text-sm">Avg Progress</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}