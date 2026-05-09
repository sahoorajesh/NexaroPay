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

