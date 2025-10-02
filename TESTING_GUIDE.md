# How to Test Real Aptos Transactions

## 🚀 Complete Step-by-Step Guide

### Step 1: Set Up Petra Wallet
1. **Install Petra Wallet** extension if not already installed
2. **Create or Import** your wallet account
3. **Switch to Devnet** network in Petra wallet settings

### Step 2: Get Test APT Tokens
1. **Copy your wallet address** from Petra wallet
2. **Visit the faucet**: https://faucet.devnet.aptoslabs.com/
3. **Paste your address** and request test APT tokens
4. **Wait for confirmation** (usually takes 10-30 seconds)
5. **Check your wallet** - you should see APT balance

### Step 3: Test the Quiz System
1. **Open the application**: http://localhost:5177
2. **Connect Petra Wallet** (click wallet connect button)
3. **Approve the connection** in Petra wallet popup
4. **Take any quiz** and aim for 100% score
5. **Click "Generate Certificate"** when you get perfect score
6. **Enter your name** for the certificate
7. **Approve the transaction** in Petra wallet popup

### Step 4: Verify Success

#### ✅ What You Should See:

**In the App:**
- ✅ Green success message: "Quiz completion recorded on Aptos blockchain!"
- ✅ "Transaction visible in Petra wallet"
- ✅ Transaction hash displayed
- ✅ "View on Aptos Explorer" link

**In Petra Wallet:**
- ✅ New transaction in history
- ✅ Type: "Function Call" or "Coin Transfer"
- ✅ Amount: -0.00001 APT (plus gas fee)
- ✅ Status: Success

**On Aptos Explorer:**
- ✅ Transaction details page
- ✅ Success status ✅
- ✅ Block number and timestamp
- ✅ Gas used information

### 🔧 Troubleshooting

#### Problem: "Insufficient APT balance"
**Solution:**
- Visit https://faucet.devnet.aptoslabs.com/
- Request test tokens for your address
- Wait for confirmation
- Try transaction again

#### Problem: "Transaction rejected"
**Solution:**
- Make sure you click "Approve" in Petra wallet popup
- Check that you're on Devnet network
- Ensure you have enough APT balance

#### Problem: "Wallet not connected"
**Solution:**
- Click the wallet connect button in the app
- Approve the connection in Petra wallet
- Refresh the page if needed

#### Problem: "signAndSubmitTransaction not available"
**Solution:**
- Make sure Petra wallet is properly connected
- Try disconnecting and reconnecting wallet
- Ensure you're using latest version of Petra wallet

### 🎯 Expected Transaction Details

**Transaction Type:** Coin Transfer
**Function:** 0x1::coin::transfer
**Amount:** 0.00001 APT (1000 Octas)
**Recipient:** Your own address (self-transfer)
**Purpose:** Record quiz achievement on blockchain
**Gas Fee:** ~0.0001 APT
**Total Cost:** ~0.00011 APT

### 📱 Testing Checklist

- [ ] Petra wallet installed and set to Devnet
- [ ] Test APT tokens in wallet (>0.001 APT)
- [ ] Wallet connected to the application
- [ ] Complete quiz with 100% score
- [ ] Generate certificate triggers blockchain transaction
- [ ] Approve transaction in Petra wallet popup
- [ ] Success message appears in app
- [ ] Transaction visible in Petra wallet history
- [ ] Transaction viewable on Aptos Explorer

### 🎉 Success Indicators

When everything works correctly:
1. **App shows**: "Quiz completion recorded on Aptos blockchain!"
2. **Petra wallet**: Shows new transaction with success status
3. **Aptos Explorer**: Shows transaction details with ✅ success
4. **Certificate**: Generated and saved locally
5. **Achievement**: Permanently recorded on blockchain

### 💡 Tips

- **Keep some APT**: Always maintain >0.001 APT for gas fees
- **Check network**: Ensure both app and wallet are on Devnet
- **Be patient**: Transactions usually confirm within 5-10 seconds
- **Try again**: If first transaction fails, check error message and retry

The system is now ready for real Aptos blockchain transactions! 🚀
