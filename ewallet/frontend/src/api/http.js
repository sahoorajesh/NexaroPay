const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export async function jsonFetch(path, { method = "GET", headers, body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    body: body == null ? undefined : JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      typeof data === "string" ? data : data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

