# 🔱 Trishul - Current Technology Stack

This document outlines the current technology stack and architectural choices for the Trishul platform as of the core system initiation (Trip Engine implementation).

## 🚀 Backend Layer (API & Core Logic)

The backend is built as a robust, scalable REST API with real-time capabilities.

*   **Runtime Environment:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript (Strict Mode)
*   **Database ORM:** Prisma
*   **Primary Database:** PostgreSQL (Relational integrity, ACID compliance)
*   **In-Memory Data Store:** Redis (Tokens, MFA states, Rate limiting, Pub/Sub) *Currently mocked in development.*
*   **Validation:** Zod (Schema-based runtime type checking and validation)
*   **Real-time Communication:** Socket.io (WebSocket implementation for live tracking and status updates)
*   **Security & Authentication:**
    *   `jsonwebtoken` (JWT for Access & Refresh tokens)
    *   `bcryptjs` (Password hashing)
    *   `otplib` (TOTP generation for 2FA)
*   **Email Services:** Nodemailer (For Email OTPs)
*   **Testing:** Jest & Supertest (Unit and API flow assertions)

---

## 📱 Frontend Layer (Universal App)

The frontend is a unified cross-platform application capable of running on mobile (iOS/Android) and web.

*   **Core Framework:** React Native
*   **App Framework:** Expo (SDK 50+)
*   **Language:** TypeScript
*   **Navigation:** React Navigation (Native Stack & Bottom Tabs)
*   **State Management:** Zustand (Predictable, minimalist global state)
*   **Data Fetching & Caching:** `@tanstack/react-query` & `axios`
*   **Real-time Client:** `socket.io-client`
*   **Local Storage:** `expo-secure-store` (Encrypted persistent storage for tokens)
*   **Maps & Tracking:** `react-native-maps` & `expo-location`
*   **Web Support:** `react-native-web` & `@expo/metro-runtime`

---

## ⚙️ Infrastructure & Tooling

*   **Containerization:** Docker & Docker Compose (Local instances of PostgreSQL and Redis)
*   **Version Control:** Git / GitHub
*   **Monorepo Strategy:** Modular directory structure keeping frontend, backend, and infrastructure strictly isolated but cohesive.

---

## 🏗️ Architectural Patterns Followed

1.  **Strict Layered Architecture (Backend):**
    *   **Controllers:** Handle HTTP requests and responses only.
    *   **Services:** Contain 100% of the business logic.
    *   **Repositories:** Exclusive access point for database operations via Prisma.
2.  **Role-Based Access Control (RBAC):** Strictly enforced at the middleware layer (`SUPER_ADMIN`, `ADMIN`, `DRIVER`).
3.  **Deterministic State Machines:** Trip status transitions are rigidly controlled at the service layer to prevent illegal states.
4.  **Feature-Driven UI (Frontend):** Organized by features (e.g., `admin`, `driver`, `auth`) rather than pure technical separation.
