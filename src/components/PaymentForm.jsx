import React, { useState } from "react";

const PaymentForm = ({ onSend, loading, connected, balance }) => {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!destination.trim()) {
      newErrors.destination = "Destination address is required";
    } else if (destination.trim().length !== 56 || !destination.trim().startsWith("G")) {
      newErrors.destination = "Enter a valid Stellar public key (starts with G, 56 chars)";
    }

    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      newErrors.amount = "Enter a valid amount greater than 0";
    } else if (balance !== null && amt > parseFloat(balance) - 1) {
      newErrors.amount = `Insufficient balance (need at least 1 XLM reserved)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSend({ destination: destination.trim(), amount, memo: memo.trim() });
  };

  const handleMax = () => {
    if (balance !== null) {
      const maxAmt = Math.max(0, parseFloat(balance) - 1.5);
      setAmount(maxAmt.toFixed(7));
    }
  };

  return (
    <div style={styles.card}>
      {/* Card Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="#63b3ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#63b3ed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 style={styles.cardTitle}>Send XLM</h2>
            <p style={styles.cardSubtitle}>Stellar Testnet</p>
          </div>
        </div>
        {balance !== null && (
          <div style={styles.balanceTag}>
            <span style={styles.balanceLabelSmall}>Available</span>
            <span style={styles.balanceAmountSmall}>{parseFloat(balance).toFixed(4)} XLM</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={styles.form} noValidate>
        {/* Destination */}
        <div style={styles.field}>
          <label style={styles.label}>
            <span>Destination Address</span>
            <span style={styles.required}>required</span>
          </label>
          <div style={{ ...styles.inputWrap, borderColor: errors.destination ? "rgba(252,129,129,0.5)" : undefined }}>
            <div style={styles.inputIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#718096" strokeWidth="2"/>
                <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20" stroke="#718096" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              style={styles.input}
              type="text"
              placeholder="G... (56 character public key)"
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setErrors(p => ({ ...p, destination: "" })); }}
              disabled={loading || !connected}
              maxLength={56}
              spellCheck={false}
            />
            {destination && (
              <div style={{ ...styles.charCount, color: destination.length === 56 ? "#68d391" : "#718096" }}>
                {destination.length}/56
              </div>
            )}
          </div>
          {errors.destination && <p style={styles.errorText}>{errors.destination}</p>}
        </div>

        {/* Amount */}
        <div style={styles.field}>
          <label style={styles.label}>
            <span>Amount</span>
            <span style={styles.required}>XLM</span>
          </label>
          <div style={{ ...styles.inputWrap, borderColor: errors.amount ? "rgba(252,129,129,0.5)" : undefined }}>
            <div style={styles.inputIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#718096" strokeWidth="2"/>
                <path d="M12 7V12L15 15" stroke="#718096" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              style={styles.input}
              type="number"
              placeholder="0.0000000"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setErrors(p => ({ ...p, amount: "" })); }}
              disabled={loading || !connected}
              step="0.0000001"
              min="0.0000001"
            />
            {connected && balance !== null && (
              <button type="button" style={styles.maxBtn} onClick={handleMax} disabled={loading}>
                MAX
              </button>
            )}
          </div>
          {errors.amount && <p style={styles.errorText}>{errors.amount}</p>}
        </div>

        {/* Memo */}
        <div style={styles.field}>
          <label style={styles.label}>
            <span>Memo</span>
            <span style={styles.optional}>optional</span>
          </label>
          <div style={styles.inputWrap}>
            <div style={styles.inputIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="#718096" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M14 2V8H20" stroke="#718096" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M8 13H16M8 17H12" stroke="#718096" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <input
              style={styles.input}
              type="text"
              placeholder="Add a note (max 28 chars)"
              value={memo}
              onChange={(e) => setMemo(e.target.value.slice(0, 28))}
              disabled={loading || !connected}
              maxLength={28}
            />
            {memo && <div style={styles.charCount}>{memo.length}/28</div>}
          </div>
        </div>

        {/* Submit */}
        {!connected ? (
          <div style={styles.connectPrompt}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8, flexShrink: 0 }}>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#f6ad55" strokeWidth="2"/>
              <path d="M12 8V12M12 16H12.01" stroke="#f6ad55" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Connect your Freighter wallet to send transactions
          </div>
        ) : (
          <button
            type="submit"
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.btnSpinner} />
                Sending Transaction...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Send XLM
              </>
            )}
          </button>
        )}
      </form>

      {/* Footer note */}
      <div style={styles.footerNote}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ marginRight: 5, flexShrink: 0 }}>
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4a5568" strokeWidth="2"/>
          <path d="M12 11V16M12 8H12.01" stroke="#4a5568" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Transactions are executed on the Stellar testnet. No real funds involved.
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "#0e1520",
    border: "1px solid rgba(99, 179, 237, 0.15)",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(99,179,237,0.08)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 28px",
    borderBottom: "1px solid rgba(99, 179, 237, 0.08)",
    background: "rgba(99, 179, 237, 0.03)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    background: "rgba(99, 179, 237, 0.1)",
    border: "1px solid rgba(99, 179, 237, 0.2)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: "#e2e8f0",
    lineHeight: 1.2,
  },
  cardSubtitle: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    color: "#718096",
    letterSpacing: "0.05em",
    marginTop: 2,
  },
  balanceTag: {
    textAlign: "right",
  },
  balanceLabelSmall: {
    display: "block",
    fontFamily: "'Space Mono', monospace",
    fontSize: 9,
    color: "#4a5568",
    letterSpacing: "0.08em",
    marginBottom: 2,
  },
  balanceAmountSmall: {
    display: "block",
    fontFamily: "'Space Mono', monospace",
    fontSize: 14,
    fontWeight: 700,
    color: "#63b3ed",
  },
  form: {
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "'Sora', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "#a0aec0",
  },
  required: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    color: "#63b3ed",
    letterSpacing: "0.05em",
  },
  optional: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    color: "#4a5568",
    letterSpacing: "0.05em",
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(99, 179, 237, 0.15)",
    borderRadius: 10,
    overflow: "hidden",
    transition: "border-color 0.2s",
    ":focus-within": {
      borderColor: "rgba(99, 179, 237, 0.5)",
    },
  },
  inputIcon: {
    padding: "0 12px",
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    fontFamily: "'Space Mono', monospace",
    fontSize: 13,
    color: "#e2e8f0",
    padding: "13px 0",
    width: "100%",
  },
  charCount: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    color: "#4a5568",
    padding: "0 12px",
    flexShrink: 0,
  },
  maxBtn: {
    background: "rgba(99, 179, 237, 0.1)",
    border: "none",
    borderLeft: "1px solid rgba(99, 179, 237, 0.15)",
    color: "#63b3ed",
    fontFamily: "'Space Mono', monospace",
    fontSize: 10,
    fontWeight: 700,
    padding: "0 14px",
    cursor: "pointer",
    letterSpacing: "0.05em",
    height: "100%",
    alignSelf: "stretch",
    display: "flex",
    alignItems: "center",
    transition: "background 0.2s",
  },
  errorText: {
    fontFamily: "'Sora', sans-serif",
    fontSize: 12,
    color: "#fc8181",
    paddingLeft: 4,
  },
  connectPrompt: {
    display: "flex",
    alignItems: "center",
    background: "rgba(246, 173, 85, 0.07)",
    border: "1px solid rgba(246, 173, 85, 0.2)",
    borderRadius: 10,
    padding: "14px 16px",
    fontFamily: "'Sora', sans-serif",
    fontSize: 13,
    color: "#f6ad55",
    lineHeight: 1.4,
  },
  submitBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #63b3ed, #76e4f7)",
    border: "none",
    borderRadius: 10,
    color: "#080c14",
    fontFamily: "'Sora', sans-serif",
    fontSize: 15,
    fontWeight: 700,
    padding: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(99, 179, 237, 0.3)",
    transition: "all 0.2s",
    marginTop: 4,
  },
  btnSpinner: {
    display: "inline-block",
    width: 14,
    height: 14,
    border: "2px solid rgba(8,12,20,0.3)",
    borderTopColor: "#080c14",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    marginRight: 10,
  },
  footerNote: {
    display: "flex",
    alignItems: "center",
    padding: "14px 28px",
    borderTop: "1px solid rgba(99, 179, 237, 0.06)",
    fontFamily: "'Sora', sans-serif",
    fontSize: 11,
    color: "#4a5568",
    background: "rgba(0,0,0,0.1)",
  },
};

export default PaymentForm;
