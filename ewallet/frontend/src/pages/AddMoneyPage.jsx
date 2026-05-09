import React from "react";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { readAuth } from "../auth/session.js";
import { addMoney, processPayment } from "../api/walletApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import "./appPages.css";

export default function AddMoneyPage() {
  const toast = useToast();
  const auth = readAuth();
  const userId = auth?.userId;

  const [amount, setAmount] = React.useState("100");
  const [busy, setBusy] = React.useState(false);
  const [resp, setResp] = React.useState(null);
  const [pgTxnId, setPgTxnId] = React.useState("");

  const amountNum = Number(amount);
  const amountValid = Number.isFinite(amountNum) && amountNum > 0;

  return (
    <Shell cta={<AppCtas />} footer={false}>
      <div className="appPage">
        <div className="appTitleRow">
          <div>
            <div className="appTitle">Add Money</div>
            <div className="appSub">Uses `POST /wallet-service/add-money` and opens the returned payment URL.</div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead">
            <div className="panelTitle">Create Add-Money Transaction</div>
          </div>

          <div className="grid2">
            <div className="field">
              <div className="label">User ID</div>
              <input className="input" value={String(userId || "")} disabled />
            </div>
            <div className="field">
              <div className="label">Amount</div>
              <input
                className="input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 250"
              />
            </div>
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <button
              className="btn btn--primary"
              type="button"
              disabled={!amountValid || busy}
              onClick={async () => {
                setBusy(true);
                setResp(null);
                try {
                  const data = await addMoney({ userId, amount: amountNum });
                  setResp(data);
                  toast.push({ type: "ok", title: "Payment initiated", message: "Open the payment URL to continue." });
                } catch (e) {
                  toast.push({ type: "error", title: "Add money failed", message: e?.message || "Request failed" });
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Working…" : "Initiate Payment"}
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead">
            <div className="panelTitle">Response</div>
          </div>
          {resp ? (
            <>
              <div className="kv">
                <div className="k">Txn ID</div>
                <div className="v">{resp?.txnId || "-"}</div>
              </div>
              <div className="kv">
                <div className="k">Payment URL</div>
                <div className="v" style={{ maxWidth: 720, wordBreak: "break-word" }}>
                  {resp?.url || "-"}
                </div>
              </div>
              <div className="row" style={{ marginTop: 10 }}>
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => {
                    if (!resp?.url) return;
                    window.open(resp.url, "_blank", "noopener,noreferrer");
                  }}
                  disabled={!resp?.url}
                >
                  Open payment page
                </button>
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(String(resp?.url || ""));
                      toast.push({ type: "ok", title: "Copied", message: "Payment URL copied to clipboard." });
                    } catch {
                      toast.push({ type: "info", title: "Copy failed", message: "Could not copy to clipboard." });
                    }
                  }}
                  disabled={!resp?.url}
                >
                  Copy URL
                </button>
              </div>
            </>
          ) : (
            <div className="appSub">No response yet. Submit the form above.</div>
          )}
        </div>

        <div className="panel">
          <div className="panelHead">
            <div className="panelTitle">Process Payment (Optional)</div>
          </div>
          <div className="appSub" style={{ marginBottom: 10 }}>
            Uses `GET /wallet-service/process-payment/{`pgTxnId`}`. If your payment gateway flow returns a `pgTxnId`,
            paste it here to apply the balance update.
          </div>
          <div className="grid2">
            <div className="field">
              <div className="label">pgTxnId</div>
              <input className="input" value={pgTxnId} onChange={(e) => setPgTxnId(e.target.value)} />
            </div>
            <div className="row" style={{ alignItems: "end" }}>
              <button
                className="btn btn--ghost"
                type="button"
                disabled={!pgTxnId.trim()}
                onClick={async () => {
                  try {
                    const msg = await processPayment(pgTxnId.trim());
                    toast.push({ type: "ok", title: "Processed", message: typeof msg === "string" ? msg : "Done." });
                  } catch (e) {
                    toast.push({ type: "error", title: "Process failed", message: e?.message || "Request failed" });
                  }
                }}
              >
                Process
              </button>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

