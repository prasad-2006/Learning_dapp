import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from 'react-hot-toast';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { 
  CogIcon,
  SparklesIcon,
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CourseList from "./components/CourseList";
import { QuizComponent } from "./components/EnhancedQuizComponent";
import Leaderboard from "./components/Leaderboard";
import Profile from "./components/Profile";
import BadgeCollection from "./components/BadgeCollection";
import { Settings } from "./components/Settings";
import { CourseDetail } from "./components/CourseDetail";

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

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  theoryChapters: Array<{
    id: number;
    title: string;
    content: string;
    estimatedReadTime: number;
    order: number;
  }>;
  requiredLevel: number;
  passingScore: number;
}

// Main App Component
function App() {
  const { connected } = useWallet();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentQuizData, setCurrentQuizData] = useState<{
    courseId: number;
    courseTitle: string;
    quizzes: Quiz[];
  } | null>(null);

  // Sample enhanced quiz data with explanations
  const sampleQuizzes: Quiz[] = [
    {
      id: 1,
      courseId: 1,
      question: "What is the primary purpose of Move language in blockchain development?",
      options: [
        "To create smart contracts with resource-oriented programming",
        "To mine cryptocurrency",
        "To design user interfaces",
        "To manage databases"
      ],
      correctAnswer: 0,
      points: 100,
      timeLimit: 120,
      explanation: "Move is designed specifically for safe resource management in blockchain smart contracts, using a resource-oriented programming model that prevents common bugs like double-spending.",
      chapterReference: 1
    },
    {
      id: 2,
      courseId: 1,
      question: "Which of the following is a key feature of Move's type system?",
      options: [
        "Dynamic typing with runtime checks",
        "Linear types and resource safety guarantees",
        "Weak typing for flexibility",
        "No type checking for performance"
      ],
      correctAnswer: 1,
      points: 100,
      timeLimit: 120,
      explanation: "Move uses linear types to ensure resources cannot be duplicated or dropped accidentally, providing memory safety and preventing common smart contract vulnerabilities.",
      chapterReference: 2
    },
    {
      id: 3,
      courseId: 1,
      question: "What is a 'resource' in Move language?",
      options: [
        "A variable that can be copied and modified freely",
        "A special type that cannot be copied or dropped without explicit handling",
        "A function parameter with default values",
        "A database connection object"
      ],
      correctAnswer: 1,
      points: 100,
      timeLimit: 120,
      explanation: "Resources in Move are special types representing real-world assets that cannot be copied or discarded, ensuring they represent valuable digital assets that must be explicitly managed.",
      chapterReference: 3
    },
    {
      id: 4,
      courseId: 1,
      question: "How does Move prevent double-spending attacks at the language level?",
      options: [
        "By using proof-of-work consensus algorithms",
        "Through linear type system that prevents resource duplication",
        "By limiting transaction processing speed",
        "Using centralized validation servers"
      ],
      correctAnswer: 1,
      points: 100,
      timeLimit: 120,
      explanation: "Move's linear type system ensures that digital assets (resources) cannot be duplicated at the programming language level, making double-spending mathematically impossible.",
      chapterReference: 4
    },
    {
      id: 5,
      courseId: 1,
      question: "What is the main advantage of Move's bytecode verification system?",
      options: [
        "Faster execution speed during runtime",
        "Smaller compiled file sizes",
        "Static verification of resource safety before execution",
        "Better user interface rendering"
      ],
      correctAnswer: 2,
      points: 100,
      timeLimit: 120,
      explanation: "Move bytecode is statically verified before execution to ensure that all resource safety properties hold, eliminating the need for expensive runtime safety checks.",
      chapterReference: 5
    }
  ];

  // Sample course with theory content
  const sampleCourse: Course = {
    id: 1,
    title: "Move Programming Fundamentals",
    description: "Master the basics of Move programming language for secure blockchain development",
    category: "Blockchain Programming",
    difficulty: 3,
    theoryChapters: [
      {
        id: 1,
        title: "Introduction to Move Language",
        content: `Move is a revolutionary programming language designed specifically for writing safe smart contracts. Originally developed by Facebook (now Meta) for the Diem blockchain, Move has become a platform-agnostic language that enables secure, resource-oriented programming.

Key Design Principles:
• Resource-Oriented Programming: Move treats digital assets as first-class resources that cannot be copied or lost
• Static Safety: Comprehensive compile-time verification prevents runtime errors
• Formal Verification: Mathematical proofs ensure contract correctness

Why Move Matters:
Traditional programming languages allow values to be copied and discarded freely, which is dangerous when dealing with valuable digital assets. Move's innovation lies in its resource system - resources can only be moved between locations, never copied or accidentally destroyed.

This fundamental design prevents many common smart contract vulnerabilities:
- Double spending of digital currencies
- Accidental loss of valuable NFTs
- Unauthorized duplication of unique items
- Memory leaks and dangling pointers

Move's type system statically prevents these errors at compile time, making it significantly safer than traditional languages for handling valuable digital assets.`,
        estimatedReadTime: 8,
        order: 1
      },
      {
        id: 2,
        title: "Move Type System and Linear Types",
        content: `Move's type system is built around linear types and the concept of resources. This system provides unprecedented safety guarantees for smart contract development.

Resource Properties:
1. Linear: Resources must be used exactly once - they cannot be copied or dropped
2. Storable: Resources can be stored in global storage under accounts
3. Transferable: Resources can be moved between different storage locations
4. Accountable: Every resource must be explicitly handled

The Linear Type System ensures:
• No Resource Duplication: Digital assets cannot be accidentally copied
• No Resource Loss: Resources cannot be dropped without explicit destruction
• Clear Ownership: At any time, exactly one location owns each resource
• Memory Safety: No dangling pointers or memory leaks

Types in Move:
- Copyable Types: Basic values like integers, booleans that can be freely copied
- Resource Types: Valuable assets that follow linear type rules
- Reference Types: Temporary borrows that don't transfer ownership

Example Resource Definition:
```move
struct Coin has key, store {
    value: u64
}
```

The 'has key, store' abilities define what operations are allowed on this resource type.`,
        estimatedReadTime: 10,
        order: 2
      },
      {
        id: 3,
        title: "Modules, Functions, and Smart Contract Structure",
        content: `Move code is organized into modules, which serve as the building blocks for smart contracts. Understanding module structure is crucial for effective Move development.

Module Components:
• Struct Definitions: Define custom types and resources
• Function Definitions: Contain the contract logic
• Constants: Store immutable values
• Use Declarations: Import functionality from other modules

Function Visibility:
- public: Callable from outside the module by anyone
- public(friend): Callable only by designated friend modules
- public(entry): Can be called directly from transactions
- internal: Callable only within the same module

Resource Lifecycle in Functions:
When a resource is passed to a function, ownership transfers completely. The function becomes responsible for handling the resource according to Move's linear type rules.

Example Module Structure:
```move
module 0x1::MyCoin {
    struct Coin has key, store {
        value: u64
    }
    
    public fun create_coin(value: u64): Coin {
        Coin { value }
    }
    
    public fun get_value(coin: &Coin): u64 {
        coin.value
    }
}
```

Access Control:
Move enforces access control through its type system. Only the module that defines a resource can create or destroy instances of that resource, providing built-in security.`,
        estimatedReadTime: 12,
        order: 3
      },
      {
        id: 4,
        title: "Global Storage and Account Model",
        content: `Move uses a unique global storage model where resources are stored under account addresses. This design provides clear ownership semantics and efficient storage management.

Storage Architecture:
• Each account (address) has its own storage space
• Resources are stored directly under addresses
• Modules are also stored under the address that published them
• Global storage provides a tree-like structure: Address -> ResourceType -> Data

Storage Operations:
- move_to<T>: Store a resource under the transaction sender's address
- move_from<T>: Remove and return a resource from an address
- borrow_global<T>: Get an immutable reference to a resource
- borrow_global_mut<T>: Get a mutable reference to a resource
- exists<T>: Check if a resource exists at an address

Access Control Enforcement:
• Resource Protection: Only the defining module can create/destroy resources
• Address Ownership: Only the account owner can authorize resource operations
• Type Safety: Resources can only be accessed with the correct type

Example Storage Operations:
```move
public entry fun deposit_coin(account: &signer, coin: Coin) {
    let addr = signer::address_of(account);
    if (!exists<Coin>(addr)) {
        move_to(account, coin);
    } else {
        let existing = borrow_global_mut<Coin>(addr);
        existing.value = existing.value + coin.value;
        let Coin { value: _ } = coin; // destroy the deposited coin
    }
}
```

This model ensures data integrity, clear ownership, and protection against unauthorized access while maintaining efficiency.`,
        estimatedReadTime: 11,
        order: 4
      },
      {
        id: 5,
        title: "Safety Guarantees and Formal Verification",
        content: `Move provides multiple layers of safety guarantees, from compile-time checks to formal verification capabilities. This comprehensive approach makes Move one of the safest languages for smart contract development.

Static Safety Guarantees:
• Resource Safety: Resources cannot be duplicated or lost
• Reference Safety: No dangling pointers or use-after-free errors
• Type Safety: No runtime type errors or invalid casts
• Integer Safety: Protection against overflow, underflow, and division by zero
• Memory Safety: Automatic memory management without garbage collection overhead

Runtime Protection:
• Gas Metering: Prevents infinite loops and excessive resource consumption
• Stack Overflow Protection: Prevents stack exhaustion attacks
• Bounds Checking: Array and vector access is always bounds-checked
• Abort on Error: Transactions abort cleanly on any safety violation

Formal Verification with Move Prover:
The Move Prover allows developers to write mathematical specifications and prove correctness properties:

```move
spec transfer {
    requires sender_balance >= amount;
    ensures sender_balance == old(sender_balance) - amount;
    ensures receiver_balance == old(receiver_balance) + amount;
}
```

Verification Benefits:
• Mathematical Proof: Properties are proven correct, not just tested
• Comprehensive Coverage: All possible execution paths are verified
• Bug Prevention: Catches errors that traditional testing might miss
• Specification Documentation: Specs serve as precise documentation

Multi-Layer Defense:
1. Static Analysis: Compile-time safety checks
2. Bytecode Verification: Runtime safety enforcement
3. Formal Verification: Mathematical correctness proofs
4. Economic Security: Gas costs prevent spam attacks

This layered approach ensures that Move smart contracts are both safe and secure, making it ideal for handling valuable digital assets in decentralized applications.`,
        estimatedReadTime: 13,
        order: 5
      }
    ],
    requiredLevel: 1,
    passingScore: 5
  };

  const pageVariants = {
    initial: { opacity: 0, x: -100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 100 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
  };

  const handleStartQuiz = (courseId: number) => {
    const courseTitle = courseId === 1 ? "Move Programming Fundamentals" : "Sample Course";
    setCurrentQuizData({
      courseId,
      courseTitle,
      quizzes: sampleQuizzes
    });
    setCurrentPage('quiz');
  };

  const handleQuizComplete = (courseId: number, answers: number[], score: number) => {
    console.log(`Quiz completed for course ${courseId}:`, { answers, score });
    toast.success(`Quiz completed! Score: ${score}/${answers.length}`);
    if (score >= sampleCourse.passingScore) {
      toast.success('🎉 Certificate earned! Check your wallet for the transaction.');
    }
  };

  const handleEnrollCourse = (courseId: number) => {
    console.log(`Enrolling in course ${courseId}`);
    toast.success('Successfully enrolled in course!');
    setShowCourseDetail(false);
  };

  const handleViewCourseDetail = (courseId: number) => {
    if (courseId === 1) {
      setSelectedCourse(sampleCourse);
      setShowCourseDetail(true);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 dark:bg-gray-800/20 backdrop-blur-lg rounded-3xl p-12 text-center border border-white/20 dark:border-gray-700/50 shadow-2xl max-w-md mx-4"
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-4xl shadow-lg"
          >
            🎓
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            LearnChain
          </h1>
          <p className="text-xl text-gray-200 dark:text-gray-300 mb-8">
            Revolutionary Blockchain-Powered Learning Platform
          </p>
          <div className="space-y-4 text-sm text-gray-300 dark:text-gray-400 mb-8">
            <div className="flex items-center justify-center space-x-2">
              <SparklesIcon className="w-4 h-4" />
              <span>Gamified Learning Experience</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <AcademicCapIcon className="w-4 h-4" />
              <span>Earn Certificates on Blockchain</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <TrophyIcon className="w-4 h-4" />
              <span>Compete on Global Leaderboards</span>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Header />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Render quiz if currently taking one
  if (currentPage === 'quiz' && currentQuizData) {
    return (
      <QuizComponent
        courseId={currentQuizData.courseId}
        courseTitle={currentQuizData.courseTitle}
        quizzes={currentQuizData.quizzes}
        onComplete={handleQuizComplete}
        onClose={() => setCurrentPage('courses')}
        passingScore={5}
      />
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return (
          <CourseList 
            onStartQuiz={handleStartQuiz}
            onViewCourse={handleViewCourseDetail}
          />
        );
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <Profile />;
      case 'badges':
        return <BadgeCollection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="bg-black/20 dark:bg-gray-800/30 backdrop-blur-lg border-b border-white/10 dark:border-gray-700/30 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="flex items-center space-x-3"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                  🎓
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">LearnChain</h1>
                  <p className="text-xs text-gray-300 dark:text-gray-400">Level Up Your Skills</p>
                </div>
              </motion.div>
              
              <div className="hidden md:flex space-x-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
                  { id: 'courses', label: 'Courses', icon: BookOpenIcon },
                  { id: 'leaderboard', label: 'Leaderboard', icon: TrophyIcon },
                  { id: 'profile', label: 'Profile', icon: UserCircleIcon },
                  { id: 'badges', label: 'Badges', icon: SparklesIcon },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentPage(tab.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                        currentPage === tab.id
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                          : 'text-white hover:bg-white/10 dark:hover:bg-gray-700/30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(true)}
                className="p-2 text-white hover:bg-white/10 dark:hover:bg-gray-700/30 rounded-xl transition-colors"
              >
                <CogIcon className="w-6 h-6" />
              </motion.button>
              <Header />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Course Detail Modal */}
      {showCourseDetail && selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          isOpen={showCourseDetail}
          onClose={() => setShowCourseDetail(false)}
          onEnroll={handleEnrollCourse}
          onStartQuiz={handleStartQuiz}
          userProgress={{
            isEnrolled: true,
            completedChapters: [true, true, false, false, false],
            canTakeQuiz: false,
            isCompleted: false
          }}
        />
      )}
      
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </div>
  );
}

export default App;
