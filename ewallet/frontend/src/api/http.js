import {clearAuth, readAuth, writeAuth} from "../auth/session.js";

const API_BASE = import.meta.env.VITE_API_BASE || "/api";

function friendlyMessage(status) {
    if (status === 400) return "Please check the details and try again.";
    if (status === 401 || status === 403) return "Your session is not authorized for this action.";
    if (status === 404) return "We could not find the requested record.";
    if (status === 409) return "This request conflicts with existing data. Please review and try again.";
    if (status === 422) return "Some details look invalid. Please review the form.";
    if (status >= 500) return "NexaroPay services are temporarily unavailable. Please try again shortly.";
    return "Something went wrong. Please try again.";
}

async function parseResponse(res) {
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    return isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");
}

async function refreshSession() {
    const auth = readAuth();
    if (!auth?.refreshToken) return null;

    let res;
    try {
        res = await fetch(`${API_BASE}/user-service/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({refreshToken: auth.refreshToken}),
        });
    } catch {
        return null;
    }

    const data = await parseResponse(res);
    if (!res.ok || !data?.token || !data?.refreshToken) {
        clearAuth();
        return null;
    }

    const nextAuth = {
        ...auth,
        userId: data.userId ?? auth.userId,
        user: data.user ?? auth.user,
        token: data.token,
        refreshToken: data.refreshToken,
    };
    writeAuth(nextAuth);
    return nextAuth;
}

export async function jsonFetch(path, {method = "GET", headers, body, retryOnUnauthorized = true} = {}) {
    let res;
    const auth = readAuth();
    try {
        res = await fetch(`${API_BASE}${path}`, {
            method,

            headers: {
                "Content-Type": "application/json",
                ...(auth?.token ? {Authorization: `Bearer ${auth.token}`} : {}),
                ...(headers || {}),
            },
            body: body == null ? undefined : JSON.stringify(body),
        });
    } catch {
        throw new Error("We could not reach NexaroPay services. Check your connection and try again.");
    }

    let data = await parseResponse(res);

    if ((res.status === 401 || res.status === 403) && retryOnUnauthorized && path !== "/user-service/refresh-token") {
        const refreshedAuth = await refreshSession();
        if (refreshedAuth?.token) {
            return jsonFetch(path, {method, headers, body, retryOnUnauthorized: false});
        }
    }

    if (!res.ok) {
        throw new Error(friendlyMessage(res.status));
    }
    return data;
}
