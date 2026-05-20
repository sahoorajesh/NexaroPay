# NexaroPay eWallet

NexaroPay is a full-stack eWallet application built with a Spring Boot microservice backend and a React frontend. It supports user onboarding, JWT login/logout, wallet balance management, add-money flows, peer-to-peer transfers, transaction tracking, monthly wallet analysis, merchant registration, and a local payment-gateway simulation.

The project is designed as a practical distributed-system learning project: services communicate through REST and Kafka events, persist data in PostgreSQL, use Redis for token blacklisting/cache support, and expose a Vite-powered React UI.

## Features

- User registration, login, and backend-integrated logout
- JWT-secured APIs with token blacklist support
- Wallet creation and balance lookup
- Add-money flow through the payment gateway module
- Peer-to-peer wallet transfer
- Transaction status lookup
- Paginated transaction history with copyable transaction IDs
- Wallet page with latest 10 transactions
- Welcome dashboard with current-month debit/credit pie analysis
- Merchant registration and payment gateway demo page
- Kafka-driven wallet, transaction, and notification events
- Email notification service support through Gmail app password configuration

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router |
| Backend | Java 21, Spring Boot 4, Spring Web MVC, Spring Security |
| Persistence | PostgreSQL, Spring Data JPA |
| Messaging | Apache Kafka |
| Cache/session support | Redis |
| Build tools | Maven Wrapper, npm |

## Repository Structure

```text
.
+-- CommonUtils/             # Shared Kafka/security/filter utilities
+-- userService/             # Users, login, logout, JWT issuing
+-- walletService/           # Wallet creation, balance, add-money processing
+-- transactionService/      # Transfers, status, transaction history, analysis
+-- notificationService/     # Kafka-driven notification/email handling
+-- PaymentGateway/          # Merchant and payment gateway simulation
+-- frontend/                # React/Vite application
+-- docs/API.md              # Detailed API reference
+-- SetupReadME              # Original local setup notes
```

## Service Ports

| Service | Port |
| --- | ---: |
| User Service | `8091` |
| Wallet Service | `8092` |
| Notification Service | `8093` |
| Transaction Service | `8094` |
| Payment Gateway | `9090` |
| Frontend | `3000` |

The frontend calls `/api/<service-prefix>/*` in development. Vite proxies those requests to the local services in `frontend/vite.config.js`.

## Prerequisites

- Java 21
- Node.js 18 or newer
- PostgreSQL running locally on `5432`
- Redis running locally on `6379`
- Apache Kafka running locally on `9092`
- Maven Wrapper from this repository

Default database settings in the service `application.properties` files:

```text
database: nexaroPayDB
username: postgres
password: postgres
```

Create the database before starting services:

```sql
CREATE DATABASE nexaroPayDB;
```

For notification emails, set a Gmail app password in the environment:

```bash
APP_PASSWORD=<your-gmail-app-password>
```

Do not commit real secrets. The checked-in values are local-development defaults.

## Running Locally

Start PostgreSQL, Redis, and Kafka first.

Then run the backend services from the repository root in separate terminals:

```bash
./mvnw spring-boot:run -pl userService
./mvnw spring-boot:run -pl walletService
./mvnw spring-boot:run -pl transactionService
./mvnw spring-boot:run -pl notificationService
./mvnw spring-boot:run -pl PaymentGateway
```

On Windows PowerShell, use:

```powershell
.\mvnw.cmd spring-boot:run -pl userService
```

Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Kafka Topics

The services use these topics by default:

| Topic | Purpose |
| --- | --- |
| `USER-REGISTERED` | User registration event consumed by wallet/notification flows |
| `WALLET-UPDATED` | Wallet update event |
| `TXN-INIT` | Transfer initiated event |
| `TXN-COMPLETED` | Transfer completion event |

## Key API Areas

Full request/response examples are documented in [API.md](ewallet/docs/API.md).

Important endpoint groups:

- `POST /user-service/user`
- `POST /user-service/login`
- `POST /user-service/logout`
- `GET /wallet-service/wallet-details/{userId}`
- `POST /wallet-service/add-money`
- `POST /transaction-service/transfer`
- `GET /transaction-service/status/{txnId}`
- `GET /transaction-service/users/{userId}/transactions`
- `GET /transaction-service/users/{userId}/monthly-analysis`
- `POST /merchant-service/register-merchant`
- `POST /pg-service/init-payment`

## Frontend Screens

- Landing page
- Signup and login
- Welcome dashboard with wallet analysis
- Wallet balance and latest transactions
- Add money
- Transfer money
- Transaction status lookup
- Paginated transaction history
- Profile
- Merchant registration

## Build and Verification

Compile the transaction service and dependencies:

```bash
./mvnw -pl transactionService -am compile
```

Build the frontend:

```bash
cd frontend
npm run build
```

Build all Maven modules:

```bash
./mvnw clean compile
```

## Notes

- `spring.jpa.hibernate.ddl-auto=update` is enabled for local schema evolution.
- The payment gateway is a local simulation module, not a real payment provider integration.
