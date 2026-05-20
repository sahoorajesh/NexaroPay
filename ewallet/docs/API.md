# NexaroPay eWallet API Documentation

This repo contains multiple Spring Boot services. Each service runs on its own port (from `application.properties`) and exposes endpoints under the controller `@RequestMapping` paths.

All JSON examples below use the exact DTO field names from the code.

## User Service (port 8091)

Base URL: `http://localhost:8091`

### Create User

`POST /user-service/user`

Request body (JSON) (`UserDTO`):
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "9999999999",
  "kycNumber": "KYC123456"
}
```

Response:
`200 OK` (body is a `long` userId)
```json
1
```

curl:
```bash
curl -X POST "http://localhost:8091/user-service/user" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Rajesh Kumar",
    "email":"rajesh@example.com",
    "phone":"9999999999",
    "kycNumber":"KYC123456"
  }'
```

### Get User Details

`GET /user-service/user-details/{userId}`

Path params:
- `userId` (number)

Response:
`200 OK` (`UserDTO`)
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "phone": "9999999999",
  "kycNumber": "KYC123456"
}
```

curl:
```bash
curl "http://localhost:8091/user-service/user-details/1"
```

### Login

`POST /user-service/login`

Request body (JSON) (`LoginRequestDTO`):
```json
{
  "email": "rajesh@example.com",
  "kyc": "KYC123456"
}
```

Response:
`200 OK` (`LoginResponseDTO`)
```json
{
  "success": true,
  "message": "Login successful.",
  "userId": 1,
  "user": {
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "9999999999",
    "kycNumber": "KYC123456"
  },
  "token": "<access-token>",
  "refreshToken": "<refresh-token>"
}
```

### Refresh Token

`POST /user-service/refresh-token`

Request body (JSON) (`RefreshTokenRequestDTO`):
```json
{
  "refreshToken": "<refresh-token>"
}
```

Response:
`200 OK` (`LoginResponseDTO`)
```json
{
  "success": true,
  "message": "Token refreshed successfully.",
  "userId": 1,
  "user": {
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "9999999999",
    "kycNumber": "KYC123456"
  },
  "token": "<new-access-token>",
  "refreshToken": "<new-refresh-token>"
}
```

Notes:
- Access tokens are used in `Authorization: Bearer <access-token>`.
- Refresh tokens are rotated on every refresh; the old refresh token is blacklisted.

### Logout

`POST /user-service/logout`

Headers:
- `Authorization: Bearer <access-token>` if available

Request body (JSON) (`LogoutRequestDTO`):
```json
{
  "refreshToken": "<refresh-token>"
}
```

Response:
`200 OK` (`LogoutResponseDTO`)
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

## Wallet Service (port 8092)

Base URL: `http://localhost:8092`

### Get Wallet Details

`GET /wallet-service/wallet-details/{userId}`

Path params:
- `userId` (number)

Response:
`200 OK` (`WalletInfoDTO`)
```json
{
  "walletId": 10,
  "userId": 1,
  "balance": 2500.0
}
```

curl:
```bash
curl "http://localhost:8092/wallet-service/wallet-details/1"
```

### Check Wallet Balance

`GET /wallet-service/check-balance/{userId}`

Path params:
- `userId` (number)

Response:
`200 OK` (`WalletInfoDTO`)
```json
{
  "walletId": 10,
  "userId": 1,
  "balance": 2500.0
}
```

curl:
```bash
curl "http://localhost:8092/wallet-service/check-balance/1"
```

### Add Money (Initiate Payment Gateway Flow)

`POST /wallet-service/add-money`

Request body (JSON) (`AddMoneyReq`):
```json
{
  "amount": 100.0,
  "userId": 1,
  "merchantId": 1
}
```

Notes:
- In the current implementation, `merchantId` is overwritten in code to `1L` before calling the payment gateway.

Response:
`200 OK` (`AddMoneyResponse`)
```json
{
  "url": "http://localhost:9090/payment-page/<txnId>",
  "txnId": "PG_TXN_123"
}
```

curl:
```bash
curl -X POST "http://localhost:8092/wallet-service/add-money" \
  -H "Content-Type: application/json" \
  -d '{
    "amount":100.0,
    "userId":1,
    "merchantId":1
  }'
```

### Process Payment (Finalize Wallet Flow Using Payment Gateway Txn Id)

`GET /wallet-service/process-payment/{pgTxnId}`

Path params:
- `pgTxnId` (string)

Response:
`200 OK` (plain string)
```json
"OK"
```

curl:
```bash
curl "http://localhost:8092/wallet-service/process-payment/PG_TXN_123"
```

## Transaction Service (port 8094)

Base URL: `http://localhost:8094`

### Initiate Transfer

`POST /transaction-service/transfer`

Request body (JSON) (`TransactionRequestDTO`):
```json
{
  "toUserId": 2,
  "fromUserId": 1,
  "amount": 50.0,
  "comment": "Dinner split"
}
```

Response:
`202 Accepted` (body is a transaction id string; may be `null` on error in current implementation)
```json
"TXN_123"
```

