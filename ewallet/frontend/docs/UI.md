# NexaroPay Frontend UI Notes

This document explains the UI pages we added to exercise the backend APIs (excluding notifications).

## Auth And Redirects

Auth is stored in `sessionStorage` key `nx_auth` as:

```json
{ "userId": 123, "user": { "name": "...", "email": "...", "phone": "...", "kycNumber": "..." } }
```

Helpers live in `src/auth/session.js`.

Routing guards live in `src/App.jsx`:

- Public-only routes: `/login`, `/signin`, `/signup`
  - If `nx_auth.userId` exists, they redirect to `/welcome`
- Protected routes: `/welcome`, `/wallet`, `/add-money`, `/transfer`, `/txn-status`, `/profile`, `/merchant`
  - If not logged in, they redirect to `/login`

## Pages (And API Coverage)

All pages below are routed in `src/App.jsx` and use `Shell` + `AppCtas` for a consistent header.

`/wallet`

- Calls `GET /wallet-service/wallet-details/{userId}`
- Also exposes `GET /wallet-service/check-balance/{userId}` via a button
- Files:
  - `src/pages/WalletPage.jsx`
  - `src/api/walletApi.js`

`/add-money`

- Calls `POST /wallet-service/add-money` with `{ userId, amount }`
- Displays `{ txnId, url }` and opens `url` in a new tab
- Optional helper for `GET /wallet-service/process-payment/{pgTxnId}`
- Files:
  - `src/pages/AddMoneyPage.jsx`
  - `src/api/walletApi.js`

`/transfer`

- Calls `POST /transaction-service/transfer` with `{ fromUserId, toUserId, amount, comment }`
- Displays the returned transaction id
- Files:
  - `src/pages/TransferPage.jsx`
  - `src/api/transactionApi.js`

`/txn-status`

- Calls `GET /transaction-service/status/{txnId}`
- Supports `?txnId=...` query param
- Files:
  - `src/pages/TxnStatusPage.jsx`
  - `src/api/transactionApi.js`

`/profile`

- Calls `GET /user-service/user-details/{userId}`
- Files:
  - `src/pages/ProfilePage.jsx`
  - `src/api/userApi.js`

`/merchant`

- Calls `POST /merchant-service/register-merchant`
- This is mostly for testing the payment-gateway module’s merchant endpoint
- Files:
  - `src/pages/MerchantRegisterPage.jsx`
  - `src/api/merchantApi.js`

## API Helper Pattern

`src/api/http.js` provides `jsonFetch(path, options)` for JSON endpoints:

- Adds `Content-Type: application/json`
- Reads JSON or text based on `content-type`
- Throws an `Error` with a readable message on non-2xx responses

## Styling

Shared page styling (panels, fields, grid layout) is in `src/pages/appPages.css`.

