import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "@/components/ui/use-toast";
import Confetti from 'react-confetti';
import Certificate from './Certificate';
import CertificateNameDialog from './CertificateNameDialog';
import { submitQuizCompletion, formatTransactionHash, getExplorerUrl } from "@/utils/quizBlockchain";
import { checkAPTBalance, getFaucetUrl } from "@/utils/balanceCheck";

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to randomize quiz questions and options
const randomizeQuiz = (quiz: Quiz): Quiz => {
  return {
    ...quiz,
    questions: shuffleArray(quiz.questions).map(question => ({
      ...question,
      options: shuffleArray(question.options)
    }))
  };
};

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  questions: Question[];
  timeLimit: number; // in minutes
  totalPoints: number;
  xpReward: number;
  badge?: string;
  icon: string;
}

const quizzes: Quiz[] = [
  {
    id: 1,
    title: "Blockchain Fundamentals",
    description: "Master the basic concepts of blockchain technology",
    category: "Blockchain",
    difficulty: "Beginner",
    timeLimit: 15,
    totalPoints: 100,
    xpReward: 50,
    badge: "🏆",
    icon: "⛓️",
    questions: [
      {
        id: 1,
        question: "What is a blockchain?",
        options: [
          "A centralized database",
          "A distributed ledger technology",
          "A cryptocurrency",
          "A mining algorithm"
        ],
        correctAnswer: "A distributed ledger technology",
        explanation: "A blockchain is a distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography.",
        points: 25
      },
      {
        id: 2,
        question: "Which consensus mechanism does Bitcoin use?",
        options: [
          "Proof of Stake",
          "Proof of Work",
          "Delegated Proof of Stake",
          "Proof of Authority"
        ],
        correctAnswer: "Proof of Work",
        explanation: "Bitcoin uses Proof of Work (PoW) consensus mechanism where miners compete to solve cryptographic puzzles to validate transactions and create new blocks.",
        points: 25
      },
      {
        id: 3,
        question: "What is immutability in blockchain?",
        options: [
          "The ability to change any transaction",
          "The inability to alter recorded data",
          "A consensus algorithm",
          "A type of cryptocurrency"
        ],
        correctAnswer: "The inability to alter recorded data",
        explanation: "Immutability means that once data is recorded on the blockchain, it cannot be changed or deleted, ensuring data integrity and security.",
        points: 25
      },
      {
        id: 4,
        question: "What is a smart contract?",
        options: [
          "A legal document",
          "Self-executing code on blockchain",
          "A trading algorithm",
          "A wallet application"
        ],
        correctAnswer: "Self-executing code on blockchain",
        explanation: "Smart contracts are self-executing contracts with the terms of the agreement directly written into code, stored and replicated on blockchain networks.",
        points: 25
      }
    ]
  },
  {
    id: 2,
    title: "Cryptocurrency Basics",
    description: "Essential knowledge about digital currencies and wallets",
    category: "Cryptocurrency",
    difficulty: "Beginner",
    timeLimit: 12,
    totalPoints: 75,
    xpReward: 40,
    badge: "💰",
    icon: "💎",
    questions: [
      {
        id: 1,
        question: "What is cryptocurrency?",
        options: [
          "Physical coins",
          "Digital or virtual currency secured by cryptography",
          "Bank notes",
          "Credit cards"
        ],
        correctAnswer: "Digital or virtual currency secured by cryptography",
        explanation: "Cryptocurrency is a digital or virtual currency that is secured by cryptography, making it nearly impossible to counterfeit or double-spend.",
        points: 25
      },
      {
        id: 2,
        question: "What is a private key?",
        options: [
          "A public address",
          "A secret code that controls cryptocurrency",
          "A wallet name",
          "A transaction ID"
        ],
        correctAnswer: "A secret code that controls cryptocurrency",
        explanation: "A private key is a secret alphanumeric code that allows you to access and control your cryptocurrency. It should never be shared with anyone.",
        points: 25
      },
      {
        id: 3,
        question: "What does 'HODL' mean in cryptocurrency?",
        options: [
          "Hold On for Dear Life",
          "High Order Digital Ledger",
          "Hash Output Data Link",
          "Hybrid Online Digital Logic"
        ],
        correctAnswer: "Hold On for Dear Life",
        explanation: "HODL originally came from a misspelled 'hold' but is now commonly understood as 'Hold On for Dear Life' - a strategy of holding cryptocurrency long-term.",
        points: 25
      }
    ]
  },
  {
    id: 3,
    title: "Aptos Ecosystem",
    description: "Deep dive into Aptos blockchain and Move programming",
    category: "Aptos",
    difficulty: "Intermediate",
    timeLimit: 20,
    totalPoints: 150,
    xpReward: 75,
    badge: "🚀",
    icon: "🌟",
    questions: [
      {
        id: 1,
        question: "What programming language is used for Aptos smart contracts?",
        options: [
          "Solidity",
          "Move",
          "Rust",
          "JavaScript"
        ],
        correctAnswer: "Move",
        explanation: "Move is a resource-oriented programming language designed for safe and flexible asset management, originally developed by Facebook for Diem and adopted by Aptos.",
        points: 30
      },
      {
        id: 2,
        question: "What consensus mechanism does Aptos use?",
        options: [
          "Proof of Work",
          "Proof of Stake",
          "AptosBFT",
          "Delegated Proof of Stake"
        ],
        correctAnswer: "AptosBFT",
        explanation: "Aptos uses AptosBFT, a Byzantine Fault Tolerant consensus protocol that provides high throughput and low latency for transaction processing.",
        points: 30
      },
      {
        id: 3,
        question: "What is the native token of Aptos?",
        options: [
          "ETH",
          "APT",
          "MOVE",
          "BTC"
        ],
        correctAnswer: "APT",
        explanation: "APT is the native token of the Aptos blockchain, used for transaction fees, staking, and governance.",
        points: 30
      },
      {
        id: 4,
        question: "What is a key feature of Move language?",
        options: [
          "Resource safety",
          "High gas fees",
          "Slow execution",
          "Limited functionality"
        ],
        correctAnswer: "Resource safety",
        explanation: "Move provides resource safety by design, ensuring that digital assets cannot be duplicated or accidentally destroyed, making it ideal for blockchain applications.",
        points: 30
      },
      {
        id: 5,
        question: "What is Aptos' approach to parallel execution?",
        options: [
          "Sequential only",
          "Block STM",
          "Single threaded",
          "No parallelization"
        ],
        correctAnswer: "Block STM",
        explanation: "Aptos uses Block-STM (Software Transactional Memory) to enable parallel execution of transactions, significantly improving throughput and performance.",
        points: 30
      }
    ]
  }
];

