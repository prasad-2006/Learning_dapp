# Real Aptos Transactions Setup

## 🎯 Goal: Quiz completions appear in Petra wallet transaction history

### ✅ Current Implementation
- **Real Aptos Transactions**: Uses actual Aptos blockchain transactions
- **Petra Wallet Integration**: Transactions signed with user's wallet
- **Transaction History**: Will appear in Petra wallet like network fees
- **Explorer Links**: Direct links to view transactions on Aptos Labs Explorer

### 🚀 How It Works

1. **Complete Quiz**: Get 100% score on any quiz
2. **Connect Petra Wallet**: Must be connected to create transactions
3. **Generate Certificate**: Enter your name to trigger blockchain recording
4. **Transaction Created**: 
   - Small APT transfer (1 Octa = 0.00000001 APT) to record achievement
   - Transaction signed with your Petra wallet
   - Appears in wallet history immediately
   - Viewable on Aptos Labs Explorer

### 💰 What You'll See in Petra Wallet

**Transaction Type**: Coin Transfer
**Amount**: -0.00000001 APT (plus network fee)
**Status**: Success ✅
**Purpose**: Quiz completion record

This will appear exactly like the network fee transactions in your screenshot, but will be a coin transfer representing your quiz achievement.

### 🔗 Aptos Labs Explorer

The transaction will be visible on explorer.aptoslabs.com with:
- ✅ Success status
- Transaction hash
- Block number
- Timestamp
- Gas used
- Transaction details

### 🎮 User Flow

1. Take quiz → Get perfect score (100%)
2. Click "Generate Certificate" 
3. Petra wallet popup appears
4. Sign transaction
5. Transaction confirmed on blockchain
6. Success message with explorer link
7. Transaction visible in Petra wallet history

### ⚡ Benefits

- **Real Blockchain Proof**: Actual transaction on Aptos
- **Wallet History**: Permanent record in Petra wallet
- **Public Verification**: Anyone can verify on explorer
- **Cost Effective**: Minimal cost (1 Octa + network fee)
- **Instant**: Transactions confirm in seconds

### 🔧 Technical Details

- **Network**: Aptos Devnet
- **Transaction Type**: 0x1::coin::transfer
- **Amount**: 1 Octa (to self-address)
- **Purpose**: Achievement timestamp on blockchain
- **Cost**: ~0.0001 APT total (including gas)

The system is now ready to create real Aptos transactions that will appear in your Petra wallet transaction history! 🎉
