import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icons.jsx";

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `${n.toFixed(2)}` : "-";
}

function when(value) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
}

function direction(txn, userId) {
  if (String(txn?.fromUserId) === String(userId)) return "sent";
  if (String(txn?.toUserId) === String(userId)) return "received";
  return "activity";
}

export default function TransactionList({ transactions = [], userId, loading, compact = false, emptyText, showViewAll = false }) {
  const [copiedTxnId, setCopiedTxnId] = React.useState("");

  async function copyTxnId(txnId) {
    const value = String(txnId || "");
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopiedTxnId(value);
      window.setTimeout(() => setCopiedTxnId((current) => (current === value ? "" : current)), 1400);
    } catch {
      setCopiedTxnId("");
    }
  }

  if (loading) {
    return <div className="transactionEmpty">Loading transactions...</div>;
  }

  if (!transactions.length) {
    return <div className="transactionEmpty">{emptyText || "No transactions found."}</div>;
  }

  return (
    <div className={compact ? "transactionList transactionList--compact" : "transactionList"}>
      {transactions.map((txn) => {
        const dir = direction(txn, userId);
        const status = String(txn?.status || "UNKNOWN").toLowerCase();
        const peer = dir === "sent" ? txn.toUserId : txn.fromUserId;

        return (
          <article className="transactionCard" key={txn.txnId}>
            <div className="transactionCard__main">
              <div className="transactionCard__who">
                <div className="transactionCard__title">
                  {dir === "sent" ? `Sent to user ${peer || "-"}` : dir === "received" ? `Received from user ${peer || "-"}` : "Wallet activity"}
                </div>
                <div className="transactionCard__sub">{txn.comment || txn.reason || "No comment"}</div>
                <button className="txnCopy" type="button" onClick={() => copyTxnId(txn.txnId)} title="Copy transaction id">
                  <span className="mono">{txn.txnId}</span>
                  <Icon name={copiedTxnId === txn.txnId ? "check" : "copy"} />
                </button>
              </div>

              <div className="transactionCard__time">{when(txn.txnLastUpdatedDate)}</div>
              <div className={`statusBadge statusBadge--${status}`}>{txn.status || "UNKNOWN"}</div>
              <div className={`transactionCard__amount transactionCard__amount--${dir === "sent" ? "debit" : "credit"}`}>
                {dir === "sent" ? "- " : "+ "}{money(txn.amount)}
              </div>

            </div>
          </article>
        );
      })}

      {showViewAll ? (
        <Link className="btn btn--ghost transactionList__viewAll" to="/transactions">
          <Icon name="history" />
          View all transactions
        </Link>
      ) : null}
    </div>
  );
}
