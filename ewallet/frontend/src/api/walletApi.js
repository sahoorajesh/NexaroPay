import { jsonFetch } from "./http.js";

export function getWalletDetails(userId) {
  return jsonFetch(`/wallet-service/wallet-details/${encodeURIComponent(String(userId))}`);
}

export function checkBalance(userId) {
  return jsonFetch(`/wallet-service/check-balance/${encodeURIComponent(String(userId))}`);
}

export function addMoney({ userId, amount }) {
  return jsonFetch("/wallet-service/add-money", {
    method: "POST",
    body: { userId, amount },
  });
}

export function processPayment(pgTxnId) {
  return jsonFetch(`/wallet-service/process-payment/${encodeURIComponent(String(pgTxnId))}`);
}

