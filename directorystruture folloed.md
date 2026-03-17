# Trishul - Directory Structure

This document outlines the organized directory structure of the Trishul monorepo.

## Project Root
```text
Trishul/
├── backend/                # Node.js/Express & Prisma Backend
│   ├── prisma/             # Database Schema & Migrations
│   ├── src/                # Backend Source Code
│   │   ├── config/         # System Configurations
│   │   ├── middleware/     # Custom Express Middleware
│   │   ├── modules/        # Domain-driven Modules (auth, trips, etc.)
│   │   └── server.ts       # Entry Point
│   ├── .env                # Environment Variables
│   └── package.json
│
├── frontend/               # React Native/Expo Frontend
│   ├── src/                # Frontend Source Code
│   │   ├── assets/         # Static Media & Fonts
│   │   ├── components/     # High-level Reusable Components
│   │   ├── constants/      # App Constants & Configs
│   │   ├── features/       # Feature-based Separation
│   │   │   ├── admin/      # Admin Dashboards & Management
│   │   │   ├── auth/       # Login & Authentication Flows
│   │   │   └── driver/     # Driver Views & Functionality
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── navigation/     # App Navigation Logic (Role-based)
│   │   ├── services/       # External APIs & Auth Logic
│   │   ├── store/          # State Management (Zustand)
│   │   ├── types/          # Shared TypeScript Interfaces
│   │   └── utils/          # Helper Functions
│   ├── package.json
│   └── tsconfig.json
│
├── infrastructure/         # Deployment & Containerization
│   ├── docker-compose.yml  # Local/Production Orchestration
│   └── nginx.conf          # Gateway Configuration
│
└── scripts/                # Utility & DevOps Scripts
    ├── deploy.sh           # Manual Deployment Script
    └── seed_db.sh          # Database Initialization
```

## Key Architectural Decisions
1. **Monorepo**: Both backend and frontend reside in a single repository for easier coordination.
2. **Feature-Based Frontend**: The `frontend/src/features` folder separates code by user roles (Admin vs Driver), reducing spaghetti code.
3. **Flat Frontend**: Removed the legacy `mobile/` subfolder to keep the structure concise.
4. **Role-Based Navigation**: Separate navigators in `frontend/src/navigation` handle conditional routing based on user authentication and role.
