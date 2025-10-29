# Enterprise Dashboard / Admin Panel (EHS-style)

A compact Next.js 14 (App Router) demo showing common EHS-style admin UI patterns:

- Responsive layout with cards and charts
- Data tables with filtering, sorting and pagination
- JWT authentication with httpOnly cookies
- Role-based access control (RBAC)
- REST-style API routes (mocked in-app)

## Quick start

1. Copy the example env and install dependencies:

```powershell
cp .env.example .env.local # or create .env.local and paste values
npm install
```

2. Run the dev server:

```powershell
npm run dev
```

3. Open http://localhost:3000

Test users (built-in demo fixtures):

- admin@acme.com / admin123 → role: admin
- user@acme.com / user123 → role: user

Required env vars (copy to `.env.local`):

```
AUTH_SECRET=change_me_to_a_long_random_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Project structure (high level):

- `app/` — App Router pages and API route handlers
- `lib/auth.ts` — JWT helpers using `jose`
- `middleware.ts` — route protection + RBAC gate for `/admin/*`
- `components/` — Sidebar, KPI cards, chart wrapper and DataTable

app/api/* — Mock REST endpoints: login, logout, metrics, incidents, users

Notes
Charts use react-chartjs-2 and are mobile-friendly.

The table performs server-side paging/sorting/filtering via /api/incidents.

Authentication sets an httpOnly JWT cookie; RBAC enforced in middleware.ts and in admin endpoints.

Production hardening ideas
Swap mocked APIs with your real REST backend.

Add refresh tokens + silent re-auth flow.

Implement audit logging and granular permissions per module.

Use a dedicated table library (e.g., TanStack Table) for large datasets and virtualization.

Add accessibility passes (focus states, keyboard nav) and unit tests.

css
Copy code

---

## app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0b1020;
  --card: #121933;
  --muted: #8a94a7;
}

html, body { height: 100%; }

body {
  background: linear-gradient(180deg, #0b1020 0%, #0b1226 100%);
  color: white;
}
a { color: #93c5fd }

.card { @apply bg-slate-800/60 rounded-xl border border-slate-700/50 shadow; }
.card-pad { @apply p-4 md:p-6; }

.btn {
  @apply inline-flex items-center justify-center rounded-md border border-slate-600
         bg-slate-700/60 px-4 py-2 text-sm font-medium hover:bg-slate-600/60 transition;
}

input, select {
  @apply bg-slate-800/70 border border-slate-700 rounded px-3 py-2 w-full
         outline-none focus:ring focus:ring-blue-500/30;
}

table { @apply w-full text-sm; }
thead th { @apply text-left text-slate-300 border-b border-slate-700 pb-2; }
tbody td { @apply py-2 border-b border-slate-800; }