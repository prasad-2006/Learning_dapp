import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "@/components/ui/button";

export function WalletDebug() {
  const wallet = useWallet();
  
  const testTransaction = async () => {
    console.log("=== WALLET DEBUG TEST ===");
    console.log("Full wallet object:", wallet);
    console.log("Account:", wallet.account);
    console.log("Connected:", wallet.connected);
    console.log("signAndSubmitTransaction:", wallet.signAndSubmitTransaction);
    console.log("signAndSubmitTransaction type:", typeof wallet.signAndSubmitTransaction);
    
    if (!wallet.account || !wallet.signAndSubmitTransaction) {
      console.error("❌ Wallet not properly connected");
      return;
    }
    
    try {
      // Try the simplest transaction format
      const response = await wallet.signAndSubmitTransaction({
        data: {
          function: "0x1::aptos_account::transfer",
          functionArguments: [wallet.account.address.toString(), "1000"],
        },
      });
      console.log("✅ Transaction successful:", response);
    } catch (error: any) {
      console.error("❌ Transaction failed:", error);
    }
  };
  
  return (
    <div className="p-4 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-600">
      <h3 className="font-bold mb-2 text-white">Wallet Debug</h3>
      <div className="text-sm mb-4 space-y-1">
        <p className="text-gray-200">Connected: {wallet.connected ? "✅" : "❌"}</p>
        <p className="text-gray-200">Account: {wallet.account?.address?.toString() || "None"}</p>
        <p className="text-gray-200">signAndSubmitTransaction: {typeof wallet.signAndSubmitTransaction === 'function' ? "✅" : "❌"}</p>
      </div>
      <Button 
        onClick={testTransaction}
        disabled={!wallet.connected || !wallet.account || !wallet.signAndSubmitTransaction}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Test Wallet Transaction
      </Button>
    </div>
  );
}
