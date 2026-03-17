# Trishul API Specification

## Global Response Format

### Success
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

### Error
```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Human readable message",
    "code": "ERROR_CODE"
  }
}
```

## Endpoints (To be implemented)

### Auth
- `POST /api/auth/login`
- `POST /api/auth/mfa/verify`

### Trips (Trip Engine)
- `POST /api/trips/start`
- `POST /api/trips/end`
- `GET /api/trips/:id`

### Invoices (Billing Engine)
- `GET /api/invoices/generate/:tripId`
- `GET /api/invoices/:id`