curl:
```bash
curl -X POST "http://localhost:8094/transaction-service/transfer" \
  -H "Content-Type: application/json" \
  -d '{
    "toUserId":2,
    "fromUserId":1,
    "amount":50.0,
    "comment":"Dinner split"
  }'
```

### Get Transaction Status

`GET /transaction-service/status/{txnId}`

Path params:
- `txnId` (string)

Response:
`200 OK` (`TransactionStatusDTO`)
```json
{
  "status": "SUCCESS",
  "reason": "OK"
}
```

curl:
```bash
curl "http://localhost:8094/transaction-service/status/TXN_123"
```

### List User Transactions

`GET /transaction-service/users/{userId}/transactions?page=0&size=10`

Path params:
- `userId` (number)

Query params:
- `page` (number, zero-based, default `0`)
- `size` (number, default `10`, max `50`)

Response:
`200 OK` (Spring `Page<TransactionListItemDTO>`)
```json
{
  "content": [
    {
      "txnId": "TXN_123",
      "fromUserId": 1,
      "toUserId": 2,
      "amount": 50.0,
      "status": "SUCCESS",
      "comment": "Dinner split",
      "reason": null,
      "txnCreatedDate": "2026-05-21T00:00:00+05:30",
      "txnLastUpdatedDate": "2026-05-21T00:00:04+05:30"
    }
  ],
  "totalPages": 1,
  "totalElements": 1,
  "number": 0,
  "size": 10
}
```

curl:
```bash
curl "http://localhost:8094/transaction-service/users/1/transactions?page=0&size=10"
```

### Monthly Wallet Analysis

`GET /transaction-service/users/{userId}/monthly-analysis`

Calculates successful debit and credit totals from the start of the current month through the end of the current month.

Path params:
- `userId` (number)

Response:
`200 OK` (`MonthlyWalletAnalysisDTO`)
```json
{
  "hasTransactions": true,
  "totalSpentThisMonth": 150.0,
  "totalReceivedThisMonth": 250.0,
  "periodStart": "2026-05-01T00:00:00+05:30",
  "periodEnd": "2026-05-31T23:59:59.999999999+05:30"
}
```

curl:
```bash
curl "http://localhost:8094/transaction-service/users/1/monthly-analysis"
```

## Payment Gateway Service (port 9090)

Base URL: `http://localhost:9090`

### Register Merchant

`POST /merchant-service/register-merchant`

Request body (JSON) (`MerchantDetailsDTO`):
```json
{
  "merchantKey": "mkey_abc",
  "name": "Demo Merchant",
  "email": "merchant@example.com",
  "statusWebhook": "http://localhost:8080/webhook/pg-status",
  "redirectionUrl": "http://localhost:3000/pg-return"
}
```

Response:
`200 OK` (body is a `long` merchantId)
```json
1
```

curl:
```bash
curl -X POST "http://localhost:9090/merchant-service/register-merchant" \
  -H "Content-Type: application/json" \
  -d '{
    "merchantKey":"mkey_abc",
    "name":"Demo Merchant",
    "email":"merchant@example.com",
    "statusWebhook":"http://localhost:8080/webhook/pg-status",
    "redirectionUrl":"http://localhost:3000/pg-return"
  }'
```

### Init Payment

`POST /pg-service/init-payment`

Request body (JSON) (`PaymentPageRequest`):
```json
{
  "merchantId": 1,
  "merchantKey": "mkey_abc",
  "amount": 100.0,
  "orderId": "ORDER_001",
  "userId": 1
}
```

Response:
`200 OK` (`PaymentInitResponse`)
```json
{
  "url": "http://localhost:9090/payment-page/<txnId>",
  "txnId": "PG_TXN_123"
}
```

curl:
```bash
curl -X POST "http://localhost:9090/pg-service/init-payment" \
  -H "Content-Type: application/json" \
  -d '{
    "merchantId":1,
    "merchantKey":"mkey_abc",
    "amount":100.0,
    "orderId":"ORDER_001",
    "userId":1
  }'
```

### Payment Status

`GET /pg-service/payment-status/{txnId}`

Path params:
- `txnId` (string)

Response:
`200 OK` (`TransactionDetailDto`)
```json
{
  "status": "SUCCESS",
  "userId": 1,
  "amount": 100.0
}
```

curl:
```bash
curl "http://localhost:9090/pg-service/payment-status/PG_TXN_123"
```

### Do Payment (Redirect)

`POST /pg-service/doPayment/{txnId}`

Path params:
- `txnId` (string)

Response:
`302 Found` with `Location` header set to the next URL.

curl (show redirect headers):
```bash
curl -i -X POST "http://localhost:9090/pg-service/doPayment/PG_TXN_123"
```

### Payment Page (HTML, not JSON)

`GET /payment-page/{txnId}`

Purpose:
- Returns a server-rendered HTML page (`paymentpage.html`) that shows merchant name, amount, and submits to `/pg-service/doPayment/{txnId}`.

