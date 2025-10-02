import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface TheoryChapter {
  id: number;
  title: string;
  content: string[];
  estimatedReadTime: number;
  key_points: string[];
  examples?: string[];
}

interface TheoryProps {
  course: any;
  onCompleteTheory: () => void;
  onBackToCourse: () => void;
}

export default function Theory({ course, onCompleteTheory, onBackToCourse }: TheoryProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);

  const theoryContent: { [key: number]: TheoryChapter[] } = {
    1: [ // Blockchain Fundamentals
      {
        id: 1,
        title: "Complete Blockchain Fundamentals Study Guide",
        estimatedReadTime: 15,
        content: [
          "🔗 BLOCKCHAIN TECHNOLOGY OVERVIEW: Blockchain is a distributed ledger technology that maintains an immutable record of transactions across a network of computers. The main characteristic of blockchain is its immutable ledger - once data is recorded, it cannot be altered without consensus from the network.",
          "🔐 CRYPTOGRAPHIC HASHING & SHA-256: Blockchain uses cryptographic hash functions, primarily SHA-256, which produces a unique 256-bit hash value (64-character hexadecimal string) for any input. SHA-256 demonstrates the avalanche effect - where small changes in input cause dramatic changes in output, making tampering easily detectable.",
          "⛏️ CONSENSUS MECHANISMS: Bitcoin uses Proof of Work (PoW) where miners compete to solve complex mathematical puzzles. The first miner to solve the puzzle gets to add the new block and receives a reward. This process ensures network security and prevents double-spending.",
          "🌐 DECENTRALIZATION PRINCIPLES: Blockchain is decentralized because there's no single point of control. Instead of relying on a central authority like banks or governments, the network is distributed across thousands of nodes worldwide. Each node maintains a complete copy of the blockchain.",
          "📊 KEY CHARACTERISTICS: Immutability (data cannot be changed), Transparency (all transactions are visible), Decentralization (no central authority), Security (cryptographic protection), and Consensus (network agreement on validity).",
          "🏗️ BLOCK STRUCTURE: Each block contains: Block Header (metadata), Previous Block Hash (linking to previous block), Merkle Root (summary of all transactions), Timestamp (when block was created), and Transaction Data (actual transaction records)."
        ],
        key_points: [
          "Immutable ledger - main characteristic preventing data alteration",
          "SHA-256 produces 256-bit hash with avalanche effect",
          "Proof of Work consensus used by Bitcoin for security",
          "Decentralization means no single point of control",
          "Blocks are cryptographically linked creating an unbreakable chain"
        ],
        examples: [
          "Bitcoin's immutable transaction history since 2009",
          "SHA-256 hashing in Bitcoin block creation",
          "Ethereum's transition from PoW to Proof of Stake"
        ]
      },
      {
        id: 2,
        title: "How Blockchain Works",
        estimatedReadTime: 10,
        content: [
          "Understanding how blockchain works requires examining its key components: transactions, blocks, nodes, and consensus mechanisms.",
          "When a transaction occurs, it is broadcast to the network of nodes. Each node validates the transaction using predefined rules. Valid transactions are collected into a block by miners or validators.",
          "The process of creating new blocks varies depending on the consensus mechanism. In Proof of Work (like Bitcoin), miners compete to solve complex mathematical puzzles. The first to solve it gets to add the block to the chain and receives a reward.",
          "Once a block is added, it is distributed across all nodes in the network. Each node updates its copy of the blockchain, ensuring all participants have the same version of the truth.",
          "The cryptographic hashing ensures that if someone tries to alter a transaction in an old block, the hash would change, immediately alerting the network to the tampering attempt."
        ],
        key_points: [
          "Transactions are validated by network nodes",
          "Blocks are created through consensus mechanisms",
          "New blocks are distributed to all network participants",
          "Cryptographic hashing prevents tampering"
        ],
        examples: [
          "A Bitcoin transaction being confirmed by miners",
          "Ethereum smart contract execution",
          "Hyperledger Fabric for enterprise applications"
        ]
      },
      {
        id: 3,
        title: "Types of Blockchain Networks",
        estimatedReadTime: 6,
        content: [
          "Blockchain networks can be categorized into three main types: public, private, and consortium (hybrid) blockchains, each serving different purposes and use cases.",
          "Public blockchains are completely open and decentralized. Anyone can join the network, participate in consensus, and access all data. Bitcoin and Ethereum are prime examples. They offer maximum transparency and decentralization but can be slower and consume more energy.",
          "Private blockchains are restricted to specific organizations or groups. They offer more control, privacy, and efficiency but sacrifice some decentralization benefits. They're commonly used in enterprise settings.",
          "Consortium blockchains strike a balance between public and private networks. They're controlled by a group of known organizations, offering more efficiency than public chains while maintaining some decentralization."
        ],
        key_points: [
          "Public blockchains are open to everyone",
          "Private blockchains are restricted and controlled",
          "Consortium blockchains are semi-decentralized",
          "Each type serves different use cases"
        ],
        examples: [
          "Bitcoin (Public blockchain)",
          "JPMorgan's JPM Coin (Private blockchain)",
          "R3 Corda (Consortium blockchain)"
        ]
      }
    ],
    2: [ // Smart Contract Development
      {
        id: 1,
        title: "Smart Contract Development Complete Guide",
        estimatedReadTime: 18,
        content: [
          "📜 SMART CONTRACTS DEFINITION: Smart contracts are self-executing contracts with terms directly written into code. Unlike legal documents or email agreements, they automatically execute when predetermined conditions are met, eliminating the need for intermediaries.",
          "💻 SOLIDITY PROGRAMMING: Solidity is the primary programming language designed specifically for writing smart contracts on Ethereum. It's statically typed, contract-oriented, and influenced by C++, Python, and JavaScript. Solidity compiles to EVM bytecode.",
          "🔓 VISIBILITY MODIFIERS: The 'public' visibility modifier makes functions accessible from anywhere - both internally within the contract and externally from other contracts or transactions. Other modifiers include 'private' (only within contract), 'internal' (contract + inherited), and 'external' (only external calls).",
          "⛽ GAS MECHANISM: Gas is the computational fee required to execute operations on the Ethereum network. Every operation (storage, computation, transaction) costs gas. Users pay gas fees in ETH to miners/validators for processing their transactions.",
          "🔒 IMMUTABILITY CONCEPT: Once deployed to the blockchain, smart contracts are immutable - they cannot be changed, updated, or deleted. This ensures trust and reliability but requires careful development and testing before deployment.",
          "🏗️ CONTRACT STRUCTURE: Smart contracts contain: State variables (store data), Functions (executable code), Modifiers (reusable code for access control), Events (logging mechanisms), and Constructor (initialization code run once at deployment).",
          "🛡️ SECURITY CONSIDERATIONS: Common vulnerabilities include reentrancy attacks, integer overflow/underflow, access control failures, and unchecked external calls. Always use established libraries like OpenZeppelin for secure implementations."
        ],
        key_points: [
          "Self-executing contracts with terms written in code",
          "Solidity is the primary Ethereum smart contract language",
          "'Public' visibility allows access from anywhere",
          "Gas is computational fee for Ethereum operations",
          "Immutable means cannot be changed once deployed"
        ],
        examples: [
          "ERC-20 token contracts for cryptocurrencies",
          "Multi-signature wallets for secure fund management",
          "Decentralized exchanges like Uniswap"
        ]
      },
      {
        id: 2,
        title: "Solidity Programming Language",
        estimatedReadTime: 15,
        content: [
          "Solidity is the primary programming language for writing smart contracts on the Ethereum blockchain. It's a statically-typed, contract-oriented language influenced by C++, Python, and JavaScript.",
          "Solidity was developed specifically for the Ethereum Virtual Machine (EVM) and is designed to target this runtime environment. The language includes features that make it suitable for writing secure and efficient smart contracts.",
          "Key features of Solidity include: state variables for storing data, functions for executing logic, modifiers for adding common checks, events for logging and communication, and inheritance for code reuse.",
          "The language supports various data types including integers, booleans, strings, arrays, mappings (similar to hash tables), and user-defined structures. It also has address types specific to blockchain interactions.",
          "Security is paramount in smart contract development. Common vulnerabilities include reentrancy attacks, integer overflow/underflow, and access control issues. Solidity has evolved to include built-in protections against many of these issues.",
          "The development process typically involves writing contracts in Solidity, compiling them to bytecode, testing on local networks, and then deploying to mainnet or testnets."
        ],
        key_points: [
          "Primary language for Ethereum smart contracts",
          "Statically-typed and contract-oriented",
          "Includes security features and protections",
          "Supports complex data types and structures",
          "Compiles to EVM bytecode"
        ],
        examples: [
          "ERC-20 token contracts",
          "Multisig wallet implementations",
          "Automated market maker (AMM) contracts"
        ]
      },
      {
        id: 3,
        title: "Smart Contract Security",
        estimatedReadTime: 10,
        content: [
          "Security in smart contract development is crucial because contracts are immutable once deployed and often handle significant financial value. A single vulnerability can lead to catastrophic losses.",
          "Common security vulnerabilities include reentrancy attacks (where external calls can recursively call back into the contract), integer overflow/underflow (though largely mitigated in newer Solidity versions), and access control failures.",
          "Best practices for secure development include: following the checks-effects-interactions pattern, using established libraries like OpenZeppelin, implementing proper access controls, and extensive testing.",
          "Code audits by security experts are essential for contracts handling significant value. Multiple independent audits can catch different types of vulnerabilities and provide confidence in the contract's security.",
          "Formal verification methods are increasingly used to mathematically prove that contracts behave correctly under all possible conditions. This provides the highest level of assurance but requires specialized expertise."
        ],
        key_points: [
          "Immutability makes security critical",
          "Common vulnerabilities must be understood and avoided",
          "Follow established best practices and patterns",
          "Professional audits are essential for high-value contracts",
          "Formal verification provides mathematical assurance"
        ],
        examples: [
          "The DAO hack of 2016 due to reentrancy",
          "OpenZeppelin's secure contract templates",
          "MakerDAO's extensive audit process"
        ]
      }
    ],
    3: [ // DeFi Protocols Deep Dive
      {
        id: 1,
        title: "DeFi Protocols Complete Study Guide",
        estimatedReadTime: 20,
        content: [
          "🏦 DECENTRALIZED FINANCE (DeFi): DeFi stands for Decentralized Finance - a revolutionary approach to financial services built on blockchain without traditional intermediaries like banks, brokers, or exchanges. It recreates traditional financial systems using smart contracts.",
          "🤖 AUTOMATED MARKET MAKERS (AMM): An AMM is an algorithm that automatically prices trades based on mathematical formulas and liquidity pools, rather than traditional order books. It enables continuous liquidity and permissionless trading of any token pairs.",
          "🔢 CONSTANT PRODUCT FORMULA: The formula x * y = k (where x and y are token quantities, k is constant) is used by AMMs like Uniswap to determine token prices. When someone trades, the product remains constant but individual token amounts change, affecting price.",
          "📉 IMPERMANENT LOSS: This is the risk faced by liquidity providers when token prices in a pool diverge from their initial ratio. If prices change significantly, LPs might end up with less value than if they simply held the tokens separately.",
          "🌾 YIELD FARMING: The practice of strategically moving funds between different DeFi protocols to maximize returns through various reward mechanisms like liquidity mining, staking rewards, and governance token distributions.",
          "💧 LIQUIDITY POOLS: These are smart contracts containing pairs of tokens that enable trading. Users deposit equal values of two tokens to provide liquidity and earn fees from trades, plus often additional token rewards.",
          "🔄 KEY DeFi PROTOCOLS: Uniswap (AMM trading), Compound (lending/borrowing), Aave (flash loans), MakerDAO (DAI stablecoin), Curve (stablecoin trading), and Yearn Finance (yield optimization)."
        ],
        key_points: [
          "DeFi = Decentralized Finance without traditional intermediaries",
          "AMM uses algorithms for automatic trade pricing",
          "Constant product formula (x * y = k) determines AMM prices",
          "Impermanent loss is risk for liquidity providers",
          "Yield farming maximizes returns across DeFi protocols"
        ],
        examples: [
          "Uniswap's automated token trading without order books",
          "Compound's algorithmic lending and borrowing rates",
          "Yearn Finance's automated yield optimization strategies"
        ]
      },
      {
        id: 2,
        title: "Automated Market Makers (AMMs)",
        estimatedReadTime: 14,
        content: [
          "Automated Market Makers (AMMs) are a type of decentralized exchange protocol that relies on mathematical formulas to price assets, rather than traditional order books used in centralized exchanges.",
          "The most common AMM model uses the constant product formula (x * y = k), where x and y represent the quantities of two tokens in a liquidity pool, and k is a constant. This ensures that the product remains constant after each trade.",
          "Liquidity providers deposit equal values of two tokens into pools and earn fees from trades that occur in their pool. They receive liquidity pool (LP) tokens representing their share of the pool, which can be redeemed later.",
          "AMMs enable continuous liquidity and allow trading of any ERC-20 token pair, as long as someone has created a pool and provided liquidity. This creates a truly permissionless trading environment.",
          "However, liquidity providers face impermanent loss - the opportunity cost of providing liquidity compared to simply holding the tokens. This occurs when the price ratio of pooled tokens changes significantly.",
          "Advanced AMM designs include curve pools (optimized for similar-priced assets like stablecoins), concentrated liquidity (allowing liquidity providers to specify price ranges), and multi-asset pools."
        ],
        key_points: [
          "Mathematical formulas determine asset prices",
          "Constant product formula is most common",
          "Liquidity providers earn fees but face impermanent loss",
          "Enables permissionless token trading",
          "Continuous innovation in AMM designs"
        ],
        examples: [
          "Uniswap's constant product AMM",
          "Curve's stablecoin-optimized pools",
          "Balancer's weighted multi-asset pools"
        ]
      },
      {
        id: 3,
        title: "Yield Farming and Liquidity Mining",
        estimatedReadTime: 10,
        content: [
          "Yield farming is the practice of lending or staking cryptocurrency tokens to receive rewards in the form of additional tokens. It's become a cornerstone of the DeFi ecosystem, allowing users to earn returns on their crypto holdings.",
          "The process typically involves providing liquidity to decentralized protocols in exchange for rewards. These rewards often come in the form of governance tokens, which can provide voting rights in protocol decisions and potentially appreciate in value.",
          "Liquidity mining specifically refers to earning rewards by providing liquidity to AMM pools. Users deposit tokens into liquidity pools and receive LP tokens plus additional rewards, often paid in the platform's native token.",
          "Yield farming strategies can be complex, involving multiple protocols and tokens. Advanced farmers might use strategies like: leveraging positions, auto-compounding rewards, or rotating between different pools to maximize returns.",
          "Risks include smart contract vulnerabilities, impermanent loss, token price volatility, and 'rug pulls' where project teams abandon projects with user funds. High yields often indicate higher risks.",
          "The practice has driven innovation in DeFi, creating new financial primitives and incentivizing rapid protocol adoption, though it has also led to unsustainable token emissions in some cases."
        ],
        key_points: [
          "Earning rewards by providing liquidity to protocols",
          "Often paid in governance tokens",
          "Can involve complex multi-protocol strategies",
          "Higher yields typically mean higher risks",
          "Has driven significant DeFi innovation and adoption"
        ],
        examples: [
          "Compound's COMP token distribution",
          "Uniswap's UNI liquidity mining program",
          "Yearn Finance's automated yield strategies"
        ]
      }
    ],
    4: [ // NFT Marketplace Creation
      {
        id: 1,
        title: "NFT Marketplace Development Complete Guide",
        estimatedReadTime: 16,
        content: [
          "🖼️ NON-FUNGIBLE TOKENS (NFT): NFT stands for Non-Fungible Token - a unique digital asset that cannot be replicated or divided. Unlike cryptocurrencies which are fungible (interchangeable), each NFT has distinct properties making it irreplaceable and valuable for digital ownership.",
          "📄 ERC-721 STANDARD: ERC-721 is the first and most common standard for NFTs on the Ethereum blockchain. It defines the interface for non-fungible tokens, ensuring each token has a unique identifier and belongs to exactly one owner at any time.",
          "✨ NFT UNIQUENESS: What makes NFTs unique is that each token has distinct properties stored in its metadata - including name, description, image, attributes, and rarity. No two NFTs are identical, even if they appear similar.",
          "🌐 METADATA STORAGE: NFT metadata is typically stored on IPFS (InterPlanetary File System) for decentralized and permanent storage. This ensures the data remains accessible even if centralized servers go down. Some projects store metadata directly on-chain for maximum permanence.",
          "🔗 tokenURI FUNCTION: In ERC-721 contracts, the tokenURI function returns the URI pointing to the token's metadata JSON file. This metadata contains all information about the NFT including its image, attributes, and description.",
          "🏪 MARKETPLACE MECHANICS: NFT marketplaces facilitate buying, selling, and trading of NFTs. They handle listing management, payment processing, royalty distribution, and transfer of ownership through smart contract interactions.",
          "💎 USE CASES: Digital art collections, gaming assets, virtual real estate, music albums, sports collectibles, domain names, membership tokens, and certificates of authenticity."
        ],
        key_points: [
          "NFT = Non-Fungible Token (unique digital assets)",
          "ERC-721 is the standard NFT interface on Ethereum",
          "Each NFT has distinct properties making it unique",
          "IPFS provides decentralized metadata storage",
          "tokenURI function returns metadata location"
        ],
        examples: [
          "CryptoPunks - first major NFT collection",
          "OpenSea marketplace for trading NFTs",
          "Bored Ape Yacht Club with utility benefits"
        ]
      },
      {
        id: 2,
        title: "NFT Standards and Technical Implementation",
        estimatedReadTime: 12,
        content: [
          "The ERC-721 standard was the first widely adopted standard for NFTs on Ethereum. It defines a minimum interface that smart contracts must implement to allow NFTs to be managed, owned, and traded. Every ERC-721 token has a unique identifier and belongs to exactly one owner at any time.",
          "ERC-1155 is a more advanced standard that allows for both fungible and non-fungible tokens within the same contract. This multi-token standard is more gas-efficient and flexible, enabling batch operations and reducing transaction costs.",
          "The technical implementation of NFTs involves several key components: the smart contract that manages ownership and transfers, the token ID that uniquely identifies each NFT, and the metadata that describes the token's properties and linked content.",
          "Metadata storage is a crucial consideration. On-chain storage is more expensive but ensures permanence and immutability. Off-chain storage using IPFS (InterPlanetary File System) provides a decentralized alternative that's more cost-effective for large files while maintaining content addressing.",
          "Smart contract functions include minting (creating new NFTs), transferring ownership, approving third parties to transfer tokens, and querying token information. Additional features might include royalty mechanisms, access controls, and upgrade patterns.",
          "Gas optimization is important for NFT contracts, especially for collections with many tokens. Techniques include batch operations, efficient data structures, and careful consideration of storage patterns."
        ],
        key_points: [
          "ERC-721 and ERC-1155 are primary NFT standards",
          "Smart contracts manage ownership and transfers",
          "Metadata can be stored on-chain or off-chain",
          "IPFS provides decentralized metadata storage",
          "Gas optimization important for large collections"
        ],
        examples: [
          "OpenZeppelin's ERC-721 implementation",
          "Enjin's ERC-1155 gaming tokens",
          "Art Blocks' generative art platform"
        ]
      },
      {
        id: 3,
        title: "NFT Use Cases and Future Applications",
        estimatedReadTime: 8,
        content: [
          "While digital art and collectibles dominate current NFT discourse, the technology has far broader applications across industries. Gaming is emerging as a major use case, with NFTs representing in-game assets, characters, and virtual real estate that players can truly own and trade.",
          "Utility NFTs go beyond collectible value by providing access to services, communities, or experiences. These might include membership tokens, event tickets, certification credentials, or access keys to exclusive content and communities.",
          "In the music industry, NFTs enable new models for artist-fan relationships, allowing musicians to sell unique experiences, unreleased tracks, or concert access directly to fans while retaining more control over their work and revenue streams.",
          "Real-world asset tokenization through NFTs could revolutionize property rights, making it easier to trade fractional ownership in real estate, luxury goods, or intellectual property. This could increase liquidity for traditionally illiquid assets.",
          "Identity and credential verification represent another promising application, where NFTs could serve as tamper-proof digital certificates for education, professional qualifications, or personal identity, reducing fraud and simplifying verification processes.",
          "The future may see NFTs integrated with IoT devices, representing ownership and control of physical objects, or used in complex DeFi protocols as collateral or components of more sophisticated financial instruments."
        ],
        key_points: [
          "Gaming assets and virtual world ownership",
          "Utility tokens providing access and services",
          "New monetization models for creators",
          "Tokenization of real-world assets",
          "Digital identity and credential systems"
        ],
        examples: [
          "Axie Infinity gaming NFTs",
          "Bored Ape Yacht Club membership utilities",
          "Mirror's writing NFT platform"
        ]
      }
    ]
  };

  const currentChapters = theoryContent[course.id] || [];
  const currentChapter = currentChapters[currentChapterIndex];
  const progress = ((currentChapterIndex + 1) / currentChapters.length) * 100;

  const nextChapter = () => {
    if (currentChapterIndex < currentChapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      setReadingProgress(0);
    }
  };

  const previousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      setReadingProgress(0);
    }
  };

  const simulateReadingProgress = () => {
    const interval = setInterval(() => {
      setReadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 0.5; // Simulated reading progress
      });
    }, 100);

    return () => clearInterval(interval);
  };

  useState(() => {
    const cleanup = simulateReadingProgress();
    return cleanup;
  });

  if (!currentChapter) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-white mb-4">Theory Content Coming Soon</h2>
              <p className="text-gray-300 mb-6">
                We're preparing comprehensive theory material for this course.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={onBackToCourse} className="bg-white/10 hover:bg-white/20 text-white">
                  ← Back to Course
                </Button>
                <Button onClick={onCompleteTheory} className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black">
                  Skip to Quiz →
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={onBackToCourse}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              ← Back to Course
            </Button>
            <div className="text-white text-center">
              <div className="font-semibold">{course.title}</div>
              <div className="text-sm text-gray-400">
                Chapter {currentChapterIndex + 1} of {currentChapters.length}
              </div>
            </div>
            <div className="text-white text-right">
              <div className="text-sm">⏱️ {currentChapter.estimatedReadTime} min read</div>
            </div>
          </div>
          <Progress value={progress} className="mb-4" />
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-white mb-4">
              📖 {currentChapter.title}
            </CardTitle>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-sm text-gray-400 mb-2">Reading Progress</div>
              <Progress value={readingProgress} className="mb-2" />
              <div className="text-xs text-gray-500">{Math.round(readingProgress)}% completed</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentChapterIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Main Content */}
                <div className="space-y-4">
                  {currentChapter.content.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-gray-300 leading-relaxed text-lg"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>

                {/* Key Points */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
                  <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                    💡 Key Points
                  </h3>
                  <ul className="space-y-2">
                    {currentChapter.key_points.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-blue-300 flex items-start"
                      >
                        <span className="text-yellow-400 mr-2">•</span>
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Examples */}
                {currentChapter.examples && (
                  <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
                    <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                      🎯 Real-World Examples
                    </h3>
                    <ul className="space-y-2">
                      {currentChapter.examples.map((example, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          className="text-green-300 flex items-start"
                        >
                          <span className="text-orange-400 mr-2">→</span>
                          {example}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8">
              <Button
                onClick={previousChapter}
                disabled={currentChapterIndex === 0}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 disabled:opacity-50"
              >
                ← Previous Chapter
              </Button>

              <div className="flex gap-2">
                {currentChapters.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentChapterIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentChapterIndex
                        ? 'bg-yellow-400'
                        : index < currentChapterIndex
                        ? 'bg-green-400'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>

              {currentChapterIndex === currentChapters.length - 1 ? (
                <Button
                  onClick={onCompleteTheory}
                  className="bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-semibold"
                >
                  Complete Theory & Start Quiz 🚀
                </Button>
              ) : (
                <Button
                  onClick={nextChapter}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold"
                >
                  Next Chapter →
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Course Progress Summary */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Course Progress</span>
              <span className="text-white">{Math.round(progress)}% Theory Complete</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
