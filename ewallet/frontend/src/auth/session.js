// Centralized session helpers for the frontend.
// We keep auth in sessionStorage to match the existing login flow.

const KEY = "nx_auth";

export function readAuth() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeAuth(auth) {
  sessionStorage.setItem(KEY, JSON.stringify(auth));
}

export function clearAuth() {
  sessionStorage.removeItem(KEY);
}

