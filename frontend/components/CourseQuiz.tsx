import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../App";
import Certificate from "./Certificate";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface CourseQuizProps {
  course: any;
  onBack: () => void;
  onComplete: (score: number) => void;
}

export default function CourseQuiz({ course, onBack, onComplete }: CourseQuizProps) {
  const { theme } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);
  const [showCertificate, setShowCertificate] = useState(false);

  const courseQuestions = {
    1: [ // Blockchain Fundamentals
      {
        id: 1,
        question: "What is the main characteristic of blockchain technology?",
        options: ["Centralized control", "Immutable ledger", "High energy consumption", "Fast transactions"],
        correctAnswer: 1,
        explanation: "Blockchain's main characteristic is being an immutable ledger - once data is recorded, it cannot be altered."
      },
      {
        id: 2,
        question: "What does SHA-256 produce?",
        options: ["128-bit hash", "256-bit hash", "512-bit hash", "Variable-length hash"],
        correctAnswer: 1,
        explanation: "SHA-256 produces a 256-bit (32-byte) hash value, typically rendered as a 64-character hexadecimal string."
      },
      {
        id: 3,
        question: "Which consensus mechanism is used by Bitcoin?",
        options: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake", "Proof of Authority"],
        correctAnswer: 1,
        explanation: "Bitcoin uses Proof of Work (PoW) where miners compete to solve mathematical puzzles."
      },
      {
        id: 4,
        question: "What is the avalanche effect in cryptographic hashing?",
        options: ["Hash functions are slow", "Small input changes drastically change output", "Hashes are reversible", "Multiple inputs produce same output"],
        correctAnswer: 1,
        explanation: "The avalanche effect means that a small change in input causes a dramatic change in the hash output."
      },
      {
        id: 5,
        question: "What makes blockchain decentralized?",
        options: ["Government control", "No single point of control", "Centralized servers", "Single administrator"],
        correctAnswer: 1,
        explanation: "Blockchain is decentralized because there's no single point of control - it's distributed across many nodes."
      }
    ],
    2: [ // Smart Contract Development
      {
        id: 1,
        question: "What are smart contracts?",
        options: ["Legal documents", "Self-executing contracts with code", "Paper contracts", "Email agreements"],
        correctAnswer: 1,
        explanation: "Smart contracts are self-executing contracts with terms directly written into code that automatically execute when conditions are met."
      },
      {
        id: 2,
        question: "Which programming language is primarily used for Ethereum smart contracts?",
        options: ["JavaScript", "Python", "Solidity", "Java"],
        correctAnswer: 2,
        explanation: "Solidity is the primary programming language designed for writing smart contracts on Ethereum."
      },
      {
        id: 3,
        question: "What is the 'public' visibility modifier in Solidity?",
        options: ["Only contract owner can access", "Accessible from anywhere", "Only internal access", "No external access"],
        correctAnswer: 1,
        explanation: "The 'public' visibility modifier makes functions accessible from anywhere - internally and externally."
      },
      {
        id: 4,
        question: "What is gas in Ethereum?",
        options: ["A cryptocurrency", "Fuel for cars", "Computational fee", "Storage space"],
        correctAnswer: 2,
        explanation: "Gas is the computational fee required to execute operations on the Ethereum network."
      },
      {
        id: 5,
        question: "What does 'immutable' mean for smart contracts?",
        options: ["Can be easily changed", "Cannot be changed once deployed", "Only owner can change", "Changes require voting"],
        correctAnswer: 1,
        explanation: "Immutable means smart contracts cannot be changed once deployed to the blockchain."
      }
    ],
    3: [ // DeFi Protocols
      {
        id: 1,
        question: "What does DeFi stand for?",
        options: ["Digital Finance", "Decentralized Finance", "Distributed Finance", "Direct Finance"],
        correctAnswer: 1,
        explanation: "DeFi stands for Decentralized Finance - financial services built on blockchain without traditional intermediaries."
      },
      {
        id: 2,
        question: "What is an Automated Market Maker (AMM)?",
        options: ["A human trader", "Algorithm for pricing trades", "A trading bot", "A market regulator"],
        correctAnswer: 1,
        explanation: "An AMM is an algorithm that automatically prices trades based on mathematical formulas and liquidity pools."
      },
      {
        id: 3,
        question: "What is the constant product formula (x * y = k) used for?",
        options: ["Calculating interest", "AMM pricing mechanism", "Staking rewards", "Gas fees"],
        correctAnswer: 1,
        explanation: "The constant product formula (x * y = k) is used by AMMs like Uniswap to determine token prices in liquidity pools."
      },
      {
        id: 4,
        question: "What is impermanent loss?",
        options: ["Temporary network outage", "Risk faced by liquidity providers", "Smart contract bug", "Transaction failure"],
        correctAnswer: 1,
        explanation: "Impermanent loss is the risk faced by liquidity providers when token prices in a pool diverge from their initial ratio."
      },
      {
        id: 5,
        question: "What is yield farming?",
        options: ["Growing crops", "Mining cryptocurrency", "Moving funds to maximize returns", "Creating new tokens"],
        correctAnswer: 2,
        explanation: "Yield farming involves strategically moving funds between DeFi protocols to maximize returns through various reward mechanisms."
      }
    ],
    4: [ // NFT Marketplace
      {
        id: 1,
        question: "What does NFT stand for?",
        options: ["New Financial Token", "Non-Fungible Token", "Network File Transfer", "National Finance Technology"],
        correctAnswer: 1,
        explanation: "NFT stands for Non-Fungible Token - a unique digital asset that cannot be replicated or divided."
      },
      {
        id: 2,
        question: "What is the ERC-721 standard?",
        options: ["Fungible token standard", "NFT standard on Ethereum", "DeFi protocol", "Consensus mechanism"],
        correctAnswer: 1,
        explanation: "ERC-721 is the first and most common standard for NFTs on the Ethereum blockchain."
      },
      {
        id: 3,
        question: "What makes NFTs unique?",
        options: ["High price", "Each token has distinct properties", "Fast transactions", "Low fees"],
        correctAnswer: 1,
        explanation: "NFTs are unique because each token has distinct properties and cannot be interchanged with another token."
      },
      {
        id: 4,
        question: "Where is NFT metadata typically stored?",
        options: ["On blockchain only", "IPFS for decentralization", "Local computer", "Email servers"],
        correctAnswer: 1,
        explanation: "NFT metadata is typically stored on IPFS (InterPlanetary File System) for decentralized and permanent storage."
      },
      {
        id: 5,
        question: "What is the purpose of the tokenURI function in ERC-721?",
        options: ["Transfer tokens", "Return metadata URI", "Mint new tokens", "Burn tokens"],
        correctAnswer: 1,
        explanation: "The tokenURI function returns the URI pointing to the token's metadata, which contains information about the NFT."
      }
    ]
  };

  // Shuffle questions when component mounts or course changes
  useEffect(() => {
    const questions = courseQuestions[course.id as keyof typeof courseQuestions] || [];
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuizComplete(false);
    setShowResult(false);
    setSelectedAnswer(null);
  }, [course.id]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newAnswers);

    if (currentQuestion + 1 < shuffledQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz complete
      setQuizComplete(true);
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (answers: number[]) => {
    const correctCount = answers.reduce((count, answer, index) => {
      return count + (answer === shuffledQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctCount / shuffledQuestions.length) * 100);
    setShowResult(true);
    onComplete(score);
    
    // Show certificate if score is 80% or higher
    if (score >= 80) {
      setTimeout(() => {
        setShowCertificate(true);
      }, 2000); // Show certificate after 2 seconds
    }
  };

  const restartQuiz = () => {
    const shuffled = [...courseQuestions[course.id as keyof typeof courseQuestions]].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setQuizComplete(false);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (shuffledQuestions.length === 0) {
    return (
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">No quiz available for this course yet!</h2>
        <button onClick={onBack} className="text-blue-400 hover:text-blue-300">
          ← Back to Course
        </button>
      </div>
    );
  }

  if (showResult) {
    const correctCount = userAnswers.reduce((count, answer, index) => {
      return count + (answer === shuffledQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    const score = Math.round((correctCount / shuffledQuestions.length) * 100);
    const passed = score >= 80;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-8 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'}`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className={`text-8xl mb-6 ${passed ? '🎉' : '😔'}`}
          >
            {passed ? '🎉' : '😔'}
          </motion.div>
          
          <h2 className="text-4xl font-bold text-white mb-4">
            {passed ? 'Congratulations!' : 'Almost There!'}
          </h2>
          
          <div className="text-6xl font-bold mb-4">
            <span className={passed ? 'text-green-400' : 'text-yellow-400'}>
              {score}%
            </span>
          </div>
          
          <p className="text-xl text-gray-300 mb-6">
            You answered {correctCount} out of {shuffledQuestions.length} questions correctly.
          </p>
          
          {passed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 mb-6"
            >
              <h3 className="text-2xl font-bold text-green-400 mb-2">🏆 Course Completed!</h3>
              <p className="text-gray-300">
                You've earned <span className="text-yellow-400 font-bold">{course.xpReward} XP</span> and a certificate!
              </p>
            </motion.div>
          )}
          
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartQuiz}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold"
            >
              Retake Quiz
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-6 py-3 rounded-full font-semibold"
            >
              Back to Course
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQ = shuffledQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-white hover:text-yellow-400 transition-colors">
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {course.thumbnail} {course.title} Quiz
            </h1>
            <p className="text-gray-300">Test your knowledge</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-semibold">
            Question {currentQuestion + 1} of {shuffledQuestions.length}
          </div>
          <div className="text-gray-400 text-sm">
            {Math.round(progress)}% Complete
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700/50 rounded-full h-2 mb-8">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-8 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'}`}
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-4 mb-8">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                  selectedAnswer === index
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : theme === 'dark'
                    ? 'bg-gray-700/30 hover:bg-gray-600/50 text-gray-200'
                    : 'bg-white/10 hover:bg-white/20 text-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? 'border-white bg-white text-blue-600'
                      : 'border-gray-400'
                  }`}>
                    {selectedAnswer === index && '✓'}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                selectedAnswer === null
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg'
              }`}
            >
              {currentQuestion + 1 === shuffledQuestions.length ? 'Finish Quiz' : 'Next Question'} →
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Certificate Modal */}
      {showCertificate && (
        <Certificate
          course={course}
          score={Math.round((userAnswers.reduce((count, answer, index) => {
            return count + (answer === shuffledQuestions[index].correctAnswer ? 1 : 0);
          }, 0) / shuffledQuestions.length) * 100)}
          completionDate={new Date()}
          studentName="Crypto Learner"
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
