import { aptosClient } from "./aptosClient";

// Interface for quiz completion transaction
export interface QuizCompletionTransaction {
  quizName: string;
  score: number;
  maxScore: number;
  certificateId: string;
}

/**
 * Submit quiz completion to the blockchain using Petra wallet
 * This creates a self-transfer transaction that appears in wallet history
 */
export async function submitQuizCompletion(
  account: any, // Wallet account object from useWallet hook
  signAndSubmitTransaction: any, // signAndSubmitTransaction function from wallet adapter
  quizTransaction: QuizCompletionTransaction
): Promise<string> {
  try {
    // Verify perfect score
    if (quizTransaction.score !== quizTransaction.maxScore) {
      throw new Error("Only perfect scores are eligible for blockchain rewards");
    }

    // Verify wallet connection
    if (!account || !account.address) {
      throw new Error("Wallet account not properly connected");
    }

    if (!signAndSubmitTransaction || typeof signAndSubmitTransaction !== 'function') {
      throw new Error("Wallet signing function not available");
    }

    console.log("🎯 Submitting quiz completion to Aptos blockchain:", {
      user: account?.address?.toString(),
      quiz: quizTransaction.quizName,
      score: `${quizTransaction.score}/${quizTransaction.maxScore}`,
      certificateId: quizTransaction.certificateId,
    });

    console.log("🔍 Detailed wallet check:");
    console.log("- Account object:", account);
    console.log("- Account address:", account?.address?.toString());
    console.log("- Connected status:", !!account);
    console.log("- signAndSubmitTransaction function:", typeof signAndSubmitTransaction);
    console.log("- signAndSubmitTransaction toString:", signAndSubmitTransaction?.toString().substring(0, 100));

    // Additional check to ensure the function is actually available
    if (!signAndSubmitTransaction) {
      throw new Error("signAndSubmitTransaction function is undefined. Wallet may not be properly connected.");
    }

    console.log("🔐 Requesting Petra wallet approval...");
    console.log("   ⚠️ Please approve the transaction in your Petra wallet popup!");

    // Submit transaction directly - this should trigger the Petra wallet popup
    console.log("🚀 Calling signAndSubmitTransaction...");
    console.log("signAndSubmitTransaction type:", typeof signAndSubmitTransaction);
    
    let response;
    try {
      // First, initialize the account if needed
      try {
        response = await signAndSubmitTransaction({
          data: {
            function: "0x1::aptos_account::transfer",
            functionArguments: [account.address.toString(), "1"], // Minimum transfer to initialize account
            type_arguments: [],
          },
          options: {
            max_gas_amount: "20000",
            gas_unit_price: "100",
            expiration_timestamp_secs: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
          }
        });
        
        // Wait for the initialization transaction
        if (response && response.hash) {
          await aptosClient().waitForTransaction({ transactionHash: response.hash });
        }
      } catch (initError: any) {
        console.log("Account initialization skipped (might already exist):", initError?.message);
      }

      // Now proceed with the actual quiz completion transaction
      response = await signAndSubmitTransaction({
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [account.address.toString(), "10000"], // Transfer 10000 octas (0.0001 APT) to self
          type_arguments: [],
        },
        options: {
          max_gas_amount: "20000",
          gas_unit_price: "100",
          expiration_timestamp_secs: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
        }
      });
      console.log("✅ Transaction response received:", response);
    } catch (error: any) {
      console.error("❌ Transaction submission failed:", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error?.message);
      console.error("Error code:", error?.code);
      throw error;
    }
    
    console.log("✅ Petra wallet approval successful!");
    console.log("📋 Transaction response:", response);

    if (!response || !response.hash) {
      throw new Error("Invalid transaction response - no hash returned");
    }

    // Wait for blockchain confirmation
    console.log("⏳ Waiting for blockchain confirmation...");
    const aptos = aptosClient();
    const txnResult = await aptos.transaction.waitForTransaction({
      transactionHash: response.hash,
    });

    console.log("🎉 Transaction confirmed on blockchain!");
    console.log("📊 Transaction result:", txnResult);
    console.log("✅ Success! Transaction will appear in Petra wallet history");
    console.log("🔍 View on Aptos Explorer:", `https://explorer.aptoslabs.com/txn/${response.hash}?network=devnet`);
    
    return response.hash;
    
  } catch (error: any) {
    console.error("❌ Blockchain transaction failed:", error);
    console.error("🔍 Error details:", {
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    // Provide user-friendly error messages
    if (error.code === 4001 || error.message?.includes("User rejected") || error.message?.includes("rejected")) {
      throw new Error("Transaction was cancelled by user in Petra wallet");
    } else if (error.message?.includes("popup") || error.message?.includes("blocked")) {
      throw new Error("Wallet popup was blocked. Please allow popups for this site and try again.");
    } else if (error.message?.includes("not connected") || error.message?.includes("connection")) {
      throw new Error("Wallet is not properly connected. Please reconnect your Petra wallet.");
    } else if (error.message?.includes("insufficient")) {
      throw new Error("Insufficient APT balance for transaction fee. Please get test tokens from faucet.");
    } else if (error.message?.includes("network")) {
      throw new Error("Network error. Please check your connection and try again.");
    } else {
      throw new Error(`Transaction failed: ${error.message || "Unknown error occurred"}`);
    }
  }
}

// Function to get user's quiz completion history from blockchain
export async function getUserQuizCompletions(userAddress: string) {
  try {
    console.log("Fetching quiz completions for:", userAddress);
    // For now, return empty array - this would call the smart contract in production
    return [];
  } catch (error) {
    console.error("Error fetching quiz completions:", error);
    return [];
  }
}

// Function to get total completions count
export async function getTotalCompletionsCount(userAddress: string): Promise<number> {
  try {
    console.log("Fetching total completions for:", userAddress);
    // For now, return 0 - this would call the smart contract in production
    return 0;
  } catch (error) {
    console.error("Error fetching completions count:", error);
    return 0;
  }
}

// Utility function to format transaction hash for display
export function formatTransactionHash(hash: string): string {
  if (hash.length <= 12) return hash;
  return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
}

// Function to get Aptos Explorer URL for transaction
export function getExplorerUrl(txHash: string, network: string = "devnet"): string {
  return `https://explorer.aptoslabs.com/txn/${txHash}?network=${network}`;
}

// Check if transaction hash is a mock/simulation (now all transactions are real)
export function isMockTransaction(txHash: string): boolean {
  // Since we're now using real transactions, this should always return false
  return txHash === `0x${'0'.repeat(64)}`;
}
