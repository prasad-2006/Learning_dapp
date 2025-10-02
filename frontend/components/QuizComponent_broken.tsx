import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
    description: "Test your knowledge of basic blockchain concepts",
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
          "The inability to change recorded data",
          "The speed of transactions",
          "The cost of transactions"
        ],
        correctAnswer: "The inability to change recorded data",
        explanation: "Immutability refers to the characteristic of blockchain where once data is recorded in a block and confirmed by the network, it becomes extremely difficult or impossible to change.",
        points: 25
      },
      {
        id: 4,
        question: "What is a hash function in blockchain?",
        options: [
          "A function that encrypts private keys",
          "A function that creates digital signatures",
          "A function that converts input data into a fixed-size string",
          "A function that mines new coins"
        ],
        correctAnswer: "A function that converts input data into a fixed-size string",
        explanation: "A hash function takes input data of any size and produces a fixed-size string (hash). In blockchain, it's used for data integrity, linking blocks, and in mining processes.",
        points: 25
      }
    ]
  },
  {
    id: 2,
    title: "Smart Contract Development",
    description: "Advanced concepts in smart contract programming",
    category: "Development",
    difficulty: "Advanced",
    timeLimit: 20,
    totalPoints: 120,
    xpReward: 75,
    badge: "💻",
    icon: "📝",
    questions: [
      {
        id: 1,
        question: "What is gas in Ethereum?",
        options: [
          "A cryptocurrency",
          "A unit of computational effort",
          "A mining reward",
          "A wallet address"
        ],
        correctAnswer: "A unit of computational effort",
        explanation: "Gas is a unit that measures the amount of computational effort required to execute operations on the Ethereum network.",
        points: 30
      },
      {
        id: 2,
        question: "Which keyword is used to declare state variables in Solidity?",
        options: [
          "var",
          "let",
          "uint, string, bool, etc.",
          "const"
        ],
        correctAnswer: "uint, string, bool, etc.",
        explanation: "In Solidity, state variables are declared using specific type keywords like uint256, string, bool, address, etc.",
        points: 30
      },
      {
        id: 3,
        question: "What is a modifier in Solidity?",
        options: [
          "A function parameter",
          "A reusable piece of code that can change function behavior",
          "A variable type",
          "A compiler directive"
        ],
        correctAnswer: "A reusable piece of code that can change function behavior",
        explanation: "Modifiers in Solidity are used to change the behavior of functions in a declarative way, commonly used for access control and input validation.",
        points: 30
      },
      {
        id: 4,
        question: "What happens when a smart contract function reverts?",
        options: [
          "The function continues execution",
          "All state changes are undone and gas is refunded",
          "All state changes are undone but gas is consumed",
          "Only the current operation is cancelled"
        ],
        correctAnswer: "All state changes are undone but gas is consumed",
        explanation: "When a function reverts, all state changes within that transaction are undone, but the gas consumed up to the revert point is not refunded.",
        points: 30
      }
    ]
  },
  {
    id: 3,
    title: "DeFi Protocols",
    description: "Understanding decentralized finance mechanisms",
    category: "DeFi",
    difficulty: "Intermediate",
    timeLimit: 18,
    totalPoints: 100,
    xpReward: 60,
    badge: "💰",
    icon: "🏦",
    questions: [
      {
        id: 1,
        question: "What is an AMM in DeFi?",
        options: [
          "Automated Market Maker",
          "Advanced Money Manager",
          "Anonymous Market Mechanism",
          "Algorithmic Mining Method"
        ],
        correctAnswer: "Automated Market Maker",
        explanation: "AMM (Automated Market Maker) is a protocol that uses mathematical formulas to price assets and enable trading without traditional order books.",
        points: 25
      },
      {
        id: 2,
        question: "What is impermanent loss?",
        options: [
          "Permanent loss of funds",
          "Temporary decrease in token value when providing liquidity",
          "Gas fees for transactions",
          "Loss due to smart contract bugs"
        ],
        correctAnswer: "Temporary decrease in token value when providing liquidity",
        explanation: "Impermanent loss occurs when the price ratio of tokens in a liquidity pool changes compared to when they were deposited, resulting in less value than simply holding the tokens.",
        points: 25
      },
      {
        id: 3,
        question: "What is yield farming?",
        options: [
          "Mining cryptocurrencies",
          "Lending money to earn interest",
          "Providing liquidity to earn rewards",
          "Trading cryptocurrencies"
        ],
        correctAnswer: "Providing liquidity to earn rewards",
        explanation: "Yield farming involves providing liquidity to DeFi protocols in exchange for rewards, typically in the form of additional tokens or fees.",
        points: 25
      },
      {
        id: 4,
        question: "What is a flash loan?",
        options: [
          "A very fast regular loan",
          "A loan that must be borrowed and repaid in the same transaction",
          "A loan with very low interest rates",
          "A loan without collateral requirements"
        ],
        correctAnswer: "A loan that must be borrowed and repaid in the same transaction",
        explanation: "A flash loan allows borrowing assets without collateral, but the loan must be borrowed and repaid within the same blockchain transaction.",
        points: 25
      }
    ]
  },
  {
    id: 4,
    title: "Web3 Development",
    description: "Building decentralized applications",
    category: "Development",
    difficulty: "Expert",
    timeLimit: 25,
    totalPoints: 140,
    xpReward: 100,
    badge: "🚀",
    icon: "🌐",
    questions: [
      {
        id: 1,
        question: "What is Web3.js?",
        options: [
          "A blockchain itself",
          "A JavaScript library for interacting with Ethereum",
          "A smart contract language",
          "A cryptocurrency wallet"
        ],
        correctAnswer: "A JavaScript library for interacting with Ethereum",
        explanation: "Web3.js is a collection of libraries that allow you to interact with a local or remote Ethereum node using HTTP, IPC or WebSocket.",
        points: 35
      },
      {
        id: 2,
        question: "What is IPFS?",
        options: [
          "Internet Protocol File System",
          "InterPlanetary File System",
          "Internal Private File Storage",
          "Integrated Public File Server"
        ],
        correctAnswer: "InterPlanetary File System",
        explanation: "IPFS (InterPlanetary File System) is a protocol designed to create a content-addressable, peer-to-peer method of storing and sharing hypermedia.",
        points: 35
      },
      {
        id: 3,
        question: "What is the purpose of ABI in Ethereum?",
        options: [
          "To store smart contract code",
          "To define how to interact with smart contract functions",
          "To execute transactions",
          "To mine new blocks"
        ],
        correctAnswer: "To define how to interact with smart contract functions",
        explanation: "ABI (Application Binary Interface) describes the methods and structures used to interact with smart contracts, acting as an interface between your application and the contract.",
        points: 35
      },
      {
        id: 4,
        question: "What is a dApp?",
        options: [
          "A mobile application",
          "A decentralized application running on blockchain",
          "A desktop application",
          "A web browser"
        ],
        correctAnswer: "A decentralized application running on blockchain",
        explanation: "A dApp (decentralized application) is an application that runs on a decentralized network, typically using smart contracts on a blockchain platform.",
        points: 35
      }
    ]
  }
];

