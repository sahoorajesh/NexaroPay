import { jsonFetch } from "./http.js";

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
  return jsonFetch("/user-service/logout", {
    method: "POST",
  });
}
