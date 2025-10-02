import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "./components/WalletSelector";

export default function App() {
  const { connected, account } = useWallet();

  console.log('🚀 Emergency App rendering:', { connected, account: account?.address?.toString() });

  if (!connected) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 rounded-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-white mb-4">LearnDApp</h1>
          <p className="text-gray-300 mb-6">Connect your wallet to get started</p>
          <WalletSelector />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🎉 Welcome to LearnDApp! 🎉
        </h1>
        
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">✅ Wallet Connected Successfully!</h2>
          <p className="text-lg">Account: {account?.address?.toString()}</p>
          <p className="text-sm text-gray-300 mt-2">
            Your Web3 learning platform is now ready to use!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">📚 Interactive Quizzes</h3>
            <p className="text-gray-300">
              Take blockchain quizzes and earn certificates on the Aptos network
            </p>
          </div>
          
          <div className="bg-purple-500/20 border border-purple-500 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">🏆 Achievement Badges</h3>
            <p className="text-gray-300">
              Collect achievement badges as you progress through courses
            </p>
          </div>
          
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">📜 NFT Certificates</h3>
            <p className="text-gray-300">
              Earn verified certificates stored on the blockchain
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🔄 Reload to Access Full Platform
          </button>
          <p className="text-sm text-gray-400 mt-2">
            This is a simplified view. Reload the page to access the full platform features.
          </p>
        </div>
      </div>
    </div>
  );
}
