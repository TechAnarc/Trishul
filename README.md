## 🔱 Trishul Architecture Laws (NON-NEGOTIABLE)

1. **Single Source of Truth**: The database schema (`backend/prisma/schema.prisma`) is the ONLY source of truth. Types flow from DB → Repository → Service → API.
2. **Absolute Backend Authority**: ALL business logic (pricing, calculations, fraud checks) MUST live in the backend. Frontend is for display and input only.
3. **Local Types**: Backend and Frontend maintain their own types. No shared packages. Sync via scripts or API contracts if needed.
4. **Strict Layering**: Every backend module follows `Controller → Service → Repository → Database`.
5. **Module Isolation**: Modules in `backend/src/modules/` must be self-contained and independent.
6. **Feature-Based Frontend**: Frontend code is organized by features (`frontend/mobile/src/features/`).
7. **Consistent API Contract**: All endpoints must return `{ success, data, error }`.

## 📂 Project Structure

- `frontend/mobile/`: React Native (Expo) - Feature-based.
- `backend/`: Node.js Express API - Modular Layered Architecture.
- `infrastructure/`: Deployment & Docker configs.
- `docs/`: Architecture and API specifications.
- `scripts/`: DB seeding and utility scripts.

---
**Jai Mahakal**

