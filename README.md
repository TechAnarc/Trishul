# 🔱 Trishul Platform

> **Travel Agency Intelligence Platform** — Automate the complete workflow of Trishul Travels from manual bookkeeping to an intelligent, scalable fleet-management platform.

---

## 🚀 Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native (Expo) + TypeScript + React Navigation + Zustand |
| Backend | Node.js + Express.js + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Real-time | Socket.io (location tracking) |
| Auth | JWT + Refresh Tokens + MFA (TOTP / Email OTP / SMS) |
| Cache | Redis |
| DevOps | Docker + Nginx |

---

## 📂 Project Structure

```
trishul-platform/
├── apps/
│   ├── mobile/          # React Native Expo App
│   └── backend/         # Node.js Express API
├── packages/
│   ├── types/           # Shared TypeScript types
│   ├── ui/              # Shared UI components
│   ├── config/          # Shared config
│   └── utils/           # Shared utilities
├── infrastructure/
│   ├── docker/          # Dockerfiles
│   ├── nginx/           # Nginx config
│   └── deployment/      # Deployment scripts
├── prisma/              # Database schema & migrations
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL 14+
- Docker (optional)

### 1. Clone & Install

```bash
git clone https://github.com/youorg/trishul-platform.git
cd trishul-platform
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Database Setup

```bash
cd apps/backend
npx prisma migrate dev --name init
npm run seed
```

### 4. Start Development

```bash
# From root - starts backend
npm run dev

# Mobile (separate terminal)
cd apps/mobile
npm start
```

---

## 🔐 Authentication Flow

```
POST /api/v1/auth/login
  → { requiresMfa: true, userId, mfaMethod }

POST /api/v1/auth/mfa/verify
  → { tokens: { accessToken, refreshToken }, user }
```

### Roles
| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Full system access |
| `ADMIN` | Fleet management, invoicing |
| `DRIVER` | Trip management, expenses |

---

## 📡 Real-time Tracking

Socket.io namespace: `/tracking`

```
Driver emits:  location:update → { tripId, lat, lng, speed, timestamp }
Admin receives: location:update (all active drivers)
Public:         trip:ABC123 room (no auth, unique trip link)
```

---

## 🐳 Docker

```bash
docker compose up -d
```

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend dev server |
| `npm run build` | Build backend for production |
| `npm run seed` | Seed Super Admin |
| `npm run prisma:migrate` | Run DB migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run format` | Format all code |

---

## 🔱 Development Phases

| Phase | Focus |
|-------|-------|
| Phase 1 ✅ | Architecture, DB schema, Auth system |
| Phase 2 | Admin & Driver dashboards |
| Phase 3 | Trip management & GPS tracking |
| Phase 4 | Invoice automation |
| Phase 5 | Payments + QR codes |
| Phase 6 | Analytics & AI estimation |

---

## 🙏 Jai Mahakal

*Build with clarity, precision, and purpose.*