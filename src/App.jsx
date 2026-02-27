import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import PaymentForm from "./components/PaymentForm";
import TransactionStatus from "./components/TransactionStatus";
import { NETWORK_PASSPHRASE, HORIZON_URL } from "./utils/constants";
import * as StellarSdk from "@stellar/stellar-sdk";
import {
  isConnected,
  isAllowed,
  setAllowed,
  getPublicKey,
  getNetwork,
  signTransaction,
} from "@stellar/freighter-api";

// ─── App ───────────────────────────────────────────────────────
export default function App() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [connectLoading, setConnectLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null); // null | 'pending' | 'success' | 'error'
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState(null);
  const [freighterAvailable, setFreighterAvailable] = useState(true);

  // Check if Freighter is installed
  useEffect(() => {
    const check = async () => {
      try {
        const result = await isConnected();
        // result is either a boolean or { isConnected: boolean } depending on version
        const available = result === true || result?.isConnected === true;
        setFreighterAvailable(available);
      } catch {
        setFreighterAvailable(false);
      }
    };
    check();
  }, []);

  // Fetch balance
  const fetchBalance = useCallback(async (pk) => {
    try {
      const server = new StellarSdk.Horizon.Server(HORIZON_URL);
      const account = await server.loadAccount(pk);
      const xlmBalance = account.balances.find((b) => b.asset_type === "native");
      setBalance(xlmBalance ? xlmBalance.balance : "0");
    } catch (err) {
      console.error("Balance fetch error:", err);
      setBalance("0");
    }
  }, []);

  // Connect wallet
  const handleConnect = async () => {
    setConnectLoading(true);
    try {
      // Check if Freighter is installed
      const connected = await isConnected();
      const freighterInstalled = connected === true || connected?.isConnected === true;
      if (!freighterInstalled) {
        alert("Freighter wallet not detected!\n\nPlease install the Freighter browser extension from freighter.app and refresh the page.");
        setConnectLoading(false);
        return;
      }

      // Request access if not already allowed
      const allowed = await isAllowed();
      const alreadyAllowed = allowed === true || allowed?.isAllowed === true;
      if (!alreadyAllowed) {
        await setAllowed();
      }

      // Get public key
      const pkResult = await getPublicKey();
      const pk = typeof pkResult === "string" ? pkResult : pkResult?.publicKey;
      if (!pk) throw new Error("Could not retrieve public key from Freighter.");

      // Check network
      const networkResult = await getNetwork();
      const network = typeof networkResult === "string" ? networkResult : networkResult?.network;
      if (network && !network.toLowerCase().includes("test")) {
        alert("Please switch Freighter to the Stellar Testnet and try again.\n\nIn Freighter: click the network name at top → select 'Test SDF Network'");
        setConnectLoading(false);
        return;
      }

      setPublicKey(pk);
      setConnected(true);
      setFreighterAvailable(true);
      await fetchBalance(pk);
    } catch (err) {
      console.error("Connect error:", err);
      alert(`Connection failed: ${err.message}`);
    } finally {
      setConnectLoading(false);
    }
  };

  // Disconnect wallet
  const handleDisconnect = () => {
    setConnected(false);
    setPublicKey(null);
    setBalance(null);
  };

  // Send transaction
  const handleSend = async ({ destination, amount, memo }) => {
    if (!publicKey) return;

    setTxLoading(true);
    setTxStatus("pending");
    setTxHash(null);
    setTxError(null);

    try {
      const server = new StellarSdk.Horizon.Server(HORIZON_URL);
      const sourceAccount = await server.loadAccount(publicKey);

      const txBuilder = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      txBuilder.addOperation(
        StellarSdk.Operation.payment({
          destination,
          asset: StellarSdk.Asset.native(),
          amount: amount.toString(),
        })
      );

      if (memo && memo.trim()) {
        txBuilder.addMemo(StellarSdk.Memo.text(memo.trim()));
      }

      const tx = txBuilder.setTimeout(30).build();
      const txXDR = tx.toXDR();

      // Sign with Freighter
      const signResult = await signTransaction(txXDR, {
        networkPassphrase: NETWORK_PASSPHRASE,
      });

      // Handle both old and new Freighter API response shapes
      const signedTransaction =
        typeof signResult === "string"
          ? signResult
          : signResult?.signedTransaction;

      if (!signedTransaction) throw new Error("Transaction signing failed or was cancelled.");

      // Submit to Horizon
      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedTransaction,
        NETWORK_PASSPHRASE
      );
      const result = await server.submitTransaction(signedTx);

      setTxHash(result.hash);
      setTxStatus("success");
      await fetchBalance(publicKey);
    } catch (err) {
      console.error("Transaction error:", err);
      let msg = err.message || "Transaction failed";
      if (err.response?.data?.extras?.result_codes) {
        const codes = err.response.data.extras.result_codes;
        msg = `Transaction error: ${JSON.stringify(codes)}`;
      }
      if (msg.toLowerCase().includes("declined") || msg.toLowerCase().includes("cancelled")) {
        msg = "Transaction was cancelled by user.";
      }
      setTxError(msg);
      setTxStatus("error");
    } finally {
      setTxLoading(false);
    }
  };

  const handleCloseTx = () => {
    setTxStatus(null);
    setTxHash(null);
    setTxError(null);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar
        connected={connected}
        publicKey={publicKey}
        balance={balance}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        loading={connectLoading}
      />

      <main style={styles.main}>
        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            Live on Stellar Testnet
          </div>
          <h1 style={styles.heroTitle}>
            Send XLM
            <br />
            <span style={styles.heroAccent}>Instantly</span>
          </h1>
          <p style={styles.heroSubtitle}>
            A minimal Stellar payment dApp. Connect your Freighter wallet
            and send XLM on the testnet in seconds.
          </p>
        </div>

        {/* Main Grid */}
        <div style={styles.grid}>
          {/* Payment Form */}
          <div style={styles.formCol}>
            <PaymentForm
              onSend={handleSend}
              loading={txLoading}
              connected={connected}
              balance={balance}
            />
          </div>

          {/* Side info */}
          <div style={styles.sideCol}>
            {/* Wallet Status Card */}
            <div style={styles.infoCard}>
              <div style={styles.infoCardHeader}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                  <rect x="3" y="6" width="18" height="13" rx="2" stroke="#63b3ed" strokeWidth="2"/>
                  <path d="M3 10H21" stroke="#63b3ed" strokeWidth="2"/>
                  <circle cx="17" cy="15" r="1" fill="#63b3ed"/>
                </svg>
                Wallet Status
              </div>
              <div style={styles.statusRow}>
                <span style={styles.statusKey}>Network</span>
                <span style={{ ...styles.statusValue, color: "#76e4f7" }}>Testnet</span>
              </div>
              <div style={styles.statusRow}>
                <span style={styles.statusKey}>Status</span>
                <span style={{ ...styles.statusValue, color: connected ? "#68d391" : "#fc8181" }}>
                  {connected ? "● Connected" : "○ Disconnected"}
                </span>
              </div>
              {publicKey && (
                <div style={styles.statusRow}>
                  <span style={styles.statusKey}>Address</span>
                  <span style={{ ...styles.statusValue, color: "#a0aec0", fontSize: 11 }}>
                    {publicKey.slice(0, 6)}...{publicKey.slice(-6)}
                  </span>
                </div>
              )}
              {balance !== null && (
                <div style={styles.statusRow}>
                  <span style={styles.statusKey}>XLM Balance</span>
                  <span style={{ ...styles.statusValue, color: "#63b3ed" }}>
                    {parseFloat(balance).toFixed(4)}
                  </span>
                </div>
              )}
            </div>

            {/* Friendbot link */}
            {connected && (
              <a
                href={`https://friendbot.stellar.org?addr=${publicKey}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.friendbotBtn}
                onClick={() => setTimeout(() => fetchBalance(publicKey), 3000)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Fund with Friendbot (Free Test XLM)
              </a>
            )}

            {/* Freighter not found */}
            {!freighterAvailable && (
              <div style={styles.warningCard}>
                <p style={styles.warningTitle}>⚠️ Freighter Not Detected</p>
                <p style={styles.warningText}>
                  Install the{" "}
                  <a href="https://www.freighter.app" target="_blank" rel="noopener noreferrer" style={{ color: "#f6ad55" }}>
                    Freighter wallet extension
                  </a>{" "}
                  and refresh this page.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Transaction Modal */}
      {txStatus && (
        <TransactionStatus
          status={txStatus}
          hash={txHash}
          error={txError}
          onClose={txStatus !== "pending" ? handleCloseTx : undefined}
        />
      )}
    </div>
  );
}

const styles = {
  main: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "40px 24px 80px",
  },
  hero: {
    textAlign: "center",
    marginBottom: 48,
    animation: "fadeUp 0.6s ease",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(104, 211, 145, 0.08)",
    border: "1px solid rgba(104, 211, 145, 0.2)",
    borderRadius: 20,
    padding: "5px 14px",
    fontFamily: "'Space Mono', monospace",
    fontSize: 11,
    color: "#68d391",
    letterSpacing: "0.05em",
    marginBottom: 20,
  },
  heroBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#68d391",
    boxShadow: "0 0 6px rgba(104,211,145,0.8)",
    display: "inline-block",
  },
  heroTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "clamp(36px, 6vw, 56px)",
    fontWeight: 700,
    color: "#e2e8f0",
    lineHeight: 1.1,
    marginBottom: 16,
    letterSpacing: "-1px",
  },
  heroAccent: {
    background: "linear-gradient(135deg, #63b3ed, #76e4f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSubtitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 16,
    color: "#718096",
    maxWidth: 440,
    margin: "0 auto",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 24,
    alignItems: "start",
  },
  formCol: {
    animation: "fadeUp 0.5s ease 0.1s both",
  },
  sideCol: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    animation: "fadeUp 0.5s ease 0.2s both",
  },
  infoCard: {
    background: "#0e1520",
    border: "1px solid rgba(99, 179, 237, 0.12)",
    borderRadius: 16,
    padding: "18px 20px",
  },
  infoCardHeader: {
    display: "flex",
    alignItems: "center",
    fontFamily: "'Sora', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#a0aec0",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: "1px solid rgba(99, 179, 237, 0.08)",
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusKey: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 11,
    color: "#4a5568",
    letterSpacing: "0.05em",
  },
  statusValue: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 12,
    fontWeight: 700,
  },
  friendbotBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(104, 211, 145, 0.08)",
    border: "1px solid rgba(104, 211, 145, 0.25)",
    borderRadius: 12,
    padding: "12px",
    fontFamily: "'Sora', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#68d391",
    textDecoration: "none",
    transition: "all 0.2s",
  },
  warningCard: {
    background: "rgba(246, 173, 85, 0.06)",
    border: "1px solid rgba(246, 173, 85, 0.2)",
    borderRadius: 12,
    padding: "14px 16px",
  },
  warningTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#f6ad55",
    marginBottom: 4,
  },
  warningText: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 12,
    color: "#a0aec0",
    lineHeight: 1.5,
  },
};
