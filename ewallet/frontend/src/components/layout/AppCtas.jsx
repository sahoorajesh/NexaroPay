import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, readAuth } from "../../auth/session.js";
import { logout } from "../../api/userApi.js";
import { Icon } from "../ui/Icons.jsx";

export default function AppCtas() {
  const navigate = useNavigate();
  const auth = readAuth();
  const name = auth?.user?.name;
  const [signingOut, setSigningOut] = React.useState(false);

  async function onSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await logout();
    } catch {
      // Even if the server cannot be reached, remove the local session.
    } finally {
      clearAuth();
      navigate("/", { replace: true });
    }
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
      <Link className="btn btn--ghost" to="/welcome">
        <Icon name="home" />
        {name ? `Hi, ${name}` : "Welcome"}
      </Link>
      <Link className="btn btn--ghost" to="/wallet">
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
      <Link className="btn btn--ghost" to="/transactions">
        <Icon name="history" />
        Transactions
      </Link>
      <Link className="btn btn--ghost" to="/txn-status">
        <Icon name="search" />
        Status
      </Link>
      <Link className="btn btn--ghost" to="/profile">
        <Icon name="user" />
        Profile
      </Link>
      <button
        className="btn btn--ghost"
        type="button"
        onClick={onSignOut}
        disabled={signingOut}
      >
        <Icon name="log-out" />
        {signingOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}

