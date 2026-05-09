import { jsonFetch } from "./http.js";

export function registerMerchant({ merchantKey, name, email, statusWebhook, redirectionUrl }) {
  return jsonFetch("/merchant-service/register-merchant", {
    method: "POST",
    body: { merchantKey, name, email, statusWebhook, redirectionUrl },
  });
}

