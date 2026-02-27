# StellarPay — Simple Payment dApp

A minimal Stellar payment dApp built for **Level 1 (White Belt)** of the Stellar dApp challenge. Connect your Freighter wallet and send XLM on the Stellar testnet in seconds.

---

## 📸 Screenshots

### Wallet Button
![Wallet Connected](./screenshots/wallet.png)<img width="1904" height="862" alt="wallet png" src="https://github.com/user-attachments/assets/13efbfd0-572d-41fd-8511-04d7bcac0307" />


### Wallet Connected & Balance Displayed
![Balance Displayed](./screenshots/connected.png)<img width="1908" height="845" alt="connected png" src="https://github.com/user-attachments/assets/6bb33e1d-200c-48ee-864c-2bcb1c6390f0" />


### Successful Transaction
![Successful Transaction](./screenshots/transaction.png)
<img width="1774" height="860" alt="transaction png" src="https://github.com/user-attachments/assets/bec607ca-24c9-40a6-b32f-6d5416b5e795" />

---

## ✨ Features

- 🔗 **Wallet Connection** — Connect & disconnect Freighter wallet
- 💰 **Balance Display** — Live XLM balance fetched from Stellar Horizon
- 📤 **Send XLM** — Full transaction flow with optional memo
- ✅ **Transaction Feedback** — Success/failure state with transaction hash
- 🔍 **Explorer Link** — View confirmed transactions on stellar.expert

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| @stellar/stellar-sdk | Transaction building & Horizon API |
| @stellar/freighter-api | Wallet connection & signing |

---

## ⚙️ Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Freighter Wallet](https://www.freighter.app/) browser extension
- Freighter set to **Stellar Testnet**

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/simple-payment-dapp.git
cd simple-payment-dapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚀 How to Use

1. **Install Freighter** — Download from [freighter.app](https://www.freighter.app)
2. **Switch to Testnet** — In Freighter settings, select *Test SDF Network / Testnet*
3. **Connect Wallet** — Click **Connect Wallet** in the navbar
4. **Fund your account** — Click **Fund with Friendbot** to receive free test XLM
5. **Send XLM** — Enter a destination address, amount, optional memo, and click **Send XLM**

---

## 📁 Project Structure

```
simple-payment-dapp/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Wallet connect/disconnect, balance display
│   │   ├── PaymentForm.jsx       # Send XLM form with validation
│   │   └── TransactionStatus.jsx # Success/error modal with tx hash
│   ├── utils/
│   │   ├── constants.js          # Network config (Horizon URL, passphrase)
│   │   └── contractABI.json      # Project metadata
│   ├── App.jsx                   # Main app logic & state
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
├── vite.config.js
├── package.json
└── README.md
```

---

## 🌐 Network Details

| Property | Value |
|---|---|
| Network | Stellar Testnet |
| Horizon URL | https://horizon-testnet.stellar.org |
| Friendbot | https://friendbot.stellar.org |
| Explorer | https://stellar.expert/explorer/testnet |

---

## 📋 Level 1 Checklist

- [x] Freighter wallet setup on Stellar Testnet
- [x] Wallet connect functionality
- [x] Wallet disconnect functionality
- [x] Fetch and display XLM balance
- [x] Send XLM transaction on testnet
- [x] Show success/failure feedback
- [x] Display transaction hash with explorer link
- [x] Error handling throughout

---

## 🏗 Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## 📄 License

MIT
