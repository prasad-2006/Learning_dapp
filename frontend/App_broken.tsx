import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CourseList from "./components/CourseList";
import CourseQuiz from "./components/CourseQuiz";
import QuizComponent from "./components/QuizComponent";
import Theory from "./components/Theory";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import BadgeCollection from "./components/BadgeCollection";
import Certificates from "./components/Certificates";

// Theme Context
const ThemeContext = createContext<{
  theme: string;
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {}
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


  {
    id: 1,
    title: "Blockchain Fundamentals",
    description: "Learn the basics of blockchain technology, cryptocurrencies, and decentralized systems.",
    level: "Beginner",
    duration: "2-3 hours",
    xpReward: 500,
    image: "🔗",
    theory: {
      chapters: [
        {
          id: 1,
          title: "What is Blockchain?",
          content: `Blockchain is a revolutionary technology that serves as a distributed ledger, maintaining a continuously growing list of records, called blocks, which are linked and secured using cryptography.

Key Features:
• Decentralization: No single point of control
• Immutability: Data cannot be altered once recorded
• Transparency: All transactions are visible to network participants
• Security: Cryptographic hashing ensures data integrity

A blockchain consists of a chain of blocks, where each block contains:
1. Block Header: Contains metadata about the block
2. Merkle Root: A hash of all transactions in the block
3. Previous Block Hash: Links to the previous block
4. Timestamp: When the block was created
5. Nonce: A number used in the proof-of-work consensus

The decentralized nature means that instead of relying on a central authority like a bank, the network of computers (nodes) collectively maintains the ledger.`,
          readingTime: "5 min"
        },
        {
          id: 2,
          title: "How Blockchain Works",
          content: `Understanding the blockchain process:

Transaction Process:
1. Transaction Initiation: A user initiates a transaction
2. Digital Signature: Transaction is signed with user's private key
3. Broadcasting: Transaction is broadcast to the network
4. Validation: Network nodes validate the transaction
5. Block Creation: Valid transactions are grouped into a block
6. Consensus: Network reaches consensus on the new block
7. Block Addition: The new block is added to the chain
8. Confirmation: Transaction is confirmed and immutable

Consensus Mechanisms:
• Proof of Work (PoW): Miners compete to solve cryptographic puzzles
• Proof of Stake (PoS): Validators are chosen based on their stake
• Delegated Proof of Stake (DPoS): Token holders vote for delegates

The cryptographic hash function ensures that any change to a block would require changing all subsequent blocks, making the blockchain tamper-evident.`,
          readingTime: "7 min"
        },
        {
          id: 3,
          title: "Types of Blockchain Networks",
          content: `Blockchain networks can be categorized into different types:

1. Public Blockchains:
• Open to everyone
• Fully decentralized
• Examples: Bitcoin, Ethereum
• High security but slower transactions

2. Private Blockchains:
• Restricted access
• Controlled by an organization
• Faster transactions
• Used for internal business processes

3. Consortium Blockchains:
• Semi-decentralized
• Controlled by a group of organizations
• Balanced between security and speed
• Common in supply chain management

4. Hybrid Blockchains:
• Combination of public and private
• Selective transparency
• Customizable access controls

Each type serves different use cases and has its own advantages and trade-offs in terms of decentralization, security, and scalability.`,
          readingTime: "6 min"
        }
      ]
    },
    quiz: {
      questions: [
        {
          question: "What is the primary characteristic of blockchain technology?",
          options: ["Centralization", "Decentralization", "Speed", "Cost-effectiveness"],
          correctAnswer: 1,
          explanation: "Decentralization is the primary characteristic of blockchain, eliminating the need for a central authority."
        },
        {
          question: "What links blocks together in a blockchain?",
          options: ["Timestamps", "User signatures", "Cryptographic hashes", "Transaction amounts"],
          correctAnswer: 2,
          explanation: "Cryptographic hashes link blocks together, creating an immutable chain where each block references the previous one."
        },
        {
          question: "Which consensus mechanism requires miners to solve cryptographic puzzles?",
          options: ["Proof of Stake", "Proof of Work", "Delegated Proof of Stake", "Proof of Authority"],
          correctAnswer: 1,
          explanation: "Proof of Work requires miners to compete in solving cryptographic puzzles to validate transactions and create new blocks."
        },
        {
          question: "What makes blockchain data immutable?",
          options: ["Encryption", "Cryptographic hashing", "Digital signatures", "Network size"],
          correctAnswer: 1,
          explanation: "Cryptographic hashing makes blockchain data immutable because changing any data would require changing all subsequent blocks."
        },
        {
          question: "Which type of blockchain is open to everyone?",
          options: ["Private", "Consortium", "Public", "Hybrid"],
          correctAnswer: 2,
          explanation: "Public blockchains are open to everyone and are fully decentralized, like Bitcoin and Ethereum."
        }
      ]
    }
  },
  {
    id: 2,
    title: "Smart Contracts",
    description: "Master the art of creating and deploying smart contracts on various blockchain platforms.",
    level: "Intermediate",
    duration: "3-4 hours",
    xpReward: 750,
    image: "📝",
    theory: {
      chapters: [
        {
          id: 1,
          title: "Introduction to Smart Contracts",
          content: `Smart contracts are self-executing contracts with terms directly written into code. They automatically execute when predetermined conditions are met, eliminating the need for intermediaries.

Key Features:
• Autonomy: No need for intermediaries
• Trust: Transparent and verifiable code
• Speed: Automatic execution when conditions are met
• Accuracy: Eliminates human error
• Cost-effective: Reduces transaction costs

Smart contracts run on blockchain networks and are immutable once deployed. They can handle various types of agreements, from simple payments to complex multi-party contracts.

Real-world Applications:
• Insurance claims processing
• Supply chain management
• Real estate transactions
• Voting systems
• Crowdfunding platforms`,
          readingTime: "6 min"
        },
        {
          id: 2,
          title: "Smart Contract Platforms",
          content: `Different blockchain platforms support smart contracts:

Ethereum:
• First major smart contract platform
• Uses Solidity programming language
• Large ecosystem and developer community
• Higher gas fees but proven security

Binance Smart Chain:
• Ethereum-compatible
• Lower transaction fees
• Faster block times
• Good for DeFi applications

Aptos:
• Modern blockchain with Move language
• Parallel execution capabilities
• Enhanced security features
• Focus on scalability

Polygon:
• Layer 2 scaling solution for Ethereum
• Lower costs and faster transactions
• Maintains Ethereum compatibility
• Popular for gaming and NFTs

Each platform has its own advantages in terms of cost, speed, security, and developer experience.`,
          readingTime: "8 min"
        }
      ]
    },
    quiz: {
      questions: [
        {
          question: "What are smart contracts?",
          options: ["Digital signatures", "Self-executing contracts with code", "Blockchain wallets", "Cryptocurrency exchanges"],
          correctAnswer: 1,
          explanation: "Smart contracts are self-executing contracts where terms are directly written into code and execute automatically."
        },
        {
          question: "Which programming language is primarily used for Ethereum smart contracts?",
          options: ["JavaScript", "Python", "Solidity", "Move"],
          correctAnswer: 2,
          explanation: "Solidity is the primary programming language used for writing smart contracts on the Ethereum platform."
        },
        {
          question: "What happens to smart contracts once they're deployed?",
          options: ["They can be easily modified", "They become immutable", "They need regular updates", "They expire after time"],
          correctAnswer: 1,
          explanation: "Once deployed, smart contracts become immutable and cannot be changed, ensuring trust and transparency."
        },
        {
          question: "Which platform uses the Move programming language?",
          options: ["Ethereum", "Binance Smart Chain", "Aptos", "Polygon"],
          correctAnswer: 2,
          explanation: "Aptos uses the Move programming language, which is designed for safe and secure smart contract development."
        },
        {
          question: "What is a key advantage of smart contracts?",
          options: ["Manual oversight required", "Elimination of intermediaries", "High transaction costs", "Slow execution"],
          correctAnswer: 1,
          explanation: "Smart contracts eliminate the need for intermediaries by automatically executing when conditions are met."
        }
      ]
    }
  }
];

