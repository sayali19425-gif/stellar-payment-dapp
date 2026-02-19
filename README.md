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
- Vite
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

##  Screenshots
### 🔹 Wallet Connected
![Wallet Connected](wallet-connected.png)
<img width="1917" height="955" alt="wallet-connected png" src="https://github.com/user-attachments/assets/467382f3-1870-4aad-aaf0-0d33ce02ec44" />

### 🔹 Balance Displayed
![Balance Displayed](balance-displayed.png)
<img width="950" height="909" alt="balance-displayed png" src="https://github.com/user-attachments/assets/23dbc9e6-c00d-4284-aaf0-3934bd90e5b1" />

### 🔹 Transaction Result Displayed
![Transaction Result](transaction-result.png)
<img width="1915" height="928" alt="transaction-result png" src="https://github.com/user-attachments/assets/5a7f7d94-8e9f-420f-885f-1d9f166e6042" />


##  Project Structure

stellar-dapp/
│
├── public/
├── src/
│ ├── main.js
│ ├── counter.js
│ ├── style.css
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
---

##  Installation & Setup

### 1️. Clone the Repository
### 2️. Open the Project Folder
    cd stellar-dapp

### 3️. Install Dependencies
    npm install

### 4️. Run the Development Server
    npm run dev

### 5️. Open in Browser
Open the URL shown in terminal (usually):
    http://localhost:5173

---

##  Requirements

- Node.js installed
- Freighter Wallet extension installed in browser
- Stellar Testnet account funded with test XLM

---

##  Network Configuration

This project uses:

- Stellar Testnet
- Horizon Testnet API

Environment variables are stored in `.env` file:

NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

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
Developed as part of learning and academic practice in Web3 and Blockchain development.

Sayali  
Web3 & Blockchain Learner
