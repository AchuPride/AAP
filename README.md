# SafeReport — Anonymous GBV Reporting & Case Tracking Platform

A production-ready, privacy-first web application for anonymously reporting and tracking Gender-Based Violence (GBV) cases. No personal information is ever collected from reporters.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React + Vite)                     │
│  /pages: Home · ReportIncident · TrackCase · Login · Dashboard   │
│  /pages: CaseDetail · AdminDashboard · NotFound                  │
│  /components: Navbar · Footer · Timeline · StatusBadge · ...     │
│  /context: AuthContext (JWT state)                               │
│  /services: api.js (Axios + interceptors)                        │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS / REST
┌──────────────────────────────▼──────────────────────────────────┐
│                    SERVER (Node.js + Express)                    │
│  Middleware: Helmet · CORS · Rate-limit · Joi validation         │
│  Routes:  POST /api/report                                       │
│           GET  /api/cases/track/:token  (public)                 │
│           GET  /api/cases              (officer|admin)           │
│           GET  /api/cases/:id          (officer|admin)           │
│           PUT  /api/cases/:id          (officer|admin)           │
│           POST /api/auth/login                                   │
│           GET  /api/auth/me                                      │
│           GET  /api/admin/stats        (admin)                   │
│           GET  /api/admin/officers     (admin)                   │
│           GET  /api/admin/users        (admin)                   │
│           POST /api/admin/users        (admin)                   │
│           PATCH /api/admin/users/:id/toggle  (admin)             │
└──────────────────────────────┬──────────────────────────────────┘
                               │ pg (Pool)
┌──────────────────────────────▼──────────────────────────────────┐
│                     PostgreSQL Database                          │
│  Tables: roles · users · cases · case_updates                    │
│          case_evidence · audit_logs                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

| Table | Key Fields |
|-------|-----------|
| `roles` | id, name (admin \| officer) |
| `users` | id, username, password_hash, full_name, role_id, is_active, last_login |
| `cases` | id, **case_token** (unique), violence_type, description, location, incident_date, status, assigned_officer_id, is_priority |
| `case_updates` | id, case_id, updated_by, update_type, old_status, new_status, note, public_message |
| `case_evidence` | id, case_id, filename (UUID-based), mime_type, size_bytes |
| `audit_logs` | id, actor_id, action, resource, resource_id, metadata, ip_hash (SHA-256) |

### Case Status State Machine
```
submitted → under_review → assigned → investigating → resolved → closed
```

---

## Security Measures

| Layer | Implementation |
|-------|---------------|
| Headers | `helmet.js` (CSP, HSTS, X-Frame-Options, etc.) |
| Rate Limiting | `express-rate-limit` — global (100/15min), reports (5/hr), auth (10/15min) |
| Input Validation | `Joi` schema validation on all inputs |
| Authentication | `bcryptjs` (cost 12) + `jsonwebtoken` (8h expiry) |
| Authorization | RBAC middleware — `admin` and `officer` roles |
| File Uploads | UUID filenames, MIME type allowlist, 10 MB cap |
| Audit Trail | All staff actions logged; IP stored as SHA-256 hash only |
| Privacy | No name/email/phone/IP stored; case token is the only identifier |

---

## Quick Start (Local)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1 — Clone & Install
```bash
git clone <repo-url> gbv-platform
cd gbv-platform
npm run install:all
```

### 2 — Configure Environment
```bash
cp server/.env.example server/.env
# Edit server/.env — set DATABASE_URL and JWT_SECRET
```

### 3 — Database Setup
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE gbv_platform;"

# Run migrations
npm run migrate

# Seed default admin + officer accounts
npm run seed
# Admin:   admin / Admin@2024!
# Officer: officer1 / Officer@2024!
```

### 4 — Start Development Servers
```bash
npm install          # installs concurrently at root
npm run dev          # starts both server (5000) and client (5173)
```

---

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/report` | Submit anonymous report (multipart/form-data) |
| `GET`  | `/api/cases/track/:token` | Track case by token (public) |
| `POST` | `/api/auth/login` | Staff login → returns JWT |

