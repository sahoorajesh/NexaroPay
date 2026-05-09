export async function createUser(payload) {
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";
  const res = await fetch(`${API_BASE}/user-service/user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }

  // Backend returns a JSON number (long). Some setups return it as plain text.
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return Number(await res.text());
}

export async function login(payload) {
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";
  const res = await fetch(`${API_BASE}/user-service/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const contentType = res.headers.get("content-type") || "";
  const readJson = async () => {
    if (contentType.includes("application/json")) return res.json();
    const text = await res.text().catch(() => "");
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, message: text || `Request failed (${res.status})` };
    }
  };

  const data = await readJson();
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }
  return data;
}

export async function getUserDetails(userId) {
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";
  const res = await fetch(`${API_BASE}/user-service/user-details/${encodeURIComponent(String(userId))}`);
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof data === "string" ? data : data?.message || `Request failed (${res.status})`);
  return data;
}
