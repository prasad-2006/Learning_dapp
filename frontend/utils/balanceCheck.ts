import { aptosClient } from "./aptosClient";

// Check if user has sufficient APT balance for transactions
export async function checkAPTBalance(address: string): Promise<{
  balance: number;
  hasEnoughForTransaction: boolean;
  formattedBalance: string;
}> {
  try {
    const aptos = aptosClient();
    
    // Get APT balance
    let balance = 0;
    try {
      const resource = await aptos.account.getAccountResource({
        accountAddress: address,
        resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
      });
      balance = parseInt((resource as any).data.coin.value);
    } catch (e: any) {
      if (e.errorCode === 'resource_not_found') {
        // Account might not exist yet or hasn't received any APT
        balance = 0;
      } else {
        throw e;
      }
    }
    const balanceInAPT = balance / 100000000; // Convert from Octas to APT
    
    // Need at least 0.001 APT for transaction + gas
    const hasEnoughForTransaction = balance >= 100000; // 0.001 APT in Octas

    return {
      balance,
      hasEnoughForTransaction,
      formattedBalance: balanceInAPT.toFixed(6),
    };
  } catch (error) {
    console.error("Error checking APT balance:", error);
    return {
      balance: 0,
      hasEnoughForTransaction: false,
      formattedBalance: "0.000000",
    };
  }
}

// Get devnet faucet URL for getting test APT
export function getFaucetUrl(): string {
  return "https://faucet.devnet.aptoslabs.com/";
}
