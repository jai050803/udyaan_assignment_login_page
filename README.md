# Udyam Registration Portal

A full-stack, responsive web application for MSME (Udyam) registration. It replicates a dynamic, multi-step government form schema that is automatically scraped and validated.

## Features
- **Dynamic Form Schema**: Form structure and regex validations are driven dynamically from a Python Playwright scraper (`form-schema.json`).
- **Two-Step Authentication**: Validates 12-digit Aadhaar formats, generates and hashes OTPs, and verifies them with JWT-based session handling.
- **Auto-Fill PIN Code Proxy**: Proxies the PostPIN API to seamlessly look up and auto-fill City and State fields.
- **Database Persistence**: Fully typed Prisma ORM backing a PostgreSQL database with deterministically hashed Aadhaar numbers.
- **Docker Ready**: One-command `docker-compose` ecosystem.

---

## Commit Table

| Feature / Phase | Description |
|-----------------|-------------|
| **Phase 1: Scraper** | Python Playwright script that extracts dynamic form constraints into `form-schema.json`. |
| **Phase 2: Backend Scaffold** | Node.js + Express setup, Prisma schema definitions, and robust environment validations using Zod. |
| **Phase 3: Auth & OTP** | Implemented `POST /aadhaar/validate`, `POST /otp/send`, and `POST /otp/verify` with JWT session generation. |
| **Phase 4: PAN & Submission** | Implemented `POST /pan/validate` and `POST /pan/submit` with strict Zod regex boundaries. |
| **Phase 5: PIN Proxy** | Created `GET /pin/:pincode` proxy endpoint to bypass CORS and auto-fetch location data. |
| **Phase 6: Jest Testing** | Added comprehensive unit tests for Aadhaar, OTP, and PAN validation logic. |
| **Phase 7: Frontend Scaffold** | Initialized Vite + React + TypeScript, defined reusable UI components (Input, Button, ErrorMessage). |
| **Phase 8: Step Components** | Built `AadhaarForm`, `OtpInput`, and `PanForm` heavily leveraging `react-hook-form`. |
| **Phase 9: PIN Hook** | Abstracted auto-fill logic into `usePinLookup` with strict 500ms debouncing. |
| **Phase 10: Dynamic Schema** | Intercepted static Zod validation with dynamic `.superRefine()` regex patterns from the scraped JSON. |
| **Phase 11: Polish** | Finalized responsive CSS, CSS transitions, and strict keyboard accessibility outlines. |
| **Phase 12: Docker** | Multi-stage Dockerfiles and `docker-compose.yml` for isolated production deployments. |

---

## API Endpoints

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/aadhaar/validate` | Validates exactly 12-digits, doesn't start with 0. | No |
| `POST` | `/otp/send` | Generates a 6-digit OTP and hashes it to `otp_sessions`. | No |
| `POST` | `/otp/verify` | Verifies the OTP hash. Returns a JWT `sessionToken`. | No |
| `POST` | `/pan/validate` | Validates PAN format `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`. | **Yes** (Bearer JWT) |
| `POST` | `/pan/submit` | Finalizes the form data into the `registrations` table. | **Yes** (Bearer JWT) |
| `GET`  | `/pin/:pincode` | Proxies `api.postalpincode.in` to fetch city/state safely. | No |

---

## Environment Variables (`.env`)

Match your backend `.env` file to the `.env.example`:

```env
PORT=7002
DB_HOST=localhost
DB_PORT=5432
DB_NAME=udyam_db
DB_USER=postgres
DB_PASSWORD=replace-with-your-db-password
SESSION_SECRET=replace-with-a-secure-session-secret
JWT_SECRET=replace-with-a-secure-jwt-secret
JWT_EXPIRES_IN=30m
OTP_EXPIRY_MINUTES=10
OTP_RATE_LIMIT_PER_HOUR=3
POSTPIN_BASE_URL=https://api.postalpincode.in/pincode
```

---

## Database Schema

Defined in `prisma/schema.prisma`:

```prisma
model Registration {
  id           String   @id @default(uuid())
  aadhaarHash  String   @unique
  pan          String
  businessName String
  ownerName    String
  pincode      String   @db.VarChar(6)
  city         String
  state        String
  status       Status   @default(PENDING)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@map("registrations")
}

model OtpSession {
  id          String   @id @default(uuid())
  aadhaarHash String
  otpHash     String
  expiresAt   DateTime
  verified    Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  @@map("otp_sessions")
}

enum Status {
  PENDING
  VERIFIED
  REJECTED
}
```

---

## How to Run Locally

### Option 1: Docker (Recommended)
You can boot the entire stack (Postgres + Node Backend + NGINX Frontend) simultaneously using Docker Compose:

1. Ensure Docker Desktop is running.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. The frontend is accessible at **http://localhost:5173** and the backend at **http://localhost:4000**. Migrations run automatically.

### Option 2: Manual / Local Dev
1. **Database:** Ensure you have PostgreSQL running locally on port `5432` with a database named `udyam_db`.
2. **Backend:**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev
   ```
   *(Backend starts on port 7002)*
3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *(Frontend starts on port 5173 and automatically proxies `/api` to 7002)*

---

## Known Limitations

- **OTP Implementation:** The OTP is currently returned in the API response payload strictly for development and testing purposes. In a production environment, this must be removed and integrated with a real SMS gateway.
- **Aadhaar Verification:** The current Aadhaar validation logic purely checks the mathematical format (12 digits, non-zero start). Actual real-world verification requires authorized access to the UIDAI government API.
- **PostPIN Dependency:** The application relies on `api.postalpincode.in` to fetch city and state dynamically. This public API is free but occasionally rate-limited or slow. A fallback manual-entry option should be added if the network drops.