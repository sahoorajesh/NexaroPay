import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Shell from "../components/layout/Shell.jsx";
import "./welcome.css";
import { clearAuth, readAuth } from "../auth/session.js";
import { logout } from "../api/userApi.js";
import { Icon } from "../components/ui/Icons.jsx";

export default function Welcome() {
  const navigate = useNavigate();
  const auth = readAuth();
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    if (!auth?.userId) navigate("/login", { replace: true });
  }, [auth, navigate]);

  if (!auth?.userId) return null;

  const u = auth.user || {};

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
          <div className="emptyState">
            <p>No transactions yet</p>
            <Link className="btn btn--primary" to="/add-money">
              <Icon name="add" />
              Add money to get started
            </Link>
          </div>
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
