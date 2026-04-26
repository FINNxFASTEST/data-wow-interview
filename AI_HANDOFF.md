# AI Handoff — KOB Interview Concert Ticket Service

## Current Status
**Phase**: Core interview spec implemented — `Concert` + `Reservation` APIs, migrations, two roles (admin/user), seeds, Next.js routes (concerts, admin, my reservations), Dockerfiles + compose, unit tests for listed use cases, README updates.

## Stack
PostgreSQL + Sequelize only. **Do not reintroduce MongoDB.**

## Implemented (see `goal/TODO.md` for full checklist)
- Roles: `RoleEnum.admin = 1`, `RoleEnum.user = 2`; register defaults to user; seeds `admin@example.com`, `user@example.com` / `secret`
- REST under `/api/v1`: concerts CRUD (admin create/delete, auth list/detail), reservations (user reserve/cancel/me, admin audit)
- Booking: transaction + `SELECT ... FOR UPDATE` on concert + partial unique index on active (userId, concertId)
- Migrations: `backend/src/database/migrations/` + `npm run migration:run` / `revert` / `generate`
- `DATABASE_SYNC=false` disables Sequelize sync (optional; default dev still syncs unless set)
- Frontend: landing, `/concerts`, `/concerts/[id]`, `/me/reservations`, `/admin/concerts`, `/admin/audit`, middleware for auth/roles, sonner toasts
- Docker: `docker compose up --build` from repo root; seed via `docker compose exec backend npm run seed:run`

## Next (optional polish)
- E2E tests; more README “bonus” sections; tighten docker image (drop `src` from backend image if seed is compiled)

## Ports
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |
| Swagger | http://localhost:3001/docs |
| PostgreSQL | postgresql://localhost:5432/your_app_db |
