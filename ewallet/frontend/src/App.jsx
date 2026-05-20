import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Welcome from "./pages/Welcome.jsx";
import WalletPage from "./pages/WalletPage.jsx";
import AddMoneyPage from "./pages/AddMoneyPage.jsx";
import TransferPage from "./pages/TransferPage.jsx";
import TxnStatusPage from "./pages/TxnStatusPage.jsx";
import TransactionsPage from "./pages/TransactionsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import MerchantRegisterPage from "./pages/MerchantRegisterPage.jsx";
import { readAuth } from "./auth/session.js";

function PublicOnly({ children, redirectTo = "/welcome" }) {
  const auth = readAuth();
  if (auth?.userId) return <Navigate to={redirectTo} replace />;
  return children;
}

function Protected({ children, redirectTo = "/login" }) {
  const auth = readAuth();
  if (!auth?.userId) return <Navigate to={redirectTo} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/signup"
        element={
          <PublicOnly>
            <AuthPage defaultTab="signup" />
          </PublicOnly>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnly>
            <AuthPage defaultTab="signin" />
          </PublicOnly>
        }
      />
      <Route
        path="/signin"
        element={
          <PublicOnly>
            <AuthPage defaultTab="signin" />
          </PublicOnly>
        }
      />

      <Route
        path="/welcome"
        element={
          <Protected>
            <Welcome />
          </Protected>
        }
      />

      <Route
        path="/wallet"
        element={
          <Protected>
            <WalletPage />
          </Protected>
        }
      />
      <Route
        path="/add-money"
        element={
          <Protected>
            <AddMoneyPage />
          </Protected>
        }
      />
      <Route
        path="/transfer"
        element={
          <Protected>
            <TransferPage />
          </Protected>
        }
      />
      <Route
        path="/transactions"
        element={
          <Protected>
            <TransactionsPage />
          </Protected>
        }
      />
      <Route
        path="/txn-status"
        element={
          <Protected>
            <TxnStatusPage />
          </Protected>
        }
      />
      <Route
        path="/profile"
        element={
          <Protected>
            <ProfilePage />
          </Protected>
        }
      />
      <Route
        path="/merchant"
        element={
          <Protected>
            <MerchantRegisterPage />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