// Main App Component
function App() {
  const { connected } = useWallet();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Course navigation handlers
  const handleContinueLearning = () => {
    setCurrentPage('courses');
    setViewMode('list');
  };

  const handleCourseEnroll = (course: any) => {
    setSelectedCourse(course);
    setViewMode('detail');
    setCurrentPage('course-detail');
  };

  const handleStartTheory = (course: any) => {
    setSelectedCourse(course);
    setViewMode('theory');
    setCurrentPage('course-theory');
  };

  const handleCompleteTheory = () => {
    setViewMode('quiz');
    setCurrentPage('course-quiz');
  };

  const handleBackToCourse = () => {
    setCurrentPage('course-detail');
    setViewMode('detail');
  };

  const handleBackToCourses = () => {
    setCurrentPage('courses');
    setViewMode('list');
    setSelectedCourse(null);
  };

  const handleQuizComplete = (score: number) => {
    console.log(`Quiz completed with score: ${score}%`);
    // Here you could add logic to save the score, update user progress, etc.
  };

  const themeContextValue = {
    theme,
    toggleTheme
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatType: "reverse" 
                }}
                className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span className="text-3xl">🎓</span>
              </motion.div>
              
              <h1 className="text-3xl font-bold text-white mb-3">
                Blockchain Learning Hub
              </h1>
              <p className="text-gray-300 mb-8 text-lg">
                Master blockchain technology through interactive learning
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-300">
                  <span className="mr-3 text-blue-400">📚</span>
                  Interactive courses & quizzes
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="mr-3 text-green-400">🏆</span>
                  Earn certificates & badges
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="mr-3 text-purple-400">⛓️</span>
                  Real blockchain transactions
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-2xl">
                <div className="bg-slate-900/50 rounded-2xl p-4">
                  <Header />
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mt-4">
                Connect your Petra wallet to start learning
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onContinueLearning={handleContinueLearning} />;
      case 'courses':
        return <CourseList onCourseEnroll={handleCourseEnroll} />;
      case 'course-detail':
        return selectedCourse ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBackToCourses}
                  className="text-white hover:text-yellow-400 transition-colors"
                >
                  ← Back to Courses
                </button>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {selectedCourse.thumbnail} {selectedCourse.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-300">
                    <span>📖 {selectedCourse.level}</span>
                    <span>⏱️ {selectedCourse.duration}</span>
                    <span>🪙 {selectedCourse.xpReward} XP</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleStartTheory(selectedCourse)}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
              >
                Continue Course 📚
              </button>
            </div>
            <div className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-8 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'}`}>
              <h2 className="text-2xl font-bold text-white mb-4">Course Overview</h2>
              <p className="text-gray-300 mb-6">{selectedCourse.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">{selectedCourse.level}</div>
                  <div className="text-gray-400 text-sm">Difficulty</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400 mb-1">{selectedCourse.students}</div>
                  <div className="text-gray-400 text-sm">Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{selectedCourse.rating}</div>
                  <div className="text-gray-400 text-sm">Rating</div>
                </div>
              </div>
            </div>
          </div>
        ) : <CourseList onCourseEnroll={handleCourseEnroll} />;
      case 'course-theory':
        return selectedCourse ? (
          <Theory 
            course={selectedCourse} 
            onCompleteTheory={handleCompleteTheory}
            onBackToCourse={handleBackToCourse}
          />
        ) : <CourseList onCourseEnroll={handleCourseEnroll} />;
      case 'course-quiz':
        return selectedCourse ? (
          <CourseQuiz 
            course={selectedCourse} 
            onBack={handleBackToCourses}
            onComplete={handleQuizComplete}
          />
        ) : <CourseList onCourseEnroll={handleCourseEnroll} />;
      case 'quiz':
        return <QuizComponent />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <Profile />;
      case 'badges':
        return <BadgeCollection />;
      case 'certificates':
        return <Certificates />;
      case 'settings':
        return (
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              ⚙️ Settings
            </h1>
            <div className={`${theme === 'dark' ? 'bg-gray-800/20' : 'bg-white/10'} backdrop-blur-lg rounded-2xl p-8 border ${theme === 'dark' ? 'border-gray-700/30' : 'border-white/20'}`}>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">🎨 Theme</h2>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <h3 className="text-lg font-medium text-white">Dark/Light Mode</h3>
                    <p className="text-gray-300">Current theme: {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}</p>
                  </div>
                  <motion.button
                    onClick={toggleTheme}
                    className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
                      animate={{ x: theme === 'dark' ? 32 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <span className="text-xs">
                        {theme === 'dark' ? '🌙' : '☀️'}
                      </span>
                    </motion.div>
                  </motion.button>
                </div>
              </div>
              <div className="text-center pt-8 border-t border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">Gamified Learning DApp</h3>
                <p className="text-gray-400 text-sm">Enhanced High-End Edition</p>
                <p className="text-gray-400 text-sm mt-2">Theme switching now works! 🎉</p>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard onContinueLearning={() => console.log('Continue learning')} />;
    }
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20"></div>
        </div>
        {/* Navigation */}
        <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-lg">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">🎓</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">LearnChain</h1>
                  <p className="text-xs text-gray-400">Blockchain Education</p>
                </div>
              </motion.div>
              
              <div className="flex items-center space-x-1 bg-white/5 rounded-2xl p-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
                  { id: 'courses', label: 'Courses', icon: '📚' },
                  { id: 'quiz', label: 'Quiz', icon: '🧠' },
                  { id: 'badges', label: 'Badges', icon: '�' },
                  { id: 'certificates', label: 'Certificates', icon: '�' },
                  { id: 'leaderboard', label: 'Leaderboard', icon: '�' },
                  { id: 'profile', label: 'Profile', icon: '�' },
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(tab.id)}
                    className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-300 relative group ${
                      currentPage === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm mr-2">{tab.icon}</span>
                    <span className="text-sm hidden lg:inline">{tab.label}</span>
                    {currentPage === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <span className="text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
                </motion.button>
                <Header />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[calc(100vh-200px)]"
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-white/10 bg-white/5 backdrop-blur-xl relative z-10">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🎓</span>
                </div>
                <div>
                  <p className="text-white font-semibold">LearnChain</p>
                  <p className="text-gray-400 text-sm">Blockchain Education Platform</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>Built on Aptos</span>
                <span>•</span>
                <span>Powered by Move</span>
                <span>•</span>
                <span className="text-blue-400">v1.0.0</span>
              </div>
            </div>
          </div>
        </footer>
        
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
