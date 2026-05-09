import React from "react";
import { useSearchParams } from "react-router-dom";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { getTxnStatus } from "../api/transactionApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import "./appPages.css";

export default function TxnStatusPage() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [txnId, setTxnId] = React.useState(params.get("txnId") || "");
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState(null);

  React.useEffect(() => {
    const q = params.get("txnId") || "";
    setTxnId(q);
  }, [params]);

  async function load(id) {
    const v = String(id || "").trim();
    if (!v) return;
    setBusy(true);
    setStatus(null);
    try {
      const s = await getTxnStatus(v);
      setStatus(s);
      toast.push({ type: "ok", title: "Status loaded", message: s?.status ? `Status: ${s.status}` : "Loaded." });
    } catch (e) {
      toast.push({ type: "error", title: "Status failed", message: e?.message || "Request failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell cta={<AppCtas />} footer={false}>
      <div className="appPage">
        <div className="appTitleRow">
          <div>
            <div className="appTitle">Transaction Status</div>
            <div className="appSub">Uses `GET /transaction-service/status/{`txnId`}`.</div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead">
            <div className="panelTitle">Lookup</div>
          </div>
          <div className="grid2">
            <div className="field">
              <div className="label">Txn ID</div>
              <input className="input" value={txnId} onChange={(e) => setTxnId(e.target.value)} placeholder="e.g. TXN123" />
            </div>
            <div className="row" style={{ alignItems: "end" }}>
              <button
                className="btn btn--primary"
                type="button"
                disabled={!txnId.trim() || busy}
                onClick={() => {
                  const v = txnId.trim();
                  setParams(v ? { txnId: v } : {});
                  load(v);
                }}
              >
                {busy ? "Loading…" : "Fetch"}
              </button>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead">
            <div className="panelTitle">Result</div>
          </div>
          {status ? (
            <>
              <div className="kv">
                <div className="k">Status</div>
                <div className="v">{status?.status || "-"}</div>
              </div>
              <div className="kv">
                <div className="k">Reason</div>
                <div className="v">{status?.reason || "-"}</div>
              </div>
            </>
          ) : (
            <div className="appSub">No status loaded.</div>
          )}
        </div>
      </div>
    </Shell>
  );
}

