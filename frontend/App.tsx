import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from 'react-hot-toast';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard_fixed";
import CourseList from "./components/CourseList";
import CourseQuiz from "./components/CourseQuiz";
import QuizComponent from "./components/QuizComponent";
import Theory from "./components/Theory";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import BadgeCollection from "./components/BadgeCollection";
import Certificates from "./components/Certificates";
import { WalletSelector } from "./components/WalletSelector";

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
  };

  const handleCourseEnroll = (course: any) => {
    setSelectedCourse(course);
    setCurrentPage('course-detail');
  };

  const handleCompleteTheory = () => {
    setCurrentPage('course-quiz');
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
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">LearnDApp</h1>
              <p className="text-gray-300">Web3 Learning Platform</p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-300">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                  ✓
                </span>
                Interactive blockchain quizzes
              </div>
              <div className="flex items-center text-gray-300">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                  ✓
                </span>
                Earn certificates on Aptos blockchain
              </div>
              <div className="flex items-center text-gray-300">
                <span className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mr-3">
                  ✓
                </span>
                Track your learning progress
              </div>
            </div>

            <div className="text-center text-gray-400 text-sm mb-6">
              <p className="mb-4">Connect your Petra wallet to get started</p>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6">
                <p className="text-yellow-400 text-xs">
                  🔗 Your quiz completions will be recorded as real blockchain transactions
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <WalletSelector />
            </div>
          </div>
        </motion.div>
        <Toaster position="top-right" />
      </div>
    );
  }

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
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-xl font-bold text-white">L</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">LearnDApp</h1>
                  <p className="text-xs text-gray-400">Web3 Learning Platform</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === 'dashboard'
                      ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setCurrentPage('quiz')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === 'quiz'
                      ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Quiz Arena
                </button>
                <button
                  onClick={() => setCurrentPage('certificates')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === 'certificates'
                      ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Certificates
                </button>
                <button
                  onClick={() => setCurrentPage('badges')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    currentPage === 'badges'
                      ? 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Badges
                </button>
              </div>
              
              <Header />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
            {/* Visible content indicator */}
          <div className="bg-yellow-500 text-black text-center py-4 px-6 rounded mb-6 font-bold">
            ⚡ MAIN CONTENT AREA RENDERING - You should see this after wallet connection!
          </div>
          
          <AnimatePresence mode="wait">
            {currentPage === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-green-500 text-white text-center py-6 px-8 rounded-lg mb-6 text-xl font-bold">
                  🎉 DASHBOARD SECTION RENDERING! 🎉
                  <br />
                  <span className="text-sm">This proves the dashboard condition is working</span>
                </div>
                <div className="bg-blue-500/20 text-white text-center py-4 px-6 rounded mb-4">
                  🔄 Loading Dashboard Component...
                </div>
                <Dashboard onContinueLearning={handleContinueLearning} />
              </motion.div>
            )}

            {currentPage === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <QuizComponent />
              </motion.div>
            )}

            {currentPage === 'certificates' && (
              <motion.div
                key="certificates"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Certificates />
              </motion.div>
            )}

            {currentPage === 'badges' && (
              <motion.div
                key="badges"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BadgeCollection />
              </motion.div>
            )}

            {currentPage === 'courses' && (
              <motion.div
                key="courses"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CourseList
                  onCourseEnroll={handleCourseEnroll}
                />
              </motion.div>
            )}

            {currentPage === 'course-detail' && selectedCourse && (
              <motion.div
                key="course-detail"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CourseQuiz
                  course={selectedCourse}
                  onBack={() => setCurrentPage('courses')}
                  onComplete={() => {}}
                />
              </motion.div>
            )}

            {currentPage === 'course-theory' && selectedCourse && (
              <motion.div
                key="course-theory"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Theory
                  course={selectedCourse}
                  onCompleteTheory={handleCompleteTheory}
                  onBackToCourse={() => setCurrentPage('course-detail')}
                />
              </motion.div>
            )}

            {currentPage === 'course-quiz' && selectedCourse && (
              <motion.div
                key="course-quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CourseQuiz
                  course={selectedCourse}
                  onBack={() => setCurrentPage('course-theory')}
                  onComplete={() => setCurrentPage('dashboard')}
                />
              </motion.div>
            )}

            {currentPage === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Leaderboard />
              </motion.div>
            )}

            {currentPage === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Profile />
              </motion.div>
            )}
            
            {/* Fallback - if no page matches, show this */}
            {!['dashboard', 'quiz', 'certificates', 'badges', 'courses', 'course-detail', 'course-theory', 'course-quiz', 'profile'].includes(currentPage) && (
              <motion.div
                key="fallback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-orange-500 text-white text-center py-6 px-8 rounded-lg">
                  ⚠️ FALLBACK TRIGGERED!
                  <br />
                  <span className="text-sm">Current page "{currentPage}" not recognized. This should not happen.</span>
                  <br />
                  <button 
                    onClick={() => setCurrentPage('dashboard')} 
                    className="mt-4 bg-white text-orange-500 px-4 py-2 rounded font-bold"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 mt-16">
          <div className="container mx-auto px-6 py-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-white">L</span>
                  </div>
                  <span className="text-xl font-bold text-white">LearnDApp</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Master blockchain technology through interactive learning and earn verified certificates on the Aptos network.
                </p>
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <span className="text-sm">🐦</span>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <span className="text-sm">📘</span>
                  </div>
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <span className="text-sm">💼</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Learn</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Blockchain Basics</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Smart Contracts</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">DeFi Protocols</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">NFT Technology</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Quiz Arena</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Certificates</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Badge System</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
              <p>&copy; 2024 LearnDApp. Built with ❤️ for the Web3 community.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <Toaster position="top-right" />
    </ThemeContext.Provider>
  );
}

export default App;
