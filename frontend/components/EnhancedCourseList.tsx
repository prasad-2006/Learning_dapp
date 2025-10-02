import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../App";

interface CourseListProps {
  onCourseEnroll: (course: any) => void;
}

export default function CourseList({ onCourseEnroll }: CourseListProps) {
  const { coursesData, userProgress, theme } = useTheme();
  const [filteredCourses, setFilteredCourses] = useState(coursesData);
  const [selectedLevel, setSelectedLevel] = useState('All');

  useEffect(() => {
    if (selectedLevel === 'All') {
      setFilteredCourses(coursesData);
    } else {
      setFilteredCourses(coursesData.filter(course => course.level === selectedLevel));
    }
  }, [selectedLevel, coursesData]);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

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
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              selectedLevel === level
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : `${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white/10'} text-gray-300 hover:bg-white/20 border ${theme === 'dark' ? 'border-gray-700/50' : 'border-white/20'}`
            }`}
          >
            {level}
          </motion.button>
        ))}
      </motion.div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCourses.map((course, index) => {
          const isCompleted = userProgress.completedCourses.includes(course.id);
          const hasCertificate = userProgress.certificates.some(cert => 
            cert.courseName === course.title
          );
          
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
            >
              {/* Status Badge */}
              {isCompleted && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                    {hasCertificate ? '🏆 Certified' : '✅ Completed'}
                  </span>
                </div>
              )}

              {/* Course Icon */}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-3xl shadow-lg mr-4">
                  {course.image}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{course.title}</h3>
                  <div className="flex items-center space-x-3 text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      course.level === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                      course.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {course.level}
                    </span>
                    <span className="text-gray-400">⏱️ {course.duration}</span>
                    <span className="text-yellow-400">⭐ {course.xpReward} XP</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {course.theory.chapters.length}
                  </div>
                  <div className="text-xs text-gray-400">Chapters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {course.quiz.questions.length}
                  </div>
                  <div className="text-xs text-gray-400">Quiz Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {course.level}
                  </div>
                  <div className="text-xs text-gray-400">Difficulty</div>
                </div>
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCourseEnroll(course)}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } shadow-lg hover:shadow-xl`}
              >
                {isCompleted ? '📖 Review Course' : '🚀 Start Learning'}
              </motion.button>

              {/* Certificate Info */}
              {hasCertificate && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center text-yellow-300 text-sm">
                    <span className="mr-2">🏆</span>
                    <span>Certificate earned and stored on blockchain!</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-white mb-2">No courses found</h3>
          <p className="text-gray-400">Try adjusting your filters to find more courses.</p>
        </motion.div>
      )}

      {/* Stats Summary */}
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
              {userProgress.completedCourses.length}
            </div>
            <div className="text-gray-400 text-sm">Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">
              {userProgress.certificates.length}
            </div>
            <div className="text-gray-400 text-sm">Certificates</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-1">
              {Math.round((userProgress.completedCourses.length / coursesData.length) * 100)}%
            </div>
            <div className="text-gray-400 text-sm">Progress</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
