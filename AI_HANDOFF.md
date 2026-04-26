# AI Handoff — KOB Interview Concert Ticket Service

## Current Status
**Phase**: Stack migration done (users + session on PostgreSQL/Sequelize; seeds in `seeds/relational/`). **Next**: implement the interview spec end-to-end — see [goal/TODO.md](goal/TODO.md) (Concert + Reservation, migrations, UI, tests).

## Critical Stack Correction
> Persistence is **PostgreSQL + Sequelize** (`sequelize-typescript` models). Do not reintroduce MongoDB.

## Where to Start
1. Read `goal/TODO.md` — end-to-end checklist mapped to [goal/goal.pdf](goal/goal.pdf).
2. Read `ARCHITECTURE.md` — clean architecture rules.
3. Read `CLAUDE.md` — project conventions and commands.

## What Has Been Done
- [x] Stack migration: Mongoose removed; `SequelizeModule.forRootAsync` + `UserEntity` / `SessionEntity` + relational repos and seeds
- [x] Auth module (JWT, register/login, session, refresh) on Sequelize
- [x] Roles in code still **host/customer** (3-way) in places — **interview spec wants admin + user only**; align `RoleEnum` + seeds + frontend per `goal/TODO.md`

## What Needs to Be Done Next
Per `goal/TODO.md` (in rough order):
1. Add **Sequelize migrations** (umzug or CLI); initial schema for `concerts` + `reservations`
2. **Concerts** + **Reservations** modules (clean arch), guards, transaction + locking for booking
3. **Frontend** routes: concerts list/detail, my reservations, admin concerts + audit
4. **Tests**: use-case specs for concert CRUD and reservation edge cases
5. **Dockerfile(s)**, compose wiring, **README** (run, architecture, libs, tests, bonus Q&A)

## Key Conventions
- Use-cases inject repository ports (abstract classes), not concrete Sequelize repos.
- Controllers delegate only — one use-case per action.
- Domain: pure TypeScript. Sequelize: `@Table` / `@Column` / relations.
- Mapper: static `toDomain()` / `toPersistence()` only.
- IDs: UUID strings in domain; `DataType.UUID` in entities.

## Target Seed Accounts (after role alignment — see TODO)
| Email | Password | Role (spec) |
|---|---|---|
| admin@example.com | secret | admin (1) |
| user@example.com | secret | user (2) |

(Until refactored, old seeds may still list host/customer; update to match the two-role model.)

## Ports
| Service | URL |
|---|---|
| Backend | http://localhost:3001 |
| Frontend | http://localhost:3000 |
| Swagger | http://localhost:3001/docs |
| PostgreSQL | postgresql://localhost:5432/your_app_db |
