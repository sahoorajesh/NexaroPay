import React from "react";
import { Link } from "react-router-dom";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { readAuth } from "../auth/session.js";
import { checkBalance, getWalletDetails } from "../api/walletApi.js";
import { listUserTransactions } from "../api/transactionApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { Icon } from "../components/ui/Icons.jsx";
import TransactionList from "../components/ui/TransactionList.jsx";
import "./appPages.css";

export default function WalletPage() {
  const toast = useToast();
  const auth = readAuth();
  const userId = auth?.userId;

  const [loading, setLoading] = React.useState(true);
  const [wallet, setWallet] = React.useState(null);
  const [txnLoading, setTxnLoading] = React.useState(true);
  const [transactions, setTransactions] = React.useState([]);

  const load = React.useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const w = await getWalletDetails(userId);
      setWallet(w);
    } catch (e) {
      toast.push({
        type: "error",
        title: "Wallet load failed",
        message: e?.message || "We could not load your wallet. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, userId]);

  const loadTransactions = React.useCallback(async () => {
    if (!userId) return;
    setTxnLoading(true);
    try {
      const result = await listUserTransactions(userId, { page: 0, size: 10 });
      setTransactions(result?.content || []);
    } catch (e) {
      toast.push({
        type: "error",
        title: "Transactions load failed",
        message: e?.message || "We could not load your latest transactions.",
      });
    } finally {
      setTxnLoading(false);
    }
  }, [toast, userId]);

  React.useEffect(() => {
    load();
    loadTransactions();
  }, [load, loadTransactions]);

  const balance = wallet?.balance;

  return (
    <Shell cta={<AppCtas />} footer={false}>
      <div className="appPage">
        <div className="appTitleRow">
          <div>
            <div className="appTitle">Wallet</div>
            <div className="appSub">A polished view of your NexaroPay wallet and balance.</div>
          </div>
          <div className="row">
            <button className="btn btn--ghost" type="button" onClick={load} disabled={loading}>
              <Icon name="refresh" />
              Refresh
            </button>
            <button
              className="btn btn--ghost"
              type="button"
              onClick={async () => {
                try {
                  const w = await checkBalance(userId);
                  setWallet(w);
                  toast.push({ type: "ok", title: "Balance updated", message: "Latest wallet balance loaded." });
                } catch (e) {
                  toast.push({
                    type: "error",
                    title: "Check balance failed",
                    message: e?.message || "We could not refresh your balance. Please try again.",
                  });
                }
              }}
              disabled={loading}
            >
              <Icon name="wallet" />
              Check balance
            </button>
          </div>
        </div>

        <div className="walletCardWrap">
          <div className="walletVisualCard">
            <div className="walletVisualCard__top">
              <img className="walletVisualCard__logo" src="/favicon.png" alt="" />
              <div className="walletVisualCard__chip" aria-hidden="true" />
            </div>
            <div>
              <div className="walletVisualCard__label">Available Balance</div>
              <div className="walletVisualCard__balance">
                {loading ? "Loading..." : balance == null ? "INR -" : `INR ${Number(balance).toFixed(2)}`}
              </div>
            </div>
            <div className="walletVisualCard__meta">
              <div>
                <span>User ID</span>
                <strong>{String(wallet?.userId ?? userId ?? "-")}</strong>
              </div>
              <div>
                <span>Wallet ID</span>
                <strong>{wallet?.walletId != null ? String(wallet.walletId) : "-"}</strong>
              </div>
            </div>
            <div className="walletVisualCard__brand">nexaroPay</div>
          </div>
        </div>

        <section className="panel latestTransactionsPanel">
          <div className="panelHead">
            <div>
              <div className="panelTitle">Latest Transactions</div>
            </div>
            <Link className="btn btn--ghost" to="/transactions">
              <Icon name="history" />
              View all
            </Link>
          </div>
          <TransactionList
            transactions={transactions}
            userId={userId}
            loading={txnLoading}
            compact
            emptyText="No wallet transactions yet."
          />
        </section>
      </div>
    </Shell>
  );
}
