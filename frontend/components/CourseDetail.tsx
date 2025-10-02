import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  PlayIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  XMarkIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface TheoryChapter {
  id: number;
  title: string;
  content: string;
  estimatedReadTime: number;
  order: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  theoryChapters: TheoryChapter[];
  requiredLevel: number;
  passingScore: number;
}

interface CourseDetailProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (courseId: number) => void;
  onStartQuiz: (courseId: number) => void;
  userProgress?: {
    isEnrolled: boolean;
    completedChapters: boolean[];
    canTakeQuiz: boolean;
    isCompleted: boolean;
  };
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll,
  onStartQuiz,
  userProgress = {
    isEnrolled: false,
    completedChapters: [],
    canTakeQuiz: false,
    isCompleted: false
  }
}) => {
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showChapterModal && readingTime > 0) {
      interval = setInterval(() => {
        setReadingTime(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showChapterModal, readingTime]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    if (!userProgress.completedChapters.length) return 0;
    const completed = userProgress.completedChapters.filter(Boolean).length;
    return Math.round((completed / course.theoryChapters.length) * 100);
  };

  const openChapter = (chapterIndex: number) => {
    setCurrentChapter(chapterIndex);
    setReadingTime(course.theoryChapters[chapterIndex].estimatedReadTime * 60); // Convert to seconds
    setShowChapterModal(true);
  };

  const markChapterComplete = () => {
    // This would typically call an API to mark the chapter as complete
    setShowChapterModal(false);
    // Simulate API call
    console.log(`Marking chapter ${currentChapter + 1} as complete`);
  };

  const nextChapter = () => {
    if (currentChapter < course.theoryChapters.length - 1) {
      markChapterComplete();
      setCurrentChapter(currentChapter + 1);
      setReadingTime(course.theoryChapters[currentChapter + 1].estimatedReadTime * 60);
    }
  };

  const previousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
      setReadingTime(course.theoryChapters[currentChapter - 1].estimatedReadTime * 60);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">
                    {course.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: course.difficulty }, (_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                <p className="text-white/90 mb-4">{course.description}</p>
                
                {userProgress.isEnrolled && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm">{calculateProgress()}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${calculateProgress()}%` }}
                        transition={{ duration: 1 }}
                        className="bg-green-400 h-2 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors ml-4"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Course Info */}
              <div className="md:col-span-1 space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Course Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Required Level:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{course.requiredLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Chapters:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{course.theoryChapters.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Passing Score:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{course.passingScore}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Est. Time:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {course.theoryChapters.reduce((acc, ch) => acc + ch.estimatedReadTime, 0)} min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {!userProgress.isEnrolled ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onEnroll(course.id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <AcademicCapIcon className="w-5 h-5" />
                        <span>Enroll in Course</span>
                      </div>
                    </motion.button>
                  ) : (
                    <>
                      {userProgress.canTakeQuiz && !userProgress.isCompleted && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onStartQuiz(course.id)}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <PlayIcon className="w-5 h-5" />
                            <span>Take Final Quiz</span>
                          </div>
                        </motion.button>
                      )}
                      
                      {userProgress.isCompleted && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                          <div className="flex items-center space-x-3">
                            <CheckCircleIconSolid className="w-8 h-8 text-green-500" />
                            <div>
                              <p className="font-semibold text-green-900 dark:text-green-100">Course Completed!</p>
                              <p className="text-sm text-green-700 dark:text-green-300">Certificate issued</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Theory Chapters */}
              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <BookOpenIcon className="w-5 h-5" />
                  <span>Course Content</span>
                </h3>
                
                <div className="space-y-3">
                  {course.theoryChapters.map((chapter, index) => {
                    const isCompleted = userProgress.completedChapters[index] || false;
                    const isLocked = !userProgress.isEnrolled || (index > 0 && !userProgress.completedChapters[index - 1]);
                    
                    return (
                      <motion.div
                        key={chapter.id}
                        whileHover={{ scale: isLocked ? 1 : 1.02 }}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          isLocked
                            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-60'
                            : isCompleted
                            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                        }`}
                        onClick={() => !isLocked && openChapter(index)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : isLocked
                                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                                  : 'bg-blue-500 text-white'
                              }`}>
                                {isCompleted ? <CheckCircleIcon className="w-5 h-5" /> : chapter.order}
                              </div>
                              <h4 className={`font-semibold ${
                                isLocked ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'
                              }`}>
                                {chapter.title}
                              </h4>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="w-4 h-4" />
                                <span>{chapter.estimatedReadTime} min read</span>
                              </div>
                              {isLocked && (
                                <span className="text-red-500 text-xs">🔒 Complete previous chapter</span>
                              )}
                            </div>
                          </div>
                          
                          {isCompleted && (
                            <CheckCircleIconSolid className="w-6 h-6 text-green-500" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Chapter Reading Modal */}
      <AnimatePresence>
        {showChapterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
            onClick={() => setShowChapterModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Chapter Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">
                      Chapter {currentChapter + 1} of {course.theoryChapters.length}
                    </p>
                    <h3 className="text-2xl font-bold">{course.theoryChapters[currentChapter]?.title}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {readingTime > 0 && (
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <ClockIcon className="w-4 h-4" />
                          <span>{formatTime(readingTime)}</span>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setShowChapterModal(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chapter Content */}
              <div className="p-8 overflow-y-auto max-h-[60vh]">
                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {course.theoryChapters[currentChapter]?.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chapter Navigation */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={previousChapter}
                    disabled={currentChapter === 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      currentChapter === 0
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Previous</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={currentChapter === course.theoryChapters.length - 1 ? markChapterComplete : nextChapter}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
                  >
                    <span>
                      {currentChapter === course.theoryChapters.length - 1 ? 'Complete Chapter' : 'Next Chapter'}
                    </span>
                    {currentChapter !== course.theoryChapters.length - 1 && (
                      <ArrowRightIcon className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
