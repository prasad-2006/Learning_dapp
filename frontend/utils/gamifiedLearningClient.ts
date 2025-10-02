import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

// Initialize Aptos client
const aptosConfig = new AptosConfig({ 
  network: Network.DEVNET // Change to MAINNET for production
});
export const aptos = new Aptos(aptosConfig);

// Contract addresses - these should match your deployed contract addresses
export const GAMIFIED_LEARNING_ADDRESS = import.meta.env.VITE_MODULE_PUBLISHER_ACCOUNT_ADDRESS || "0x123";

// User profile functions
export const createUserProfile = async (username: string): Promise<InputTransactionData> => {
  return {
    data: {
      function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::create_user_profile`,
      functionArguments: [username],
    },
  };
};

export const getUserProfile = async (userAddress: string) => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::get_user_profile`,
        functionArguments: [userAddress],
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Course functions
export const createCourse = async (
  title: string,
  description: string,
  category: string,
  difficulty: number,
  rewardAmount: number,
  prerequisites: number[]
): Promise<InputTransactionData> => {
  return {
    data: {
      function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::create_course`,
      functionArguments: [title, description, category, difficulty, rewardAmount, prerequisites],
    },
  };
};

export const getAllCourses = async () => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::get_all_courses`,
        functionArguments: [],
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export const getCourse = async (courseId: number) => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::get_course`,
        functionArguments: [courseId],
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
};

// Quiz functions
export const addQuizToCourse = async (
  courseId: number,
  question: string,
  options: string[],
  correctAnswer: number,
  points: number,
  timeLimit: number
): Promise<InputTransactionData> => {
  return {
    data: {
      function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::add_quiz_to_course`,
      functionArguments: [courseId, question, options, correctAnswer, points, timeLimit],
    },
  };
};

export const completeQuiz = async (
  courseId: number,
  quizId: number,
  answer: number
): Promise<InputTransactionData> => {
  return {
    data: {
      function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::complete_quiz`,
      functionArguments: [courseId, quizId, answer],
    },
  };
};

export const completeCourse = async (courseId: number): Promise<InputTransactionData> => {
  return {
    data: {
      function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::complete_course`,
      functionArguments: [courseId],
    },
  };
};

// Leaderboard functions
export const getLeaderboard = async () => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::get_leaderboard`,
        functionArguments: [],
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};

// Badge functions
export const getUserBadges = async (userAddress: string) => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::get_user_badges`,
        functionArguments: [userAddress],
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return [];
  }
};

export const getBadgeDetails = async (badgeId: number) => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${GAMIFIED_LEARNING_ADDRESS}::gamified_learning::get_badge_details`,
        functionArguments: [badgeId],
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching badge details:", error);
    return null;
  }
};

// Token balance functions
export const getAccountBalance = async (accountAddress: string) => {
  try {
    const resources = await aptos.getAccountResources({
      accountAddress,
    });
    
    // Find the fungible asset store
    const fungibleStore = resources.find((r) => 
      r.type.includes("primary_fungible_store::PrimaryFungibleStore")
    );
    
    if (fungibleStore) {
      // Extract balance from the fungible store data
      const balance = (fungibleStore.data as any)?.metadata?.value || 0;
      return balance;
    }
    
    return 0;
  } catch (error) {
    console.error("Error fetching account balance:", error);
    return 0;
  }
};

// Helper functions for transaction handling
export const waitForTransaction = async (transactionHash: string) => {
  try {
    const transaction = await aptos.waitForTransaction({
      transactionHash,
      options: {
        timeoutSecs: 30,
      },
    });
    return transaction;
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
};

// Event listening functions
export const getAccountEvents = async (eventType: string) => {
  try {
    // For now, return empty array - events API may vary by SDK version
    console.log("Event type requested:", eventType);
    return [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// Format utilities
export const formatTokenAmount = (amount: number): string => {
  return (amount / 100000000).toFixed(2); // Assuming 8 decimal places
};

export const shortenAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Validation utilities
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(address);
};

export const isValidCourseData = (title: string, description: string): boolean => {
  return title.length > 0 && title.length <= 100 && 
         description.length > 0 && description.length <= 500;
};

// Network configuration
export const getNetworkConfig = () => {
  const network = import.meta.env.VITE_APP_NETWORK || "devnet";
  return {
    network: network as Network,
    nodeUrl: network === "mainnet" 
      ? "https://fullnode.mainnet.aptoslabs.com/v1" 
      : "https://fullnode.devnet.aptoslabs.com/v1",
    faucetUrl: network === "devnet" 
      ? "https://faucet.devnet.aptoslabs.com" 
      : undefined,
  };
};
