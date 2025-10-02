# Blockchain-Based Learning Platform

A decentralized learning platform built on the Aptos blockchain that gamifies the educational experience through blockchain technology, smart contracts, and rewards.

## Project Vision

To revolutionize online learning by combining educational content with blockchain technology, creating a transparent, engaging, and rewarding learning experience where achievements are verifiable and permanent on the blockchain.

## Key Features

- 🎓 **Interactive Course System**
  - Structured learning paths
  - Theory modules with comprehensive content
  - Interactive quizzes with immediate feedback
  - Progress tracking on the blockchain

- 🏆 **Blockchain-Powered Rewards**
  - Earn tokens for completing courses
  - Achievement badges stored on-chain
  - Verifiable certificates of completion
  - Transparent reward distribution

- 👥 **Social Learning Elements**
  - Global leaderboard
  - Message board for community interaction
  - Profile system with achievement display
  - Badge collection showcase

- 🔐 **Web3 Integration**
  - Seamless wallet connection
  - Secure blockchain transactions
  - Network status monitoring
  - APT token balance tracking

## Feature Scope

### Current Features
- Course creation and management
- Interactive quiz system with blockchain verification
- Theory content delivery
- Achievement and badge system
- Certificate generation and verification
- Wallet integration and management
- Message board functionality
- Leaderboard system
- User profiles and progress tracking

### Future Enhancements
- Course creator platform
- Peer-to-peer tutoring
- Advanced analytics dashboard
- Mobile application
- Multi-language support
- Additional blockchain network support

## Technical Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **Blockchain**: Aptos Network
- **Smart Contracts**: Move Language
- **Wallet Integration**: Aptos Wallet Adapter
- **Progressive Web App**: Vite-PWA

## Deployment Information

### Prerequisites
1. Node.js and npm installed
2. Aptos CLI installed
3. Aptos wallet with test tokens (for devnet)

### Environment Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```env
   VITE_MODULE_PUBLISHER_ACCOUNT_ADDRESS=<your_account_address>
   VITE_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY=<your_private_key>
   ```

### Available Commands

The platform uses the [aptos-cli npm package](https://github.com/aptos-labs/aptos-cli) for blockchain interactions. Key commands include:

#### Smart Contract Commands
- `npm run move:compile` - Compile the Move contracts
- `npm run move:test` - Run Move unit tests
- `npm run move:publish` - Publish the Move contracts
- `npm run move:upgrade` - Upgrade existing contracts

#### Frontend Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Deploy to Vercel

For additional CLI commands, run `npx aptos` to see all available options.

## License

Apache-2.0

---

For detailed guides, please refer to:
- [Blockchain Deployment Guide](BLOCKCHAIN_DEPLOYMENT.md)
- [Real Transactions Guide](REAL_TRANSACTIONS.md)
- [Testing Guide](TESTING_GUIDE.md)
![WhatsApp Image 2025-10-02 at 6 44 52 PM](https://github.com/user-attachments/assets/26471995-88f8-49ae-bd7c-c0f99fbcdd5a)
contract address:0x18a7a66a60a68ef407dbab4056cd7ef9eca223915ae84acd8db2b3c4e5fd2574
