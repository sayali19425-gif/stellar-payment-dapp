#  Stellar Testnet Payment DApp

##  Project Overview

This is a simple decentralized application (DApp) built using Stellar Testnet.  
The application allows users to:

- Connect their Freighter Wallet
- View wallet address
- Check XLM balance
- Send XLM to another wallet
- Get transaction success or failure message

This project demonstrates basic blockchain payment functionality using Stellar SDK.

---

##  Technologies Used

- HTML
- JavaScript (ES6)
- Stellar SDK
- Freighter Wallet API
- Stellar Testnet
- Horizon Server

---

##  Why Stellar?

Stellar is a fast and low-cost blockchain network used for digital payments.

I used:
- Stellar Testnet (for testing transactions)
- Horizon Server (to communicate with blockchain)

Horizon URL:
https://horizon-testnet.stellar.org

---

##  Features of the Application

### 1️ Connect Wallet
- Connects Freighter Wallet extension
- Fetches public key (wallet address)
- Loads account details from Horizon server
- Displays XLM balance

### 2️ Send XLM
- User enters destination address
- User enters amount
- Transaction is created using Stellar SDK
- Transaction is signed using Freighter
- Transaction is submitted to Stellar network
- Shows success or failure message

### 3️ Disconnect Wallet
- Clears wallet information from UI

---

##  How Transaction Works (Flow)

1. User connects wallet
2. App loads account from Horizon
3. User enters destination and amount
4. TransactionBuilder creates transaction
5. Freighter signs transaction
6. Transaction submitted to Testnet
7. Result message displayed

---

##  Project Structure

stellar-payment-dapp/
│
├── index.html
└── src/
    └── main.js


---

##  How To Run This Project

1. Clone the repository
2. Install dependencies using:
   npm install
3. Run using local server (Vite or Live Server)
4. Install Freighter Wallet extension
5. Make sure wallet is connected to Testnet
6. Ensure account has test XLM

---

##  Learning Outcome

Through this project I learned:

- How blockchain payments work
- How to build and sign transactions
- How to connect wallet using Freighter API
- How to use Stellar SDK
- How decentralized apps interact with blockchain

---

##  Author

Sayali  
Web3 & Blockchain Learner
