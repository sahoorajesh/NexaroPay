import { jsonFetch } from "./http.js";
import { readAuth } from "../auth/session.js";

export function createUser(payload) {
  return jsonFetch("/user-service/user", {
    method: "POST",
    body: payload,
  });
}

export function login(payload) {
  return jsonFetch("/user-service/login", {
    method: "POST",
    body: payload,
  });
}

export function getUserDetails(userId) {
  return jsonFetch(`/user-service/user-details/${encodeURIComponent(String(userId))}`);
}

export function logout() {
  const auth = readAuth();
  return jsonFetch("/user-service/logout", {
    method: "POST",
    body: { refreshToken: auth?.refreshToken || null },
    retryOnUnauthorized: false,
  });
}
