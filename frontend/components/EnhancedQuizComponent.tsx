import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  LightBulbIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  TrophyIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import Confetti from 'react-confetti';

interface Quiz {
  id: number;
  courseId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  timeLimit: number;
  explanation: string;
  chapterReference: number;
}

interface QuizComponentProps {
  courseId: number;
  courseTitle: string;
  quizzes: Quiz[];
  onComplete: (courseId: number, answers: number[], score: number) => void;
  onClose: () => void;
  passingScore?: number;
}

interface QuizState {
  currentQuestionIndex: number;
  answers: number[];
  timeRemaining: number;
  isCompleted: boolean;
  showExplanation: boolean;
  score: number;
  shuffledQuizzes: Quiz[];
  shuffledOptions: number[][];
  startTime: number;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  courseId,
  courseTitle,
  quizzes,
  onComplete,
  onClose,
  passingScore = 5
}) => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: Array(quizzes.length).fill(-1),
    timeRemaining: 0,
    isCompleted: false,
    showExplanation: false,
    score: 0,
    shuffledQuizzes: [],
    shuffledOptions: [],
    startTime: Date.now()
  });

  const [showConfetti, setShowConfetti] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState(-1);

  // Shuffle array utility function
  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Initialize shuffled quizzes and options
  useEffect(() => {
    const shuffledQuizzes = shuffleArray(quizzes);
    const shuffledOptions = shuffledQuizzes.map((quiz) => {
      const optionsWithIndex = quiz.options.map((option, index) => ({ option, originalIndex: index }));
      const shuffledOptionsWithIndex = shuffleArray(optionsWithIndex);
      return shuffledOptionsWithIndex.map(item => item.originalIndex);
    });

    setQuizState(prev => ({
      ...prev,
      shuffledQuizzes,
      shuffledOptions,
      timeRemaining: shuffledQuizzes[0]?.timeLimit || 300, // Default 5 minutes per question
    }));
  }, [quizzes, shuffleArray]);

  // Timer effect
  useEffect(() => {
    if (quizState.timeRemaining > 0 && !quizState.isCompleted && !quizState.showExplanation) {
      const timer = setTimeout(() => {
        setQuizState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (quizState.timeRemaining === 0 && !quizState.isCompleted) {
      handleTimeUp();
    }
  }, [quizState.timeRemaining, quizState.isCompleted, quizState.showExplanation]);

  const handleTimeUp = () => {
    if (currentAnswer !== -1) {
      submitAnswer();
    } else {
      // Move to next question with no answer
      nextQuestion();
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const selectAnswer = (answerIndex: number) => {
    if (quizState.showExplanation) return;
    setCurrentAnswer(answerIndex);
  };

  const submitAnswer = () => {
    const currentQuiz = quizState.shuffledQuizzes[quizState.currentQuestionIndex];
    if (!currentQuiz) return;

    // Map shuffled answer back to original index
    const shuffledOptionsForCurrentQuestion = quizState.shuffledOptions[quizState.currentQuestionIndex];
    const originalAnswerIndex = shuffledOptionsForCurrentQuestion[currentAnswer];
    
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestionIndex] = originalAnswerIndex;

    setQuizState(prev => ({
      ...prev,
      answers: newAnswers,
      showExplanation: true
    }));
  };

  const nextQuestion = () => {
    const isLastQuestion = quizState.currentQuestionIndex === quizState.shuffledQuizzes.length - 1;
    
    if (isLastQuestion) {
      completeQuiz();
    } else {
      const nextIndex = quizState.currentQuestionIndex + 1;
      const nextQuiz = quizState.shuffledQuizzes[nextIndex];
      
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        showExplanation: false,
        timeRemaining: nextQuiz.timeLimit
      }));
      setCurrentAnswer(-1);
    }
  };

  const previousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      const prevIndex = quizState.currentQuestionIndex - 1;
      const prevQuiz = quizState.shuffledQuizzes[prevIndex];
      
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prevIndex,
        showExplanation: false,
        timeRemaining: prevQuiz.timeLimit
      }));
      
      // Set the previously selected answer
      const prevAnswer = quizState.answers[prevIndex];
      if (prevAnswer !== -1) {
        const shuffledOptionsForPrevQuestion = quizState.shuffledOptions[prevIndex];
        const shuffledAnswerIndex = shuffledOptionsForPrevQuestion.indexOf(prevAnswer);
        setCurrentAnswer(shuffledAnswerIndex);
      } else {
        setCurrentAnswer(-1);
      }
    }
  };

  const completeQuiz = () => {
    const finalScore = calculateScore();
    const passed = finalScore >= passingScore;
    
    setQuizState(prev => ({
      ...prev,
      isCompleted: true,
      score: finalScore
    }));

    if (passed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    // Call parent completion handler
    onComplete(courseId, quizState.answers, finalScore);
  };

  const calculateScore = (): number => {
    let correctAnswers = 0;
    quizState.shuffledQuizzes.forEach((quiz, index) => {
      if (quizState.answers[index] === quiz.correctAnswer) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  const getScoreColor = (score: number): string => {
    const percentage = (score / quizState.shuffledQuizzes.length) * 100;
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const restartQuiz = () => {
    const reshuffledQuizzes = shuffleArray(quizzes);
    const reshuffledOptions = reshuffledQuizzes.map((quiz) => {
      const optionsWithIndex = quiz.options.map((option, index) => ({ option, originalIndex: index }));
      const shuffledOptionsWithIndex = shuffleArray(optionsWithIndex);
      return shuffledOptionsWithIndex.map(item => item.originalIndex);
    });

    setQuizState({
      currentQuestionIndex: 0,
      answers: Array(quizzes.length).fill(-1),
      timeRemaining: reshuffledQuizzes[0]?.timeLimit || 300,
      isCompleted: false,
      showExplanation: false,
      score: 0,
      shuffledQuizzes: reshuffledQuizzes,
      shuffledOptions: reshuffledOptions,
      startTime: Date.now()
    });
    setCurrentAnswer(-1);
  };

  if (quizState.shuffledQuizzes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuiz = quizState.shuffledQuizzes[quizState.currentQuestionIndex];
  const currentShuffledOptions = quizState.shuffledOptions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / quizState.shuffledQuizzes.length) * 100;

  if (quizState.isCompleted) {
    const passed = quizState.score >= passingScore;
    const timeTaken = Math.floor((Date.now() - quizState.startTime) / 1000);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        {showConfetti && <Confetti />}
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8 text-center"
        >
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
          }`}>
            {passed ? (
              <TrophyIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
            ) : (
              <XCircleIcon className="w-12 h-12 text-red-600 dark:text-red-400" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {passed 
              ? `You've successfully completed the ${courseTitle} quiz!`
              : `You need ${passingScore} correct answers to pass. Try again!`
            }
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{quizState.score}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Correct</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round((quizState.score / quizState.shuffledQuizzes.length) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Score</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {formatTime(timeTaken)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Time</p>
            </div>
          </div>

          {passed ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center space-x-2">
                  <DocumentTextIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-900 dark:text-green-100">Certificate Issued!</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Your certificate will appear in your wallet transaction history
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
              >
                Continue Learning
              </motion.button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={restartQuiz}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
              >
                Close
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{courseTitle} Quiz</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
                <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className={`font-mono font-bold ${
                  quizState.timeRemaining < 30 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                }`}>
                  {formatTime(quizState.timeRemaining)}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {quizState.currentQuestionIndex + 1} of {quizState.shuffledQuizzes.length}
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quizState.currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 leading-relaxed">
              {currentQuiz.question}
            </h2>
            
            <div className="space-y-3 mb-6">
              {currentShuffledOptions.map((originalIndex, shuffledIndex) => {
                const option = currentQuiz.options[originalIndex];
                const isSelected = currentAnswer === shuffledIndex;
                const isCorrect = originalIndex === currentQuiz.correctAnswer;
                const shouldShowResult = quizState.showExplanation;
                
                let buttonClasses = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";
                
                if (shouldShowResult) {
                  if (isSelected && isCorrect) {
                    buttonClasses += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100";
                  } else if (isSelected && !isCorrect) {
                    buttonClasses += "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100";
                  } else if (isCorrect) {
                    buttonClasses += "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100";
                  } else {
                    buttonClasses += "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300";
                  }
                } else if (isSelected) {
                  buttonClasses += "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100";
                } else {
                  buttonClasses += "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200";
                }
                
                return (
                  <motion.button
                    key={shuffledIndex}
                    whileHover={{ scale: shouldShowResult ? 1 : 1.02 }}
                    whileTap={{ scale: shouldShowResult ? 1 : 0.98 }}
                    onClick={() => selectAnswer(shuffledIndex)}
                    className={buttonClasses}
                    disabled={shouldShowResult}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                        shouldShowResult && isCorrect
                          ? 'border-green-500 bg-green-500 text-white'
                          : shouldShowResult && isSelected && !isCorrect
                          ? 'border-red-500 bg-red-500 text-white'
                          : isSelected
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {shouldShowResult && isCorrect ? (
                          <CheckCircleIcon className="w-4 h-4" />
                        ) : shouldShowResult && isSelected && !isCorrect ? (
                          <XCircleIcon className="w-4 h-4" />
                        ) : (
                          String.fromCharCode(65 + shuffledIndex)
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {quizState.showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6"
                >
                  <div className="flex items-start space-x-3">
                    <LightBulbIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Explanation</h4>
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        {currentQuiz.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={previousQuestion}
                disabled={quizState.currentQuestionIndex === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  quizState.currentQuestionIndex === 0
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Previous</span>
              </motion.button>

              {!quizState.showExplanation ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={submitAnswer}
                  disabled={currentAnswer === -1}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-semibold transition-all ${
                    currentAnswer === -1
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                  }`}
                >
                  <span>Submit Answer</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextQuestion}
                  className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                >
                  <span>
                    {quizState.currentQuestionIndex === quizState.shuffledQuizzes.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </span>
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
