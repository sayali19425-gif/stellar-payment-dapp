import React from "react";

const Navbar = ({ connected, publicKey, balance, onConnect, onDisconnect, loading }) => {
  const shortKey = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : null;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#63b3ed" strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="#63b3ed" strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#76e4f7" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={styles.logoText}>StellarPay</span>
          <span style={styles.networkBadge}>TESTNET</span>
        </div>

        {/* Right side */}
        <div style={styles.right}>
          {connected && balance !== null && (
            <div style={styles.balanceChip}>
              <span style={styles.balanceLabel}>Balance</span>
              <span style={styles.balanceValue}>{parseFloat(balance).toFixed(2)} XLM</span>
            </div>
          )}

          {connected ? (
            <div style={styles.connectedGroup}>
              <div style={styles.walletAddress}>
                <div style={styles.dot} />
                <span style={styles.addressText}>{shortKey}</span>
              </div>
              <button style={styles.disconnectBtn} onClick={onDisconnect}>
                Disconnect
              </button>
            </div>
          ) : (
            <button
              style={{ ...styles.connectBtn, opacity: loading ? 0.7 : 1 }}
              onClick={onConnect}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} />
                  Connecting...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
                    <rect x="3" y="6" width="18" height="13" rx="2" stroke="#080c14" strokeWidth="2" />
                    <path d="M3 10H21" stroke="#080c14" strokeWidth="2" />
                    <circle cx="17" cy="15" r="1" fill="#080c14" />
                  </svg>
                  Connect Wallet
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    borderBottom: "1px solid rgba(99, 179, 237, 0.1)",
    background: "rgba(8, 12, 20, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  },
  inner: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "0 24px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoIcon: {
    width: 36,
    height: 36,
    background: "rgba(99, 179, 237, 0.1)",
    border: "1px solid rgba(99, 179, 237, 0.25)",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 16,
    fontWeight: 700,
    color: "#e2e8f0",
    letterSpacing: "-0.5px",
  },
  networkBadge: {
    fontSize: 9,
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "#76e4f7",
    background: "rgba(118, 228, 247, 0.1)",
    border: "1px solid rgba(118, 228, 247, 0.25)",
    padding: "2px 7px",
    borderRadius: 4,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  balanceChip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(99, 179, 237, 0.08)",
    border: "1px solid rgba(99, 179, 237, 0.2)",
    borderRadius: 8,
    padding: "6px 12px",
  },
  balanceLabel: {
    fontSize: 11,
    color: "#718096",
    fontFamily: "'Space Mono', monospace",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  balanceValue: {
    fontSize: 13,
    fontFamily: "'Space Mono', monospace",
    fontWeight: 700,
    color: "#63b3ed",
  },
  connectedGroup: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  walletAddress: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(104, 211, 145, 0.08)",
    border: "1px solid rgba(104, 211, 145, 0.2)",
    borderRadius: 8,
    padding: "6px 12px",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#68d391",
    boxShadow: "0 0 6px rgba(104, 211, 145, 0.8)",
    animation: "pulse-glow 2s infinite",
    flexShrink: 0,
  },
  addressText: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 12,
    color: "#68d391",
  },
  disconnectBtn: {
    background: "transparent",
    border: "1px solid rgba(252, 129, 129, 0.3)",
    borderRadius: 8,
    color: "#fc8181",
    fontFamily: "'Sora', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    padding: "6px 14px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  connectBtn: {
    display: "flex",
    alignItems: "center",
    background: "#63b3ed",
    border: "none",
    borderRadius: 8,
    color: "#080c14",
    fontFamily: "'Sora', sans-serif",
    fontSize: 13,
    fontWeight: 700,
    padding: "8px 18px",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 0 20px rgba(99, 179, 237, 0.3)",
  },
  spinner: {
    display: "inline-block",
    width: 12,
    height: 12,
    border: "2px solid rgba(8,12,20,0.4)",
    borderTopColor: "#080c14",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    marginRight: 8,
  },
};

export default Navbar;
