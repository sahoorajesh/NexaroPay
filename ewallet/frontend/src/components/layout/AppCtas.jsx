import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, readAuth } from "../../auth/session.js";

export default function AppCtas() {
  const navigate = useNavigate();
  const auth = readAuth();
  const name = auth?.user?.name;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
      <Link className="btn btn--ghost" to="/welcome">
        {name ? `Hi, ${name}` : "Welcome"}
      </Link>
      <Link className="btn btn--ghost" to="/wallet">
        Wallet
      </Link>
      <Link className="btn btn--ghost" to="/add-money">
        Add money
      </Link>
      <Link className="btn btn--ghost" to="/transfer">
        Transfer
      </Link>
      <Link className="btn btn--ghost" to="/txn-status">
        Status
      </Link>
      <Link className="btn btn--ghost" to="/profile">
        Profile
      </Link>
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
    </div>
  );
}