### Protected (Bearer JWT required)

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET`  | `/api/auth/me` | any | Get current user profile |
| `GET`  | `/api/cases` | officer, admin | List cases |
| `GET`  | `/api/cases/:id` | officer, admin | Full case detail + timeline |
| `PUT`  | `/api/cases/:id` | officer, admin | Update status / add notes |
| `GET`  | `/api/admin/stats` | admin | Stats + officer workload |
| `GET`  | `/api/admin/officers` | admin | List active officers |
| `GET`  | `/api/admin/users` | admin | List all staff |
| `POST` | `/api/admin/users` | admin | Create staff account |
| `PATCH`| `/api/admin/users/:id/toggle` | admin | Activate/deactivate user |

### POST /api/report body (multipart/form-data)
```
violence_type   physical|sexual|psychological|economic|stalking|online_harassment|other  (required)
description     string 20–5000 chars  (required)
location        string max 500 chars  (optional)
incident_date   YYYY-MM-DD            (required)
evidence        file[]                (optional, max 5 × 10 MB each)
```

### 201 Response
```json
{
  "message": "Report submitted successfully.",
  "case_token": "GBV-A1B2C3D4-E5F6G7H8-I9J0K1L2",
  "status": "submitted",
  "submitted_at": "2024-01-15T10:30:00.000Z"
}
```

---

## Deployment Guide

### Database — Neon (free tier, recommended)
1. Sign up at https://neon.tech
2. Create a new project — copy the `postgresql://...` connection string
3. Paste it as `DATABASE_URL` in your backend environment

### Backend — Render
1. Push the repo to GitHub
2. New **Web Service** at https://render.com
   - Root directory: `server`
   - Build: `npm install`
   - Start: `node server.js`
3. Set env vars:
   ```
   NODE_ENV=production
   DATABASE_URL=<neon connection string>
   JWT_SECRET=<64-char random string>
   CLIENT_ORIGIN=https://your-app.vercel.app
   ```
4. Open the Render shell and run:
   ```bash
   node migrations/migrate.js
   node migrations/seed.js
   ```

### Frontend — Vercel
1. New project at https://vercel.com
   - Root directory: `client`
   - Build: `npm run build`
   - Output: `dist`
2. Add env var:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
3. Update `client/src/services/api.js` baseURL to:
   ```js
   baseURL: import.meta.env.VITE_API_URL || '/api',
   ```

### Alternative — Railway (fullstack in one project)
```bash
npm install -g @railway/cli
railway login && railway init
railway add --database postgresql
railway up
```

---

## PWA Support

- Installable on Android and iOS (Add to Home Screen)
- Offline asset caching via Workbox
- Service worker auto-updates

---

## Project Structure

```
gbv-platform/
├── package.json              # Root scripts (dev, migrate, seed)
├── .gitignore
├── README.md
├── server/
│   ├── server.js             # Express entry point
│   ├── config/               # DB pool + Winston logger
│   ├── middleware/            # auth · rbac · rate-limit · validate · upload · auditLog · error
│   ├── models/               # Case.js · User.js (raw pg queries)
│   ├── controllers/          # report · case · auth · admin
│   ├── routes/               # report · cases · auth · admin
│   ├── utils/token.js        # Crypto-secure case token (96-bit)
│   ├── migrations/           # 001_schema.sql · migrate.js · seed.js
│   └── tests/api.test.js
└── client/
    ├── vite.config.js        # Vite + PWA
    ├── tailwind.config.js
    └── src/
        ├── context/AuthContext.jsx
        ├── services/api.js
        ├── components/       # Navbar · Footer · Layout · Timeline · StatusBadge · Pagination
        └── pages/            # Home · ReportIncident · TrackCase · Login
                              # Dashboard · CaseDetail · AdminDashboard · NotFound
```

---

## License

MIT — Built to protect survivors.