export default function QuizComponent() {
  const { account, signAndSubmitTransaction, connected } = useWallet();
  
  // Quiz state
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Certificate states
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  
  // Transaction states
  const [isSubmittingToBlockchain, setIsSubmittingToBlockchain] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quizStarted && timeLeft > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - auto submit
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [quizStarted, timeLeft, showResults]);

  const handleTimeUp = () => {
    if (currentQuiz) {
      let finalScore = 0;
      currentQuiz.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswer) {
          finalScore += question.points;
        }
      });
      setScore(finalScore);
      setShowResults(true);
      setQuizStarted(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    const randomizedQuiz = randomizeQuiz(quiz);
    setCurrentQuiz(randomizedQuiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
    setQuizStarted(true);
    setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    setShowCertificate(false);
    setCertificateData(null);
    setShowNameDialog(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate final score
      let finalScore = 0;
      currentQuiz!.questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswer) {
          finalScore += question.points;
        }
      });
      setScore(finalScore);
      setShowResults(true);
      setQuizStarted(false);
    }
  };

  const handleCertificateNameSubmit = async (name: string) => {
    if (!currentQuiz || !account?.address) return;

    const percentage = Math.round((score / currentQuiz.totalPoints) * 100);
    
    if (percentage >= 90) {
      try {
        setIsSubmittingToBlockchain(true);

        // Check APT balance before submitting
        const hasBalance = await checkAPTBalance(account.address.toString());
        if (!hasBalance) {
          toast({
            title: "⚠️ Insufficient APT Balance",
            description: (
              <div className="space-y-2">
                <p>You need APT tokens to submit quiz completion to blockchain.</p>
                <a 
                  href={getFaucetUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Get free APT from faucet →
                </a>
              </div>
            ),
            duration: 8000,
          });
          setIsSubmittingToBlockchain(false);
          return;
        }

        // Submit to blockchain
        const quizTransaction = {
          quizName: currentQuiz.title,
          score: score,
          maxScore: currentQuiz.totalPoints,
          certificateId: `cert_${currentQuiz.id}_${Date.now()}`
        };
        
        const txHash = await submitQuizCompletion(
          account,
          signAndSubmitTransaction,
          quizTransaction
        );
        
        setTransactionHash(txHash);

        // Update user progress in localStorage
        const progress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        progress.totalXP = (progress.totalXP || 0) + currentQuiz.xpReward;
        progress.quizzesCompleted = (progress.quizzesCompleted || 0) + 1;
        progress.currentStreak = (progress.currentStreak || 0) + 1;
        progress.longestStreak = Math.max(progress.longestStreak || 0, progress.currentStreak);
        progress.lastActivity = new Date().toISOString();
        localStorage.setItem('userProgress', JSON.stringify(progress));

        // Show success message with blockchain transaction details
        toast({
          title: "🎉 Quiz Completed Successfully!",
          description: (
            <div className="space-y-2">
              <p>Perfect score! Your achievement is now recorded on Aptos blockchain.</p>
              <p className="text-sm text-gray-400">
                Transaction: <span className="font-mono">{formatTransactionHash(txHash)}</span>
              </p>
              <a 
                href={getExplorerUrl(txHash)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline text-sm"
              >
                View on Aptos Explorer →
              </a>
            </div>
          ),
          duration: 10000,
        });
      } catch (error) {
        console.error('Blockchain submission failed:', error);
        toast({
          title: "⚠️ Blockchain Submission Failed",
          description: "Your certificate will be saved locally. You can try blockchain submission again later.",
          variant: "destructive",
        });
      } finally {
        setIsSubmittingToBlockchain(false);
      }
    }

    // Save certificate to localStorage (always, regardless of blockchain success)
    const certificate = {
      id: Date.now().toString(),
      courseName: currentQuiz.title,
      score: percentage,
      date: new Date(),
      userName: name,
      transactionHash: transactionHash || undefined
    };

    const existingCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    existingCertificates.push(certificate);
    localStorage.setItem('certificates', JSON.stringify(existingCertificates));

    // Update certificate data and show certificate
    // Make sure to update state in the correct order
    setShowNameDialog(false);
    setCertificateData(certificate);
    // Small delay to ensure state updates are processed
    setTimeout(() => {
      setShowCertificate(true);
    }, 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
    setQuizStarted(false);
    setTimeLeft(0);
    setShowNameDialog(false);
    setShowCertificate(false);
    setCertificateData(null);
  };

  // Show certificate if it's being displayed
  if (showCertificate && certificateData) {
    return (
      <Certificate
        course={certificateData.courseName}
        score={certificateData.score}
        completionDate={certificateData.date}
        studentName={certificateData.userName}
        onClose={() => setShowCertificate(false)}
      />
    );
  }

  // Show certificate name dialog
  if (showNameDialog && currentQuiz) {
    return (
      <CertificateNameDialog
        course={currentQuiz}
        score={score}
        onSubmit={handleCertificateNameSubmit}
        onCancel={() => setShowNameDialog(false)}
      />
    );
  }

  // Quiz selection screen
  if (!currentQuiz) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-lg">
            <span className="text-3xl">🧠</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Quiz Arena
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Test your blockchain knowledge and earn certificates for perfect scores!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-blue-400/50 transition-all duration-300 shadow-xl hover:shadow-blue-500/25 h-full group cursor-pointer">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{quiz.icon}</span>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      quiz.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                      quiz.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {quiz.difficulty}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {quiz.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm mb-6 flex-grow">
                    {quiz.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Questions</span>
                      <span className="text-white font-medium">{quiz.questions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Time Limit</span>
                      <span className="text-white font-medium">{quiz.timeLimit} min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">XP Reward</span>
                      <span className="text-yellow-400 font-medium">{quiz.xpReward} XP</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => startQuiz(quiz)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base font-semibold"
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults && currentQuiz) {
    const percentage = Math.round((score / currentQuiz.totalPoints) * 100);
    const correctAnswers = Object.keys(selectedAnswers).filter(key =>
      selectedAnswers[parseInt(key)] === currentQuiz.questions[parseInt(key)].correctAnswer
    ).length;

    return (
      <div className="space-y-8">
        {percentage >= 90 && <Confetti recycle={false} numberOfPieces={200} />}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="text-8xl mb-6">
                {percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">
                Quiz Complete!
              </h2>
              
              <p className="text-gray-300 mb-8">
                {currentQuiz.title} - {currentQuiz.difficulty}
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center bg-white/5 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-green-400 mb-2">{percentage}%</div>
                  <div className="text-sm text-gray-300">Score</div>
                </div>
                <div className="text-center bg-white/5 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-blue-400 mb-2">{correctAnswers}/{currentQuiz.questions.length}</div>
                  <div className="text-sm text-gray-300">Correct</div>
                </div>
                <div className="text-center bg-white/5 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">{score}</div>
                  <div className="text-sm text-gray-300">Points</div>
                </div>
              </div>

              {percentage >= 90 && (
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-3xl mr-3">🎓</span>
                    <h3 className="text-xl font-bold text-green-400">Perfect Score!</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Congratulations! You've earned a certificate and blockchain record.
                  </p>
                  {connected ? (
                    <Button
                      onClick={() => setShowNameDialog(true)}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3"
                      disabled={isSubmittingToBlockchain}
                    >
                      {isSubmittingToBlockchain ? 'Processing...' : 'Get Certificate'}
                    </Button>
                  ) : (
                    <p className="text-yellow-400 text-sm">
                      Connect your wallet to get a blockchain-verified certificate!
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="border-white/20 text-gray-300 hover:bg-white/5 hover:text-white px-8 py-3"
                >
                  Back to Quizzes
                </Button>
                <Button
                  onClick={() => startQuiz(currentQuiz)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Quiz interface
  if (currentQuiz) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{currentQuiz.title}</h1>
              <p className="text-gray-300">Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-400">{formatTime(timeLeft)}</div>
              <p className="text-sm text-gray-300">Time Remaining</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                {currentQuestion.question}
              </h2>
              
              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => handleAnswerSelect(option)}
                      variant="outline"
                      className={`w-full text-left justify-start p-6 h-auto text-lg border-2 transition-all duration-300 ${
                        selectedAnswers[currentQuestionIndex] === option
                          ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 border-blue-400 text-white shadow-lg shadow-blue-500/25"
                          : "border-white/20 text-white hover:bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-semibold mr-4">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="border-white/20 text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  Exit Quiz
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!selectedAnswers[currentQuestionIndex]}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
}
