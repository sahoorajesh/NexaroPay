# NexaroPay Frontend Documentation (UIreadme.md)

# Project Overview

The `ewallet/frontend` module is the React-based UI layer of the NexaroPay application.

It provides:
- User authentication
- Wallet management
- Add money workflows
- Money transfer functionality
- Transaction status lookup
- Merchant registration
- Profile management
- Theme-aware responsive UI

---

# Technology Stack

- React
- React Router DOM
- Vite
- Fetch API
- Session Storage
- Modular CSS

---

# Folder Structure

```text
frontend/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── auth/
│   ├── components/
│   │   ├── layout/
│   │   └── ui/
│   ├── pages/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

# main.jsx

## Purpose

Application bootstrap entry point.

## Responsibilities

- Loads React application
- Mounts App component
- Configures BrowserRouter
- Imports global styles

---

# App.jsx

## Purpose

Central routing controller.

## Responsibilities

- Defines routes
- Protects authenticated pages
- Prevents unauthorized access
- Redirect handling

## Components

### PublicOnly

Restricts authenticated users from login/signup routes.

### Protected

Protects secure routes from unauthenticated access.

## Routes

| Route | Purpose |
|---|---|
| / | Landing page |
| /signup | Registration |
| /login | Login |
| /welcome | Dashboard |
| /wallet | Wallet details |
| /add-money | Add money |
| /transfer | Transfer funds |
| /txn-status | Transaction lookup |
| /profile | User profile |
| /merchant | Merchant registration |

---

# API Layer

## api/http.js

### Purpose

Universal HTTP wrapper.

### Responsibilities

- Handles fetch requests
- Parses JSON
- Handles errors
- Converts status codes into readable messages

### Core Method

#### jsonFetch(path, options)

Centralized API request executor.

---

## api/userApi.js

### Methods

#### createUser(payload)

Registers new user.

#### login(payload)

Authenticates user.

#### getUserDetails(userId)

Fetches user profile.

---

## api/walletApi.js

### Methods

#### getWalletDetails(userId)

Fetch wallet information.

#### checkBalance(userId)

Refresh wallet balance.

#### addMoney({ userId, amount })

Adds funds to wallet.

#### processPayment(pgTxnId)

Processes payment transaction.

---

## api/transactionApi.js

### Methods

#### transferMoney()

Transfers money between users.

#### getTxnStatus(txnId)

Fetches transaction status.

---

## api/merchantApi.js

### Methods

#### registerMerchant()

Registers merchant details.

---

# Authentication Layer

## auth/session.js

### Purpose

Handles frontend session management.

### Storage

Uses:

```js
sessionStorage
```

### Methods

#### readAuth()

Reads session data.

#### writeAuth(auth)

Stores session data.

#### clearAuth()

Removes session and logs out user.

---

# Layout Components

## components/layout/Shell.jsx

### Purpose

Global application layout wrapper.

### Responsibilities

- Header rendering
- Footer rendering
- Theme handling
- Layout spacing

### Theme Management

Uses localStorage:

```js
localStorage.getItem("nx_theme")
```

### Props

| Prop | Purpose |
|---|---|
| children | Page content |
| cta | Action buttons |
| footer | Footer visibility |

---

## components/layout/AppCtas.jsx

### Purpose

Shared navigation/action section.

### Features

- Wallet navigation
- Add money
- Transfer
- Transaction lookup
- Profile access
- Logout

---

# UI Components

## components/ui/Icons.jsx

Centralized SVG icon component.

---

## components/ui/ToastProvider.jsx

### Purpose

Global toast notification system.

### Hook

#### useToast()

Used for:
- Success notifications
- Error messages
- Global alerts

---

## components/ui/TransactionModal.jsx

Reusable transaction modal popup.

---

## components/ui/Carousel.jsx

Reusable homepage carousel component.

---

## components/ui/OfferArt.jsx

Illustration/art component for UI enhancement.

---

# Assets

| Asset | Purpose |
|---|---|
| carousel-pay.svg | Payment artwork |
| carousel-split.svg | Split payment artwork |
| carousel-status.svg | Transaction status artwork |
| hero-wallet.svg | Wallet hero image |

---

# Pages

## Home.jsx

Landing page of NexaroPay.

### Responsibilities

- Product intro
- Feature highlights
- Signup/Login navigation
- Marketing content

---

## AuthPage.jsx

Unified authentication page.

### Responsibilities

- Signup flow
- Login flow
- Validation
- Session creation

---

## Welcome.jsx

Dashboard/welcome screen.

### Features

- User info
- Quick actions
- Empty transaction state
- Navigation shortcuts

---

## WalletPage.jsx

Wallet information screen.

### Features

- Balance display
- Wallet metadata
- Balance refresh
- Toast notifications

### Main Function

#### load()

Fetches wallet details.

---

## AddMoneyPage.jsx

Add funds workflow.

### Features

- Amount validation
- API integration
- Loading state handling

---

## TransferPage.jsx

Peer-to-peer transfer workflow.

### Features

- Recipient entry
- Amount entry
- Comment support
- Transfer execution

---

## TxnStatusPage.jsx

Transaction status lookup page.

### Features

- Transaction ID search
- Status display
- API-driven lookup

### Main Method

#### load(id)

Fetches transaction details.

---

## ProfilePage.jsx

Displays user profile details.

### Information Displayed

- Name
- Email
- Phone
- User ID
- KYC details

---

## MerchantRegisterPage.jsx

Merchant onboarding page.

### Features

- Merchant registration
- Webhook URL configuration
- Redirect URL configuration

---

# Styling Layer

## styles/global.css

Global application styling.

Includes:
- Theme variables
- Typography
- Responsive styles
- Utility classes

---

## shell.css

Layout styling.

---

## appPages.css

Shared page styles.

---

## home.css

Landing page styling.

---

## welcome.css

Dashboard styling.

---

## toast.css

Toast notification styling.

---

## carousel.css

Carousel styling.

---

## offerArt.css

Offer artwork styling.

---

# Architecture Summary

| Layer | Responsibility |
|---|---|
| pages/ | Business screens |
| api/ | Backend communication |
| components/ui | Reusable UI widgets |
| components/layout | Shared layouts |
| auth/ | Session management |
| styles/ | Styling system |

---

# Authentication Flow

```text
Login/Signup
    ↓
API Call
    ↓
writeAuth()
    ↓
sessionStorage
    ↓
Protected Routes Enabled
```

---

# Wallet Flow

```text
WalletPage
    ↓
walletApi.js
    ↓
http.js
    ↓
Backend Service
```

---

# Transaction Flow

```text
TransferPage
    ↓
transactionApi.js
    ↓
http.js
    ↓
Transaction Service
```

---

# Design Strengths

- Modular architecture
- Reusable UI system
- Centralized API layer
- Protected routes
- Theme support
- Toast notification system
- Clean separation of concerns

---

# Suggested Improvements

## Recommended Enhancements

- Add JWT token support
- Add Redux Toolkit/Zustand
- Introduce TypeScript
- Add React Hook Form
- Add API interceptors
- Add retry/error middleware
- Add unit testing

---

# Conclusion

The NexaroPay frontend is a clean modular fintech React application implementing:
- Authentication
- Wallet management
- Transaction handling
- Merchant onboarding
- Theme-aware responsive UI
- Centralized API architecture

The structure is scalable and suitable for future fintech platform expansion.
