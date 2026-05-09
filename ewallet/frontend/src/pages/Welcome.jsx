import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Shell from "../components/layout/Shell.jsx";
import "./welcome.css";
import { clearAuth, readAuth } from "../auth/session.js";

export default function Welcome() {
  const navigate = useNavigate();
  const auth = readAuth();

  React.useEffect(() => {
    if (!auth?.userId) navigate("/login", { replace: true });
  }, [auth, navigate]);

  if (!auth?.userId) return null;

  const u = auth.user || {};

  return (
    <Shell
      cta={
        <button
          className="btn btn--ghost"
          type="button"
          onClick={() => {
            clearAuth();
            navigate("/", { replace: true });
          }}
        >
          Sign out
        </button>
      }
    >
      <section className="welcome">
        <div className="welcomeCard">
          <div className="welcomeCard__top">
            <img className="welcomeCard__logo" src="/favicon.png" alt="" />
            <div>
              <div className="welcomeCard__title">Welcome{u.name ? `, ${u.name}` : ""}.</div>
              <div className="welcomeCard__sub">You’re signed in to NexaroPay.</div>
            </div>
          </div>
          <div className="emptyState">
            <p>No transactions yet</p>
            <button className="btn btn--primary">Add money to get started</button>
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
              Wallet
            </Link>
            <Link className="btn btn--ghost" to="/add-money">
              Add money
            </Link>
            <Link className="btn btn--ghost" to="/transfer">
              Transfer
            </Link>
            <Link className="btn btn--ghost" to="/txn-status">
              Txn status
            </Link>
            <Link className="btn btn--ghost" to="/profile">
              Profile
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
