# KOB Interview — Concert Ticket Service — End-to-end TODO

Source: [goal/goal.pdf](goal.pdf) (Full-stack assignment: Next.js + NestJS).

## Scope (aligned with the spec)

The interview asks for a **single Concert** model (`name`, `description`, `total seats`) and **Reservations** with **1 seat per user per concert**, two roles **ADMIN** and **USER**, PostgreSQL, migrations, Docker, JWT guards, validation, tests, and responsive UI from [Figma](https://www.figma.com/design/fYPlbS6c5i7tlx6buHWY5w/Full-Stack-Developer?node-id=0-1).

**Earlier notes in this repo** described Venues, Events, Ticket Types, and three roles (admin / host / customer). This list **supersedes** that: implement **Concert + Reservation** and **admin (1) + user (2)** unless you explicitly want the extended model.

Stack already in use: **NestJS 11**, **PostgreSQL + Sequelize** ([ARCHITECTURE.md](../ARCHITECTURE.md)), **Next.js 15** App Router.

---

## Task 1 — Basic setup and landing

- [x] Next.js frontend + NestJS backend in repo
- [ ] Landing at `/` updated for the product (concert tickets, not generic boilerplate copy) and `NEXT_PUBLIC_API_URL` in `frontend/.env.local`

---

## Task 2 — Responsive design (Figma)

- [ ] **Mobile / tablet / desktop** layouts for main flows (Figma: link in goal.pdf)
- [ ] **Tailwind** for layout; **evident** custom HTML/CSS (e.g. `globals.css` or scoped styles), not only framework defaults
- [ ] Reusable domain components: e.g. `src/components/concerts/`, `src/components/admin/` (names flexible)

**Suggested routes**

- [ ] `/` — public landing
- [ ] `/concerts` — list (authenticated): all concerts, show sold out / available
- [ ] `/concerts/[id]` — detail + reserve
- [ ] `/me/reservations` — user: own history
- [ ] `/admin/concerts` — admin: create / delete concerts
- [ ] `/admin/audit` — admin: full reservation history (audit trail)
- [ ] `middleware` or layout guards: `/admin/*` → admin; protected user routes as needed

---

## Task 3 — Authentication and authorization (JWT)

- [x] JWT register / login / refresh / logout (existing `auth/`)
- [ ] **Two roles only**: `admin = 1`, `user = 2` in [backend/src/roles/roles.enum.ts](../backend/src/roles/roles.enum.ts) and everywhere roles are checked
- [ ] **USER** must not call admin-only endpoints; **ADMIN** must not be required for user-only booking flows
- [ ] `RolesGuard` + `@Roles()` on concert admin routes and audit route
- [ ] **Seeds** [backend/src/database/seeds/relational/](../backend/src/database/seeds/relational/): e.g. `admin@example.com` / `user@example.com` (password `secret`) — remove host/customer if still present
- [ ] **Frontend** [frontend/src/types/index.ts](../frontend/src/types/index.ts), [auth.service.ts](../frontend/src/services/auth.service.ts): map roles to `admin` | `user` only

---

## Task 4 — Free concert tickets: CRUD and logic (REST + Postgres)

### Infrastructure

- [x] PostgreSQL in [docker-compose.yml](../docker-compose.yml)
- [ ] **Migrations** (spec requirement): add Umzug or `sequelize-cli`; `backend/src/database/migrations/`; scripts `migration:run` / `revert` / `generate`
- [ ] **Disable** unsafe `sync({ alter: true })` in production; prefer migrations in all envs
- [ ] **Dockerfile** for backend (and frontend if full stack in compose) + compose services wired to run API + web + db
- [ ] `DATABASE_URL` / credentials in `.env.example` and README

### Domain: `Concert`

- [ ] Fields: `id` (UUID), `name`, `description`, `totalSeats` (int ≥ 1), `createdBy` (user id), `createdAt` / `updatedAt`
- [ ] **Admin only**: `POST` create, `DELETE` remove listing
- [ ] **Authenticated users**: `GET` list (include fully booked), `GET` by id

### Domain: `Reservation` (1 seat / user / concert)

- [ ] **User only**: `POST` reserve (one active reservation per user per concert)
- [ ] **User only**: `DELETE` or `PATCH` cancel own reservation
- [ ] **User only**: `GET` own reservation list (history)
- [ ] **Admin only**: `GET` all reservations (audit trail — all users, join user + concert)
- [ ] **Atomicity**: transaction + `SELECT ... FOR UPDATE` on concert row (or equivalent) + count active reservations; reject when `count >= totalSeats`
- [ ] **Concurrency**: `SERIALIZABLE` or `REPEATABLE READ` + row lock, plus **DB unique partial index** on `(userId, concertId)` where `status = 'active'` to prevent double-book under race

**Suggested API shape** (under `/api/v1`, JWT)

- [ ] `POST /concerts` — admin
- [ ] `GET /concerts` — authenticated
- [ ] `GET /concerts/:id` — authenticated
- [ ] `DELETE /concerts/:id` — admin (cascade or block per product rule)
- [ ] `POST /concerts/:id/reservations` — user
- [ ] `DELETE /reservations/:id` — user (own)
- [ ] `GET /reservations/me` — user
- [ ] `GET /reservations` — admin (audit)

### Clean architecture (per module)

- [ ] `concerts` and `reservations` modules: domain → use-cases → repository port → relational adapter → controller + DTOs
- [ ] Register modules in [backend/src/app.module.ts](../backend/src/app.module.ts)

---

## Task 5 — Server-side validation and error handling

- [ ] **Backend**: `class-validator` on DTOs; invalid input → **400** or **422** (match existing [ValidationPipe](../backend/src/utils/validation-options.ts)); clear messages for title, seat count, role
- [ ] **Frontend**: catch API errors; **toasts** and/or **inline** field errors (e.g. sonner or shadcn toast); map validation payload to UI

---

## Task 6 — Unit testing

- [ ] `create-concert.use-case.spec.ts` — success + invalid body
- [ ] `delete-concert.use-case.spec.ts` — success + not found
- [ ] `create-reservation.use-case.spec.ts` — success, sold out, duplicate user+concert, missing concert
- [ ] `cancel-reservation.use-case.spec.ts` — own vs other user
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

- [ ] **README** (repo root or split): how to run with **Docker** in under ~5 minutes; **architecture** overview; **library** list; **test** commands
- [ ] **GitHub**: share link; small commits (not one giant “final” commit)
- [ ] **Bonus (README, short text)**:
  1. Performance: large data + high traffic (caching, indexing, CDN, pagination)
  2. Concurrency: many users booking last seats (tx, locking, unique constraints, or queue) — should match what you actually implement

---

## Manual test matrix (E2E smoke)

- [ ] Register + login as user; create concerts as admin (API or admin UI)
- [ ] List concerts; reserve; list “my” reservations; cancel; reserve again
- [ ] Second user cannot steal last seat if sold out; two tabs same user cannot double-book
- [ ] User token blocked on `POST /concerts` and `GET /reservations` (audit)
- [ ] Admin sees full audit list

---

## Notes for AI handoff

- Persistence is **PostgreSQL + Sequelize** only; do not reintroduce MongoDB.
- `RoleEnum`: **admin = 1**, **user = 2** (per interview spec). Update JWT seeds and any guards that still reference host/customer.
- See [../AI_HANDOFF.md](../AI_HANDOFF.md) for current phase after edits.
