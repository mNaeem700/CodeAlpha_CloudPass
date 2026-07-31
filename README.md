# ☁️ Cloud Bus Pass & Online Ticket Booking System

A production-ready, full-stack, cloud-hosted bus pass and online ticket booking platform built with **TypeScript**, **Express**, **React**, **Tailwind CSS**, and **Google Gemini AI**.

The platform is specifically engineered to solve traditional transit ticketing vulnerabilities by **preventing ticket loss and theft**, **eliminating pricing errors**, and **handling massive rush-hour traffic surges through dynamic cloud auto-scaling**.

---

## 🌟 Key Features

### 1. 🛡️ Anti-Theft & Anti-Loss Digital Pass Wallet
- **Cloud Anti-Loss Backup**: Every pass is cryptographically bound to the passenger's cloud account email and device fingerprint. Passes can be retrieved from any device without fear of physical ticket loss or paper damage.
- **Rolling TOTP Security Code (Anti-Screenshot Theft)**: Passes feature a dynamic 6-digit TOTP security code that refreshes every 30 seconds. This prevents passengers from sharing static screenshots with unauthorized users.
- **Cryptographic SHA-256 Signature**: Every issued pass carries a unique signature generated from the pass ID, user email, valid timestamp, and secret salt to prevent counterfeit duplication.

### 2. 💵 Automated Price Protection Engine
- **Distance & Zone Matrix**: Fare is automatically computed based on origin stop, destination stop, distance in kilometers, and zone boundaries.
- **Verified Concessions**: Automatically applies verified concession discounts (50% Student Concession, 40% Senior Concession, 60% Veteran / Accessibility Pass) to eliminate manual overcharging or human pricing errors.
- **Transparent Itemized Breakdown**: Displays gross fare, concession discounts, distance charges, and zero platform fees before final payment.

### 3. ⚡ Dynamic Elastic Cloud Auto-Scaler
- **Surge Traffic Mitigation**: Built to handle high-traffic rush hours (up to 30,000 requests/sec).
- **Automated Node Provisioning**: Automatically spins up container worker nodes in ~2.5 seconds when CPU load exceeds threshold.
- **Interactive Simulator**: Includes a live telemetry panel where administrators can simulate Normal Traffic (4.7k req/s), Rush Hour (15k req/s), or Flash Crowd surges (30k req/s).

### 4. 🛂 Conductor Inspector Scanner & Audit Ledger
- **Real-Time QR Verification**: Conductors can scan digital QR passes using their camera or enter pass IDs manually.
- **Fraud Detection**: Instantly alerts inspectors to expired passes, tampered cryptographic signatures, revoked/stolen passes, or static screenshots with expired TOTP tokens.
- **Audit Logging**: Keeps an audit log of all pass inspections for transit security tracking.

### 5. 🚌 Live Route & Bus GPS Explorer
- **Interactive Route Timetables**: View Metro Express, City Loop, Suburban Commuter, and Airport Shuttle lines.
- **Live Bus Occupancy & Speed**: Tracks active buses with driver info, speed (km/h), and real-time passenger occupancy capacity meters.

### 6. 🤖 Server-Side Gemini AI Transit Assistant
- **Gemini 2.5 Flash API**: Integrated server-side assistant providing instant guidance on pass selection, concession eligibility, anti-loss mechanics, and route suggestions.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion, Canvas-Confetti, QRCode Generator.
- **Backend**: Express.js (Node.js CommonJS bundled via `esbuild`), Server-Side `@google/genai` SDK.
- **Build System**: Vite (Development SPA proxy) + `esbuild` (Production server bundling to `dist/server.cjs`).
- **Security**: TOTP rolling window tokens, SHA-256 checksum signatures, device fingerprinting.

---

## 📡 Backend API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check & cluster status |
| `/api/routes` | `GET` | Fetches transit routes, stops, and live bus positions |
| `/api/pricing` | `POST` | Computes accurate fare breakdown for pass type and stops |
| `/api/passes` | `GET` | Retrieves saved passes from cloud wallet |
| `/api/passes` | `POST` | Provisions a new cryptographically secured digital bus pass |
| `/api/passes/:id/revoke` | `POST` | Marks a lost or stolen pass as revoked in security ledger |
| `/api/verify` | `POST` | Verifies scanned pass QR code / hash against cloud database |
| `/api/autoscale/metrics` | `GET` | Returns live cluster telemetry, RPS, node CPU, and latency |
| `/api/autoscale/simulate-spike` | `POST` | Simulates high traffic load and triggers auto-scaler |
| `/api/autoscale/reset` | `POST` | Resets cluster load to baseline |
| `/api/chat` | `POST` | Server-side Gemini AI transit assistant query handler |

---

## 🛠️ How It Works (Step-by-Step)

### Passenger Workflow:
1. **Book Pass**: Choose pass duration (Single Ride, 24h Daily, 30-Day Monthly) and concession category (Student, Senior, Veteran, Standard).
2. **Select Route**: Pick boarding stop and destination. The Price Protection Engine calculates distance, zone surcharges, and discount savings.
3. **Issue & Sync**: Upon payment, the server registers the pass in the cloud database with a cryptographic signature.
4. **Present Pass**: Open **My Cloud Wallet** on any smartphone. Display the active QR code and rolling 30-second security code to board the bus.

### Conductor Workflow:
1. Open the **Inspector Scanner** portal.
2. Point device camera or enter the pass ID / scan signature.
3. The server checks the signature, TOTP code, and expiration date in real time, displaying a green **APPROVED** or red **SECURITY FLAG DETECTED** banner.

---

## 🚀 Development & Production Build Instructions

### Development Server
To start the integrated Express + Vite dev server on port `3000`:
```bash
npm run dev
```

### Production Build
To bundle the frontend assets with Vite and compile `server.ts` into a self-contained `dist/server.cjs` file using `esbuild`:
```bash
npm run build
```

### Production Start
To run the production build:
```bash
npm start
```
