# KOB Interview — Concert Ticket Service — End-to-end TODO

Source: [goal/goal.pdf](goal.pdf) (Full-stack assignment: Next.js + NestJS).

## Scope (aligned with the spec)

The interview asks for a **single Concert** model (`name`, `description`, `total seats`) and **Reservations** with **1 seat per user per concert**, two roles **ADMIN** and **USER**, PostgreSQL, migrations, Docker, JWT guards, validation, tests, and responsive UI from [Figma](https://www.figma.com/design/fYPlbS6c5i7tlx6buHWY5w/Full-Stack-Developer?node-id=0-1).

**Earlier notes in this repo** described Venues, Events, Ticket Types, and three roles (admin / host / customer). This list **supersedes** that: implement **Concert + Reservation** and **admin (1) + user (2)** unless you explicitly want the extended model.

Stack already in use: **NestJS 11**, **PostgreSQL + Sequelize** ([ARCHITECTURE.md](../ARCHITECTURE.md)), **Next.js 15** App Router.

---

## Task 1 — Basic setup and landing

- [x] Next.js frontend + NestJS backend in repo
- [x] Landing at `/` updated for the product (concert tickets, not generic boilerplate copy) and `NEXT_PUBLIC_API_URL` in `frontend/.env.local` — use [frontend/.env.local.example](../frontend/.env.local.example) as template; copy to `.env.local`

---

## Task 2 — Responsive design (Figma)

- [x] **Mobile / tablet / desktop** layouts for main flows (responsive `sm`/`md` breakpoints, stacked vs row layouts) — Figma is reference; not pixel-matched
- [x] **Tailwind** for layout; **evident** custom HTML/CSS (`stage-hero`, `concert-ribbon` in [frontend/src/app/globals.css](../frontend/src/app/globals.css))
- [x] Reusable domain components: [src/components/admin/AdminSubnav.tsx](../frontend/src/components/admin/AdminSubnav.tsx) — concert list is page-local; can extract further

**Suggested routes**

- [x] `/` — public landing
- [x] `/concerts` — list (authenticated): all concerts, show sold out / available
- [x] `/concerts/[id]` — detail + reserve
- [x] `/me/reservations` — user: own history
- [x] `/admin/concerts` — admin: create / delete concerts
- [x] `/admin/audit` — admin: full reservation history (audit trail)
- [x] `middleware` or layout guards: [frontend/src/middleware.ts](../frontend/src/middleware.ts) — `/admin/*` → admin; `/concerts`, `/me/*` require auth; `/me/*` user role only

---

## Task 3 — Authentication and authorization (JWT)

- [x] JWT register / login / refresh / logout (existing `auth/`)
- [x] **Two roles only**: `admin = 1`, `user = 2` in [backend/src/roles/roles.enum.ts](../backend/src/roles/roles.enum.ts) and role checks
- [x] **USER** must not call admin-only endpoints; **ADMIN** not required for user booking (reserve — user-only; list concerts — any authenticated)
- [x] `RolesGuard` + `@Roles()` on concert admin routes and audit route
- [x] **Seeds** [backend/src/database/seeds/relational/](../backend/src/database/seeds/relational/): `admin@example.com` / `user@example.com` (password `secret`); host/customer removed
- [x] **Frontend** [frontend/src/types/index.ts](../frontend/src/types/index.ts), [auth.service.ts](../frontend/src/services/auth.service.ts): `admin` | `user` only

---

## Task 4 — Free concert tickets: CRUD and logic (REST + Postgres)

### Infrastructure

- [x] PostgreSQL in [docker-compose.yml](../docker-compose.yml)
- [x] **Migrations**: `sequelize-cli`; [backend/src/database/migrations/](../backend/src/database/migrations/); scripts `migration:run` / `revert` / `generate` in [backend/package.json](../backend/package.json)
- [x] **Disable** unsafe `sync` in production (`NODE_ENV=production` never syncs); dev sync unless `DATABASE_SYNC=false` (then run migrations) — no `alter: true`
- [x] **Dockerfile** for backend and frontend; compose services `backend` + `web` + `postgres` (+ `redis`) in [docker-compose.yml](../docker-compose.yml)
- [x] `DATABASE_URL` / credentials in [backend/.env.example](../backend/.env.example) and [README.md](../README.md)

### Domain: `Concert`

- [x] Fields: `id` (UUID), `name`, `description`, `totalSeats` (≥ 1), `createdBy`, `createdAt` / `updatedAt`
- [x] **Admin only**: `POST` create, `DELETE` remove listing
- [x] **Authenticated users**: `GET` list (sold out + remaining), `GET` by id

### Domain: `Reservation` (1 seat / user / concert)

- [x] **User only**: `POST` reserve (one active per user per concert; enforced in service + unique partial index)
- [x] **User only**: `DELETE` cancel own reservation
- [x] **User only**: `GET` own reservation list
- [x] **Admin only**: `GET` all reservations (audit — user email + concert name)
- [x] **Atomicity**: transaction + row lock on concert + count active; reject when sold out
- [x] **Concurrency**: `REPEATABLE_READ` + row lock + **partial unique index** on `(userId, concertId) WHERE status = 'active'`

**Suggested API shape** (under `/api/v1`, JWT)

- [x] `POST /concerts` — admin
- [x] `GET /concerts` — authenticated
- [x] `GET /concerts/:id` — authenticated
- [x] `DELETE /concerts/:id` — admin (CASCADE on reservations)
- [x] `POST /concerts/:id/reservations` — user
- [x] `DELETE /reservations/:id` — user (own)
- [x] `GET /reservations/me` — user
- [x] `GET /reservations` — admin (audit)

### Clean architecture (per module)

- [x] `concerts` and `reservations` modules: domain → use-cases → repository port → relational adapter → controller + DTOs
- [x] [ConcertsModule](../backend/src/concerts/concerts.module.ts) registered in [backend/src/app.module.ts](../backend/src/app.module.ts) (imports [ReservationsModule](../backend/src/reservations/reservations.module.ts))

---

## Task 5 — Server-side validation and error handling

- [x] **Backend**: `class-validator` on DTOs; `ValidationPipe` in [validation-options.ts](../backend/src/utils/validation-options.ts) (HTTP 422)
- [x] **Frontend**: API errors; **sonner** toasts; forms keep inline field errors (login/register); list/detail use toasts

---

## Task 6 — Unit testing

- [x] `create-concert.use-case.spec.ts` — success + DTO invalid body
- [x] `delete-concert.use-case.spec.ts` — success + not found
- [x] `create-reservation.use-case.spec.ts` — success, sold out, duplicate, missing concert
- [x] `cancel-reservation.use-case.spec.ts` — own vs other user
- [ ] (Optional bonus) frontend component or integration test

Run: `cd backend && npm test`

---

## Stack migration (done)

- [x] Mongoose → Sequelize; PostgreSQL; users + session entities; relational seeds; `npm run seed:run`

---

## File layout (Sequelize module pattern)

Use the same pattern as `users` / `session`:

```
backend/src/<resource>/
  domain/<resource>.ts
  application/use-cases/<action>-<resource>.use-case.ts
  infrastructure/persistence/
    <resource>.repository.ts
    entities/<resource>.entity.ts
    mappers/<resource>.mapper.ts
    repositories/<resource>.repository.ts
  <resource>-persistence.module.ts
  presentation/dto/ + <resource>.controller.ts
  <resource>.module.ts
```

- Domain IDs: **string UUID**; entities: `DataType.UUID` + `defaultValue: DataType.UUIDV4`.

---

## Submission checklist (from goal.pdf)

- [x] **README** — Docker quick start, migrations, seed table, full-stack `docker compose`; see also [AI_HANDOFF.md](../AI_HANDOFF.md) for scope
- [ ] **GitHub**: share link; small commits (not one giant “final” commit) — *your process*
- [ ] **Bonus (README, short text)**:
  1. Performance: large data + high traffic (caching, indexing, CDN, pagination)
  2. Concurrency: many users booking last seats (tx, locking, unique constraints, or queue) — should match what you actually implement

---

## Manual test matrix (E2E smoke)

- [ ] Register + login as user; create concerts as admin (API or admin UI) — *ready to run manually*
- [ ] List concerts; reserve; list “my” reservations; cancel; reserve again
- [ ] Second user cannot steal last seat if sold out; two tabs same user cannot double-book
- [ ] User token blocked on `POST /concerts` and `GET /reservations` (audit)
- [ ] Admin sees full audit list

---

## Notes for AI handoff

- Persistence is **PostgreSQL + Sequelize** only; do not reintroduce MongoDB.
- `RoleEnum`: **admin = 1**, **user = 2** (per interview spec). JWT seeds updated; no host/customer.
- See [../AI_HANDOFF.md](../AI_HANDOFF.md) for current phase after edits.