export default function QuizComponent() {
  // Wallet integration
  const { account, connected, signAndSubmitTransaction } = useWallet();
  
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Blockchain states
  const [isSubmittingToBlockchain, setIsSubmittingToBlockchain] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  
  // Certificate states
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState<{
    courseName: string;
    userName: string;
    date: Date;
    completionId: string;
    score: number;
  } | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, timeLeft, showResults]);

  const startQuiz = (quiz: Quiz) => {
    // Randomize quiz questions and options
    const randomizedQuiz = randomizeQuiz(quiz);
    
    setCurrentQuiz(randomizedQuiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
    setQuizStarted(true);
    setTimeLeft(randomizedQuiz.timeLimit * 60); // Convert minutes to seconds
    
    // Reset certificate states
    setShowNameDialog(false);
    setShowCertificate(false);
    setCertificateData(null);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResults) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (!currentQuiz) return;
    
    const currentAnswer = selectedAnswers[currentQuestionIndex];
    const correctAnswer = currentQuiz.questions[currentQuestionIndex].correctAnswer;
    
    if (currentAnswer === correctAnswer) {
      setScore(prev => prev + currentQuiz.questions[currentQuestionIndex].points);
    }

    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    if (!currentQuiz) return;
    
    setShowResults(true);
    setQuizStarted(false);
    
    // Check if user achieved perfect score (100%)
    const totalQuestions = currentQuiz.questions.length;
    const correctAnswers = Object.keys(selectedAnswers).filter(key =>
      selectedAnswers[parseInt(key)] === currentQuiz.questions[parseInt(key)].correctAnswer
    ).length;
    
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    if (percentage === 100) {
      // Show name dialog for certificate
      setShowNameDialog(true);
    }
  };

  const handleCertificateNameSubmit = async (name: string) => {
    if (!currentQuiz) return;
    
    const certificateId = `CERT-${Date.now()}`;
    const certData = {
      courseName: currentQuiz.title,
      userName: name,
      date: new Date(),
      completionId: certificateId,
      score: score
    };
    
    // Save certificate to localStorage first
    const existingCertificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    existingCertificates.push(certData);
    localStorage.setItem('certificates', JSON.stringify(existingCertificates));
    
    // Update learning streak and date
    const today = new Date().toDateString();
    const lastLearningDate = localStorage.getItem('lastLearningDate');
    let currentStreak = parseInt(localStorage.getItem('streakDays') || '0');
    
    if (lastLearningDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLearningDate === yesterday.toDateString()) {
        currentStreak += 1;
      } else if (lastLearningDate !== today) {
        currentStreak = 1; // Reset streak if more than 1 day gap
      }
      
      localStorage.setItem('streakDays', currentStreak.toString());
      localStorage.setItem('lastLearningDate', today);
    }
    
    // Submit to blockchain if wallet is connected and score is perfect
    if (connected && account && signAndSubmitTransaction && score === currentQuiz.totalPoints) {
      setIsSubmittingToBlockchain(true);
      
      try {
        console.log("Starting blockchain submission...");
        console.log("Connected:", connected);
        console.log("Account:", account);
        console.log("Account address:", account?.address?.toString());
        console.log("signAndSubmitTransaction available:", !!signAndSubmitTransaction);
        console.log("signAndSubmitTransaction type:", typeof signAndSubmitTransaction);
        console.log("Score check:", score, "===", currentQuiz.totalPoints, "->", score === currentQuiz.totalPoints);
        
        // Double-check that we have all necessary components
        if (!account?.address) {
          throw new Error("Wallet account address not available");
        }
        
        if (!signAndSubmitTransaction) {
          throw new Error("signAndSubmitTransaction function not available from wallet");
        }
        
        // Check APT balance first
        const balanceInfo = await checkAPTBalance(account.address.toString());
        
        if (!balanceInfo.hasEnoughForTransaction) {
          throw new Error(`Insufficient APT balance. You have ${balanceInfo.formattedBalance} APT. Please get test tokens from the faucet.`);
        }

        console.log(`User has sufficient balance: ${balanceInfo.formattedBalance} APT`);
        console.log("About to call submitQuizCompletion...");

        // Show user notification about upcoming wallet approval
        toast({
          title: "🔗 Recording on Blockchain...",
          description: "Please approve the transaction in your Petra wallet popup",
          duration: 5000,
        });

        const txHash = await submitQuizCompletion(account, signAndSubmitTransaction, {
          quizName: currentQuiz.title,
          score: score,
          maxScore: currentQuiz.totalPoints,
          certificateId: certificateId,
        });

        console.log("Transaction successful, hash:", txHash);
        
        setTransactionHash(txHash);
        
                toast({
          title: "🎉 Blockchain Success!",
          description: (
            <div className="space-y-2">
              <p>✅ Quiz completion recorded on Aptos blockchain!</p>
              <p className="text-sm text-green-300">💰 Transaction visible in Petra wallet</p>
              <p className="text-sm">Hash: {formatTransactionHash(txHash)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(getExplorerUrl(txHash), '_blank')}
                  className="text-blue-400 hover:text-blue-300 underline text-sm"
                >
                  View on Aptos Explorer
                </button>
              </div>
              <p className="text-xs text-gray-400">Check your Petra wallet transaction history!</p>
            </div>
          ),
          duration: 15000,
        });
      } catch (error: any) {
        console.error("Blockchain submission failed:", error);
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          name: error.name,
          stack: error.stack,
          cause: error.cause
        });
        
        let errorMessage = "Failed to record on blockchain, but certificate was saved locally.";
        let showFaucet = false;
        
        if (error instanceof Error) {
          if (error.message.includes("rejected") || error.message.includes("User rejected")) {
            errorMessage = "Transaction was rejected. Certificate saved locally.";
          } else if (error.message.includes("insufficient") || error.message.includes("Insufficient")) {
            errorMessage = error.message;
            showFaucet = true;
          } else if ((error as any).code === 4001) {
            errorMessage = "Transaction was cancelled in wallet. Certificate saved locally.";
          } else if (error.message) {
            errorMessage = `Blockchain error: ${error.message}. Certificate saved locally.`;
          }
        }
        
        toast({
          variant: "destructive",
          title: "❌ Blockchain Error",
          description: (
            <div className="space-y-2">
              <p>{errorMessage}</p>
              {showFaucet && (
                <button
                  onClick={() => window.open(getFaucetUrl(), '_blank')}
                  className="text-blue-400 hover:text-blue-300 underline text-sm"
                >
                  🚰 Get Test APT Tokens
                </button>
              )}
              <p className="text-xs">Make sure you have APT in your wallet and approve the transaction.</p>
            </div>
          ),
          duration: 10000,
        });
      } finally {
        setIsSubmittingToBlockchain(false);
      }
    }
    
    setCertificateData(certData);
    setShowNameDialog(false);
    setShowCertificate(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(0);
    setShowResults(false);
    setQuizStarted(false);
    setTimeLeft(0);
    
    // Reset certificate states
    setShowNameDialog(false);
    setShowCertificate(false);
    setCertificateData(null);
  };

  // Show certificate if it's being displayed
  if (showCertificate && certificateData) {
    return (
      <div>
        <Certificate
          course={certificateData.courseName}
          score={certificateData.score}
          completionDate={certificateData.date}
          studentName={certificateData.userName}
          onClose={() => setShowCertificate(false)}
        />
      </div>
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        {percentage >= 90 && <Confetti recycle={false} numberOfPieces={200} />}
        
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
              <CardHeader>
                <div className="text-6xl mb-4">
                  {percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}
                </div>
                <CardTitle className="text-3xl">
                  Quiz Complete!
                </CardTitle>
                <p className="text-gray-400">
                  {currentQuiz.title} - {currentQuiz.difficulty}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">{percentage}%</div>
                    <div className="text-sm text-gray-300">Score</div>
                  </div>
                  <div className="text-center bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-400">{correctAnswers}/{currentQuiz.questions.length}</div>
                    <div className="text-sm text-gray-300">Correct</div>
                  </div>
                  <div className="text-center bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-400">{score}</div>
                    <div className="text-sm text-gray-300">Points</div>
                  </div>
                  <div className="text-center bg-gray-700 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-400">{currentQuiz.xpReward}</div>
                    <div className="text-sm text-gray-300">XP Earned</div>
                  </div>
                </div>

                {percentage === 100 && (
                  <div className="text-center bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg p-4 space-y-2">
                    <div className="text-2xl mb-2">🎉 Perfect Score! 🎉</div>
                    <div className="text-sm">You've earned a certificate!</div>
                    
                    {/* Blockchain status */}
                    {connected && account && (
                      <div className="mt-3 p-3 bg-black/20 rounded-lg">
                        {isSubmittingToBlockchain ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span className="text-sm">Recording on Aptos blockchain...</span>
                          </div>
                        ) : transactionHash ? (
                          <div className="space-y-1">
                            <div className="text-sm text-green-300">✅ Recorded on blockchain!</div>
                            <div className="text-xs text-green-200">
                              💰 Visible in Petra wallet history
                            </div>
                            <div className="text-xs">
                              Tx: {formatTransactionHash(transactionHash)}
                            </div>
                            <button
                              onClick={() => window.open(getExplorerUrl(transactionHash), '_blank')}
                              className="text-blue-300 hover:text-blue-200 underline text-xs"
                            >
                              View on Aptos Explorer
                            </button>
                          </div>
                        ) : (
                          <div className="text-sm">
                            🔗 Will create Aptos transaction when you generate certificate
                          </div>
                        )}
                      </div>
                    )}
                    
                    {!connected && (
                      <div className="mt-3 p-3 bg-black/20 rounded-lg text-sm space-y-2">
                        <p>💡 Connect Petra wallet to create real Aptos transactions</p>
                        <p className="text-xs text-gray-400">
                          You'll need test APT tokens from the faucet for transactions
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Back to Quizzes
                  </Button>
                  <Button
                    onClick={() => startQuiz(currentQuiz)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Try Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Certificate Name Dialog - only render if needed */}
        {showNameDialog && currentQuiz && (
          <CertificateNameDialog
            course={currentQuiz}
            score={score}
            onSubmit={handleCertificateNameSubmit}
            onCancel={() => setShowNameDialog(false)}
          />
        )}
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
          {/* Header */}
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

          {/* Progress */}
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

        {/* Question */}
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

                <div className="flex justify-between pt-6">
                  <Button
                    onClick={resetQuiz}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    Exit Quiz
                  </Button>
          </Card>
        </motion.div>

        {/* Certificate Name Dialog - only render if needed */}
        {showNameDialog && currentQuiz && (
          <CertificateNameDialog
            course={currentQuiz}
            score={score}
            onSubmit={handleCertificateNameSubmit}
            onCancel={() => setShowNameDialog(false)}
          />
        )}
      </div>
    );
  }

  return null;
}
