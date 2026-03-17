# Trishul System Architecture (LOCKED)

> [!IMPORTANT]
> ARCHITECTURE IS LOCKED. No structural changes allowed. Follow module rules, API contracts, and layering strictly.

## 🚨 Backend Rules (Non-Negotiable)

1.  **Controller NEVER talks to DB**: Controllers handle HTTP requests/responses only.
2.  **Service contains ALL business logic**: The orchestration and business rules live here.
3.  **Repository ONLY handles Prisma**: Data access is isolated to repositories.
4.  **No cross-module imports**: Except via services.
5.  **Strict Validation**: All input MUST be validated using **Zod**.

## 📡 API Contract (Strict Format)

All responses must follow this structure:

### ✅ Success
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

### ❌ Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "string",
    "code": "ERROR_CODE"
  }
}
```

## 📱 Frontend Rules (Feature-Driven)

1.  **NO business logic in UI**: Components are for rendering only.
2.  **ALL API calls go via /services**: No direct fetch/axios calls in components.
3.  **Types = API shapes ONLY**: Do not share TypeScript types between backend and frontend.
4.  **Feature Isolation**: Each feature (`admin`, `auth`, `driver`) is isolated. No cross-feature dependencies.

## 🔌 Realtime Core
- **Backend**: `backend/src/realtime/`
- **Frontend**: `frontend/src/services/socket/`
- **Use Cases**: Live GPS tracking, Driver status, Trip updates.

## 🧠 Architectural Truths
1.  **Database = Single Source of Truth**: Prisma schema defines everything. Types are NOT truth.
2.  **Backend = Brain**: Handling pricing, billing, invoices, and the trip engine.
3.  **Frontend = View Layer**: Renders data and calls APIs. Nothing else.
4.  **Types ≠ Contracts**: Contracts are defined via the API format, not shared TS files.

## 🚀 Next Focus
1.  **Trip Engine**: Core logic for managing trips.
2.  **Invoice System**: The USP - strategic billing and pricing.
3.  **Realtime Tracking**: Socket integration for live updates.
