import React from "react";
import { Link } from "react-router-dom";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { readAuth } from "../auth/session.js";
import { transferMoney } from "../api/transactionApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import "./appPages.css";

export default function TransferPage() {
  const toast = useToast();
  const auth = readAuth();
  const fromUserId = auth?.userId;

  const [toUserId, setToUserId] = React.useState("");
  const [amount, setAmount] = React.useState("10");
  const [comment, setComment] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [txnId, setTxnId] = React.useState("");

  const toIdNum = Number(toUserId);
  const amountNum = Number(amount);
  const valid =
    Number.isFinite(toIdNum) &&
    toIdNum > 0 &&
    Number.isFinite(amountNum) &&
    amountNum > 0 &&
    String(fromUserId) !== String(toIdNum);

  return (
    <Shell cta={<AppCtas />} footer={false}>
      <div className="appPage">
        <div className="appTitleRow">
          <div>
            <div className="appTitle">Transfer</div>
            <div className="appSub">Uses `POST /transaction-service/transfer`.</div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead">
            <div className="panelTitle">Initiate Transfer</div>
          </div>

          <div className="grid2">
            <div className="field">
              <div className="label">From User ID</div>
              <input className="input" value={String(fromUserId || "")} disabled />
            </div>
            <div className="field">
              <div className="label">To User ID</div>
              <input className="input" value={toUserId} onChange={(e) => setToUserId(e.target.value)} inputMode="numeric" />
            </div>
            <div className="field">
              <div className="label">Amount</div>
              <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
            </div>
            <div className="field">
              <div className="label">Comment</div>
              <input
                className="input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="(Optional) e.g. Dinner split"
              />
            </div>
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <button
              className="btn btn--primary"
              type="button"
              disabled={!valid || busy}
              onClick={async () => {
                setBusy(true);
                setTxnId("");
                try {
                  const id = await transferMoney({
                    fromUserId,
                    toUserId: toIdNum,
                    amount: amountNum,
                    comment: comment.trim() || null,
                  });
                  setTxnId(String(id || ""));
                  toast.push({ type: "ok", title: "Transfer initiated", message: `Txn ID: ${String(id)}` });
                } catch (e) {
                  toast.push({ type: "error", title: "Transfer failed", message: e?.message || "Request failed" });
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Working…" : "Send"}
            </button>
            <Link className="btn btn--ghost" to="/txn-status">
              Check a status
            </Link>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead">
            <div className="panelTitle">Last Txn ID</div>
          </div>
          {txnId ? (
            <>
              <div className="monoBox">{txnId}</div>
              <div className="row" style={{ marginTop: 10 }}>
                <Link className="btn btn--ghost" to={`/txn-status?txnId=${encodeURIComponent(txnId)}`}>
                  Open status page
                </Link>
              </div>
            </>
          ) : (
            <div className="appSub">No transfer initiated yet.</div>
          )}
        </div>
      </div>
    </Shell>
  );
}

