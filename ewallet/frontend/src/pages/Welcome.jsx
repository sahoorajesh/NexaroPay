import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Shell from "../components/layout/Shell.jsx";
import "./welcome.css";
import { clearAuth, readAuth } from "../auth/session.js";
import { logout } from "../api/userApi.js";
import { getMonthlyWalletAnalysis } from "../api/transactionApi.js";
import { Icon } from "../components/ui/Icons.jsx";

function money(value) {
  const n = Number(value);
  return Number.isFinite(n) ? `INR ${n.toFixed(2)}` : "INR 0.00";
}

export default function Welcome() {
  const today = new Date();

  // Get month name (e.g., "May")
  const monthName = today.toLocaleString("default", { month: "long" });

  // Get year (e.g., 2026)
  const year = today.getFullYear();
  const navigate = useNavigate();
  const auth = readAuth();
  const [signingOut, setSigningOut] = React.useState(false);
  const [analysis, setAnalysis] = React.useState(null);
  const [analysisLoading, setAnalysisLoading] = React.useState(true);

  React.useEffect(() => {
    if (!auth?.userId) navigate("/login", { replace: true });
  }, [auth, navigate]);

  React.useEffect(() => {
    let cancelled = false;

    async function loadAnalysis() {
      if (!auth?.userId) return;
      setAnalysisLoading(true);
      try {
        const result = await getMonthlyWalletAnalysis(auth.userId);
        if (!cancelled) setAnalysis(result);
      } catch {
        if (!cancelled) setAnalysis(null);
      } finally {
        if (!cancelled) setAnalysisLoading(false);
      }
    }

    loadAnalysis();
    return () => {
      cancelled = true;
    };
  }, [auth?.userId]);

  if (!auth?.userId) return null;

  const u = auth.user || {};
  const spent = Number(analysis?.totalSpentThisMonth || 0);
  const received = Number(analysis?.totalReceivedThisMonth || 0);
  const total = spent + received;
  const debitDegrees = total > 0 ? (spent / total) * 360 : 0;
  const pieStyle = {
    "--debitDegrees": `${debitDegrees}deg`,
  };

  async function onSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
    } catch {
      // Keep logout usable when the backend is unavailable or token is already invalid.
    } finally {
      clearAuth();
      navigate("/", { replace: true });
    }
  }

  return (
    <Shell
      cta={
        <button
          className="btn btn--ghost"
          type="button"
          onClick={onSignOut}
          disabled={signingOut}
        >
          <Icon name="log-out" />
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      }
    >
      <section className="welcome">
        <div className="welcomeCard">
          <div className="welcomeCard__top">
            <img className="welcomeCard__logo" src="/favicon.png" alt="" />
            <div>
              <div className="welcomeCard__title">Welcome{u.name ? `, ${u.name}` : ""}.</div>
              <div className="welcomeCard__sub">You're signed in to NexaroPay.</div>
            </div>
          </div>
          {analysisLoading ? (
            <div className="emptyState">
              <p>Loading wallet analysis...</p>
            </div>
          ) : analysis?.hasTransactions ? (
            <section className="walletAnalysis">
              <div className="walletAnalysis__head">
                <div>
                  <div className="walletAnalysis__title">Wallet Analysis for {monthName} {year} </div>
                  {/*<div className="welcomeCard__sub">Successful wallet movement for the current month.</div>*/}
                </div>
                <Link className="btn btn--ghost" to="/transactions">
                  <Icon name="history" />
                  View transactions
                </Link>
              </div>
              <div className="walletAnalysis__body">
                <div
                  className={total > 0 ? "walletPie" : "walletPie walletPie--empty"}
                  style={pieStyle}
                  aria-label="Debit and credit pie chart"
                >
                  {/*<span>{total > 0 ? `${Math.round((received / total) * 100)}%` : "0%"}</span>*/}
                </div>
                <div className="walletAnalysis__stats">
                  <div className="walletAnalysis__stat walletAnalysis__stat--debit">
                    <span>Total spent in this month</span>
                    <strong>{money(spent)}</strong>
                  </div>
                  <div className="walletAnalysis__stat walletAnalysis__stat--credit">
                    <span>Total received in this month</span>
                    <strong>{money(received)}</strong>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <div className="emptyState">
              <p>No transactions yet</p>
              <Link className="btn btn--primary" to="/add-money">
                <Icon name="add" />
                Add money to get started
              </Link>
            </div>
          )}
          <div className="welcomeGrid">
            <div className="infoRow">
              <div className="infoRow__k">User ID</div>
              <div className="infoRow__v">{String(auth.userId)}</div>
            </div>
            <div className="infoRow">
              <div className="infoRow__k">Email</div>
              <div className="infoRow__v">{u.email || "-"}</div>
            </div>
            <div className="infoRow">
              <div className="infoRow__k">Phone</div>
              <div className="infoRow__v">{u.phone || "-"}</div>
            </div>
            <div className="infoRow">
              <div className="infoRow__k">KYC</div>
              <div className="infoRow__v">{u.kycNumber || "-"}</div>
            </div>
          </div>

          <div className="welcomeActions">
            <Link className="btn btn--primary" to="/wallet">
              <Icon name="wallet" />
              Wallet
            </Link>
            <Link className="btn btn--ghost" to="/add-money">
              <Icon name="add" />
              Add money
            </Link>
            <Link className="btn btn--ghost" to="/transfer">
              <Icon name="send" />
              Transfer
            </Link>
            <Link className="btn btn--ghost" to="/txn-status">
              <Icon name="search" />
              Txn status
            </Link>
            <Link className="btn btn--ghost" to="/profile">
              <Icon name="user" />
              Profile
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
