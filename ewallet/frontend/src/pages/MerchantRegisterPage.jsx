import React from "react";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { registerMerchant } from "../api/merchantApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import "./appPages.css";

export default function MerchantRegisterPage() {
  const toast = useToast();

  const [busy, setBusy] = React.useState(false);
  const [resId, setResId] = React.useState("");
  const [form, setForm] = React.useState({
    merchantKey: "demo-key",
    name: "Demo Merchant",
    email: "merchant@example.com",
    statusWebhook: "http://localhost:9090/pg-webhook/status",
    redirectionUrl: "http://localhost:9090/merchant/redirect",
  });

  const valid =
    form.merchantKey.trim() &&
    form.name.trim() &&
    form.email.trim() &&
    form.statusWebhook.trim() &&
    form.redirectionUrl.trim();

  return (
    <Shell cta={<AppCtas />} footer={false}>
      <div className="appPage">
        <div className="appTitleRow">
          <div>
            <div className="appTitle">Merchant Registration</div>
            <div className="appSub">Uses `POST /merchant-service/register-merchant`.</div>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead">
            <div className="panelTitle">Register</div>
          </div>

          <div className="grid2">
            <div className="field">
              <div className="label">Merchant Key</div>
              <input
                className="input"
                value={form.merchantKey}
                onChange={(e) => setForm((f) => ({ ...f, merchantKey: e.target.value }))}
              />
            </div>
            <div className="field">
              <div className="label">Name</div>
              <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="field">
              <div className="label">Email</div>
              <input
                className="input"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                inputMode="email"
              />
            </div>
            <div className="field">
              <div className="label">Status Webhook</div>
              <input
                className="input"
                value={form.statusWebhook}
                onChange={(e) => setForm((f) => ({ ...f, statusWebhook: e.target.value }))}
              />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <div className="label">Redirection URL</div>
              <input
                className="input"
                value={form.redirectionUrl}
                onChange={(e) => setForm((f) => ({ ...f, redirectionUrl: e.target.value }))}
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
                setResId("");
                try {
                  const id = await registerMerchant(form);
                  setResId(String(id));
                  toast.push({ type: "ok", title: "Merchant registered", message: `Merchant ID: ${String(id)}` });
                } catch (e) {
                  toast.push({ type: "error", title: "Registration failed", message: e?.message || "Request failed" });
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Working…" : "Register"}
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="panelHead">
            <div className="panelTitle">Result</div>
          </div>
          {resId ? <div className="monoBox">{resId}</div> : <div className="appSub">No merchant registered yet.</div>}
        </div>
      </div>
    </Shell>
  );
}

