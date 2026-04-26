# AI Handoff — KOB Interview Concert Ticket Service

## Current Status
**Phase**: Stack migration done (users + session on PostgreSQL/Sequelize; seeds in `seeds/relational/`). Next: domain modules in `goal/TODO.md`.

## Critical Stack Correction
> Persistence is **PostgreSQL + Sequelize** (`sequelize-typescript` models). Do not reintroduce MongoDB.

## Where to Start
1. Read `goal/TODO.md` — this is the source of truth for what needs to be done.
2. Read `ARCHITECTURE.md` — clean architecture rules that must be followed.
3. Read `CLAUDE.md` — project conventions and commands.

## What Has Been Done
- [x] Stack migration: Mongoose removed; `SequelizeModule.forRootAsync` + `UserEntity` / `SessionEntity` + relational repos and seeds
- [x] Roles defined: admin=1, host=2, customer=3
- [x] Auth module exists (JWT, register/login, session, refresh) — using Sequelize user/session
- [x] TODO list at `goal/TODO.md`

## What Needs to Be Done Next
See `goal/TODO.md` — build domain modules in order:
1. Venues module
3. Events module
4. Ticket Types module
5. Orders module

## Key Conventions
- Use-cases inject repository ports (abstract classes), never other use-cases or services.
- Controllers have zero business logic — one use-case call per route.
- Domain classes: pure TypeScript, no decorators.
- Sequelize entities: `@Table`, `@Column`, `@ForeignKey`, `@BelongsTo` decorators.
- Mapper: static `toDomain()` / `toPersistence()` only.
- IDs: UUID strings in domain; `DataType.UUID` + `DataType.UUIDV4` default in entities.
- Roles are numeric in DB/JWT — never store role names as strings.

## Seed Accounts (after migration)
| Email | Password | Role |
|---|---|---|
| admin@example.com | secret | admin |
| host@example.com | secret | host |
| customer@example.com | secret | customer |

## Ports
| Service | URL |
|---|---|
| Backend | http://localhost:3001 |
| Frontend | http://localhost:3000 |
| Swagger | http://localhost:3001/docs |
| PostgreSQL | postgresql://localhost:5432/your_app_db |
