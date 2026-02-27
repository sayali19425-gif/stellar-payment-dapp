import React from "react";

const TransactionStatus = ({ status, hash, error, onClose }) => {
  if (!status) return null;

  const isSuccess = status === "success";
  const isPending = status === "pending";
  const isError = status === "error";

  const explorerUrl = hash
    ? `https://stellar.expert/explorer/testnet/tx/${hash}`
    : null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{
          ...styles.modal,
          borderColor: isSuccess
            ? "rgba(104, 211, 145, 0.4)"
            : isError
            ? "rgba(252, 129, 129, 0.4)"
            : "rgba(99, 179, 237, 0.4)",
          boxShadow: isSuccess
            ? "0 0 60px rgba(104, 211, 145, 0.1), inset 0 1px 0 rgba(104, 211, 145, 0.1)"
            : isError
            ? "0 0 60px rgba(252, 129, 129, 0.1), inset 0 1px 0 rgba(252, 129, 129, 0.1)"
            : "0 0 60px rgba(99, 179, 237, 0.1), inset 0 1px 0 rgba(99, 179, 237, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up"
      >
        {/* Icon */}
        <div
          style={{
            ...styles.iconWrap,
            background: isSuccess
              ? "rgba(104, 211, 145, 0.1)"
              : isError
              ? "rgba(252, 129, 129, 0.1)"
              : "rgba(99, 179, 237, 0.1)",
            border: isSuccess
              ? "1px solid rgba(104, 211, 145, 0.3)"
              : isError
              ? "1px solid rgba(252, 129, 129, 0.3)"
              : "1px solid rgba(99, 179, 237, 0.3)",
          }}
        >
          {isPending && (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <circle cx="12" cy="12" r="10" stroke="rgba(99,179,237,0.3)" strokeWidth="2" />
              <path d="M12 2A10 10 0 0 1 22 12" stroke="#63b3ed" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
          {isSuccess && (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#68d391" strokeWidth="2" />
              <path d="M8 12L11 15L16 9" stroke="#68d391" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {isError && (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#fc8181" strokeWidth="2" />
              <path d="M9 9L15 15M15 9L9 15" stroke="#fc8181" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            ...styles.title,
            color: isSuccess ? "#68d391" : isError ? "#fc8181" : "#63b3ed",
          }}
        >
          {isPending && "Processing Transaction..."}
          {isSuccess && "Transaction Sent!"}
          {isError && "Transaction Failed"}
        </h3>

        {/* Message */}
        <p style={styles.message}>
          {isPending && "Your transaction is being submitted to the Stellar testnet."}
          {isSuccess && "Your XLM has been successfully sent on the Stellar testnet."}
          {isError && (error || "Something went wrong. Please try again.")}
        </p>

        {/* Hash */}
        {isSuccess && hash && (
          <div style={styles.hashBox}>
            <p style={styles.hashLabel}>TRANSACTION HASH</p>
            <p style={styles.hashValue}>{hash.slice(0, 20)}...{hash.slice(-10)}</p>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.explorerLink}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ marginRight: 5 }}>
                <path d="M18 13V19C18 20.1 17.1 21 16 21H5C3.9 21 3 20.1 3 19V8C3 6.9 3.9 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              View on Stellar Expert
            </a>
          </div>
        )}

        {/* Close button */}
        {!isPending && (
          <button style={styles.closeBtn} onClick={onClose}>
            Close
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(8, 12, 20, 0.85)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    background: "#0e1520",
    border: "1px solid",
    borderRadius: 20,
    padding: 36,
    maxWidth: 440,
    width: "100%",
    textAlign: "center",
    animation: "fadeUp 0.3s ease",
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
  },
  message: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 14,
    color: "#718096",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  hashBox: {
    background: "rgba(99, 179, 237, 0.05)",
    border: "1px solid rgba(99, 179, 237, 0.15)",
    borderRadius: 10,
    padding: "14px 16px",
    marginBottom: 24,
  },
  hashLabel: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.1em",
    color: "#4a5568",
    marginBottom: 6,
  },
  hashValue: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 12,
    color: "#63b3ed",
    marginBottom: 10,
    wordBreak: "break-all",
  },
  explorerLink: {
    display: "inline-flex",
    alignItems: "center",
    fontFamily: "'Sora', sans-serif",
    fontSize: 12,
    color: "#76e4f7",
    textDecoration: "none",
    fontWeight: 500,
  },
  closeBtn: {
    background: "rgba(99, 179, 237, 0.1)",
    border: "1px solid rgba(99, 179, 237, 0.25)",
    borderRadius: 10,
    color: "#63b3ed",
    fontFamily: "'Sora', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    padding: "10px 36px",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.2s",
  },
};

export default TransactionStatus;
