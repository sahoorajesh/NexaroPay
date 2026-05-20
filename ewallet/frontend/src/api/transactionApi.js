import { jsonFetch } from "./http.js";

export function transferMoney({ fromUserId, toUserId, amount, comment }) {
  return jsonFetch("/transaction-service/transfer", {
    method: "POST",
    body: { fromUserId, toUserId, amount, comment },
  });
}

export function getTxnStatus(txnId) {
  return jsonFetch(`/transaction-service/status/${encodeURIComponent(String(txnId))}`);
}

export function listUserTransactions(userId, { page = 0, size = 10 } = {}) {
  const q = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  return jsonFetch(`/transaction-service/users/${encodeURIComponent(String(userId))}/transactions?${q.toString()}`);
}

