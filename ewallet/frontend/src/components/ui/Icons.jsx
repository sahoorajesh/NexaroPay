import React from "react";

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 2,
};

export function Icon({ name, className, title }) {
  const label = title ? { role: "img", "aria-label": title } : { "aria-hidden": "true" };

  return (
    <svg className={className} viewBox="0 0 24 24" {...label}>
      {name === "add" ? (
        <path {...common} d="M12 5v14M5 12h14" />
      ) : name === "arrow-left" ? (
        <path {...common} d="M19 12H5m7-7-7 7 7 7" />
      ) : name === "check" ? (
        <path {...common} d="m5 13 4 4L19 7" />
      ) : name === "check-circle" ? (
        <>
          <path {...common} d="M22 11.1V12a10 10 0 1 1-5.9-9.1" />
          <path {...common} d="m9 11 3 3L22 4" />
        </>
      ) : name === "chevron-left" ? (
        <path {...common} d="m15 18-6-6 6-6" />
      ) : name === "chevron-right" ? (
        <path {...common} d="m9 18 6-6-6-6" />
      ) : name === "close" ? (
        <path {...common} d="M6 6l12 12M18 6 6 18" />
      ) : name === "copy" ? (
        <>
          <rect {...common} x="9" y="9" width="11" height="11" rx="2" />
          <path {...common} d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </>
      ) : name === "credit-card" ? (
        <>
          <rect {...common} x="3" y="5" width="18" height="14" rx="2" />
          <path {...common} d="M3 10h18M7 15h2" />
        </>
      ) : name === "home" ? (
        <>
          <path {...common} d="m3 11 9-8 9 8" />
          <path {...common} d="M5 10v10h14V10M9 20v-6h6v6" />
        </>
      ) : name === "history" ? (
        <>
          <path {...common} d="M3 12a9 9 0 1 0 3-6.7" />
          <path {...common} d="M3 4v5h5M12 7v5l3 2" />
        </>
      ) : name === "info" ? (
        <>
          <circle {...common} cx="12" cy="12" r="10" />
          <path {...common} d="M12 16v-4M12 8h.01" />
        </>
      ) : name === "log-out" ? (
        <>
          <path {...common} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <path {...common} d="M16 17l5-5-5-5M21 12H9" />
        </>
      ) : name === "refresh" ? (
        <path {...common} d="M20 12a8 8 0 0 1-13.7 5.7M4 12A8 8 0 0 1 17.7 6.3M18 2v5h-5M6 22v-5h5" />
      ) : name === "search" ? (
        <>
          <circle {...common} cx="11" cy="11" r="8" />
          <path {...common} d="m21 21-4.3-4.3" />
        </>
      ) : name === "send" ? (
        <>
          <path {...common} d="m22 2-7 20-4-9-9-4Z" />
          <path {...common} d="M22 2 11 13" />
        </>
      ) : name === "shield" ? (
        <path {...common} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      ) : name === "user" ? (
        <>
          <path {...common} d="M20 21a8 8 0 0 0-16 0" />
          <circle {...common} cx="12" cy="7" r="4" />
        </>
      ) : name === "wallet" ? (
        <>
          <path {...common} d="M20 7H5a2 2 0 0 0 0 4h16v8H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h13a2 2 0 0 1 2 2v1Z" />
          <path {...common} d="M16 14h.01" />
        </>
      ) : name === "warning" ? (
        <>
          <path {...common} d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path {...common} d="M12 9v4M12 17h.01" />
        </>
      ) : (
        <circle {...common} cx="12" cy="12" r="10" />
      )}
    </svg>
  );
}
