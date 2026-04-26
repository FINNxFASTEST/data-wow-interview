# CLAUDE.md

Project guidance for Claude Code and any AI assistant working in this repository.

This is a production-ready **NestJS + Next.js boilerplate** with MongoDB, JWT auth, and clean architecture — ready to extend with your own domain modules.

---

## Quick start (Docker — recommended)

```bash
# 1. Clone
git clone <repo-url> && cd <repo>

# 2. Start all services (MongoDB + Redis + backend + frontend)
docker compose up --build

# 3. Seed demo accounts (wait until backend is healthy)
docker compose exec backend node -e \
  "require('child_process').execSync('npm run seed:run:document', {stdio:'inherit'})"
```

| Service  | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:3001 |
| Swagger  | http://localhost:3001/docs |
| MongoDB  | mongodb://localhost:27017/your_app_db |
| Redis    | redis://localhost:6379 |

Stop: `docker compose down`. Wipe data too: `docker compose down -v`.

> Change the placeholder JWT secrets in `docker-compose.yml` before any real deployment.

---

## Quick start (local dev)

**Prerequisites:** Node ≥ 20, MongoDB on `localhost:27017`, Redis optional (`REDIS_ENABLED=false`).

```bash
# Backend
cd backend
cp .env.example .env   # edit secrets if needed
npm install
npm run start:dev      # port 3001, watch mode

# Frontend (new terminal)
cd frontend
# create frontend/.env.local → NEXT_PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev            # port 3000
```

### Seed accounts

```bash
cd backend && npm run seed:run:document
```

| Email | Password | Role |
|---|---|---|
| `admin@example.com` | `secret` | admin |
| `host@example.com` | `secret` | host |
| `customer@example.com` | `secret` | customer |

---

## AI continuity and handoff

1. **[AI_HANDOFF.md](AI_HANDOFF.md)** — Living task state. Update it before ending a session.
2. **Starting work** — Read `AI_HANDOFF.md` first, then verify with `git status`. Treat it as hints, not ground truth.
3. `CLAUDE.md` = stable architecture. `AI_HANDOFF.md` = ephemeral "where we left off."

---

## Project structure

```
.
├── backend/          # NestJS 11 + Mongoose (port 3001)
├── frontend/         # Next.js 15 App Router (port 3000)
├── docker-compose.yml
└── CLAUDE.md
```

---

## Backend

### Commands

```bash
cd backend
npm run start:dev                            # Watch mode
npm run build                                # Compile TS → dist/
npm run start:prod                           # Run dist/
npm run lint
npm run test                                 # Jest unit tests
npm run test:watch
npm run test:cov
npm run seed:run:document                    # Seed demo accounts
npm run generate:resource:document -- --name Foo   # Scaffold a new module
npm run add:property:to-document             # Add a field interactively
```

### Environment (`backend/.env`)

```
NODE_ENV=development
APP_PORT=3001
DATABASE_URL=mongodb://localhost:27017/your_app_db
AUTH_JWT_SECRET=change-me
AUTH_REFRESH_SECRET=change-me-too
AUTH_JWT_TOKEN_EXPIRES_IN=15m
AUTH_REFRESH_TOKEN_EXPIRES_IN=3650d
FRONTEND_DOMAIN=http://localhost:3000
REDIS_ENABLED=false
REDIS_URL=redis://localhost:6379
```

Full reference: [backend/.env.example](backend/.env.example).

### What's in `src/`

| Folder | Purpose |
|---|---|
| `auth/` | Email register/login, JWT access + refresh, session rotation |
| `users/` | User accounts (email, password hash, role) |
| `session/` | Refresh-token sessions (MongoDB or Redis) |
| `roles/` | `RoleEnum` (admin=1, host=2, customer=3), `RolesGuard`, `@Roles()` |
| `statuses/` | Account status enum (active/inactive) |
| `redis/` | Optional Redis client + config |
| `database/` | Mongoose config service, seeds |
| `config/` | App/auth/database config schemas |
| `utils/` | Shared helpers (see below) |

### Auth endpoints

| Endpoint | Description |
|---|---|
| `POST /api/v1/auth/email/register` | Create account, returns `{ token, refreshToken, tokenExpires, user }` |
| `POST /api/v1/auth/email/login` | Same response shape |
| `GET /api/v1/auth/me` | Current user (requires Bearer token) |
| `POST /api/v1/auth/refresh` | Rotate refresh token |
| `POST /api/v1/auth/logout` | Delete session |

JWT payload: `{ id, role: { id }, sessionId, iat, exp }`.

Swagger UI: `GET /docs`.

### Clean architecture pattern

Every domain module you add should follow this layout — the generator scaffolds it automatically:

```
src/<resource>/
  domain/<resource>.ts                  # Pure TS class — no NestJS/Mongoose deps
  application/
    use-cases/
      create-<resource>.use-case.ts     # One @Injectable() class per operation
      find-<resource>.use-case.ts
      update-<resource>.use-case.ts
      delete-<resource>.use-case.ts
  presentation/
    <resource>.controller.ts            # Thin — delegates to use-cases
    dto/                                # Request/response shapes + validators
  infrastructure/
    persistence/
      <resource>.repository.ts          # Abstract port
      <resource>.mapper.ts              # Static toDomain / toPersistence
      <resource>.schema.ts              # Mongoose schema class
      document/
        document-persistence.module.ts
        entities/<resource>.schema.ts
        mappers/<resource>.mapper.ts
        repositories/<resource>.repository.ts
  <resource>.module.ts
```

**Data flow:** `Controller → UseCase → Repository port → Document adapter → MongoDB`

Use-cases inject the repository port (abstract class), never the document adapter. Controllers never touch the repository.

### Coding conventions

**Domain classes** — pure TypeScript, no decorators:
```ts
export class User {
  id!: string;
  email!: string;
  createdAt!: Date;
}
```

**Schema classes** — all `@Prop()` fields use `!`:
```ts
@Prop({ type: String, required: true })
email!: string;
```

**DTOs** — all fields use `!`; `ValidationPipe` populates them at runtime:
```ts
@IsEmail()
email!: string;
```

**Mappers** — static methods only, no DI:
```ts
static toDomain(raw: UserSchemaClass): User { ... }
static toPersistence(domain: User): UserSchemaClass { ... }
```
Always use `?? null` / `?? []` — never leave `undefined` where nullable is expected.

**DTOs** — `@ApiProperty` in presentation layer only, never in domain classes. `@IsMongoId()` for any `*Id` field.

### Config system

Three schemas validated by `class-validator` at startup:

| File | Key | Contents |
|---|---|---|
| `config/app.config.ts` | `app` | `port`, `apiPrefix`, `frontendDomain`, `fallbackLanguage` |
| `auth/config/auth.config.ts` | `auth` | `secret`, `expires`, `refreshSecret`, `refreshExpires` |
| `database/config/database.config.ts` | `database` | `DATABASE_URL` |

Access: `configService.get('auth.secret', { infer: true })`.

### Pagination helper

```ts
infinityPagination(results, { page, limit })
// → { data: T[], hasNextPage: boolean }
```

Default: `page=1`, `limit=10`, max `limit=50`.

### `src/utils/` reference

| File | Purpose |
|---|---|
| `validation-options.ts` | Global ValidationPipe (HTTP 422, whitelist, transform) |
| `serializer.interceptor.ts` | `ResolvePromisesInterceptor` |
| `infinity-pagination.ts` | Pagination wrapper |
| `document-entity-helper.ts` | `EntityDocumentHelper` — `_id → id` transform |
| `types/deep-partial.type.ts` | `DeepPartial<T>` |
| `types/maybe.type.ts` | `MaybeType<T> = T \| undefined` |
| `types/nullable.type.ts` | `NullableType<T> = T \| null` |
| `transformers/lower-case.transformer.ts` | Lowercases + trims strings |

### Global app setup

- URI versioning — all routes at `/api/v1/...`
- `ValidationPipe` — whitelist + transform; errors return HTTP 422
- Interceptors (in order): `ResolvePromisesInterceptor` → `ClassSerializerInterceptor`
- CORS enabled globally
- Swagger at `GET /docs`

### Adding a new module

```bash
cd backend
npm run generate:resource:document -- --name Foo
# Then manually:
#   1. Create application/use-cases/ and split the generated service into use-case classes
#   2. Create presentation/ with controller + DTOs
#   3. Register FooModule in app.module.ts
```

---

## Frontend

### Commands

```bash
cd frontend
npm run dev        # port 3000
npm run build
npm run start
npm run lint
npm run typecheck
```

### What's in `src/`

```
src/
  app/
    page.tsx           # Landing page
    login/page.tsx
    register/page.tsx
    layout.tsx
    globals.css
  components/
    common/            # Nav, Footer, Button, Badge, StatusPill, Icons
    ui/                # shadcn/ui primitives (edit sparingly)
```

### API client pattern

Add service files under `src/services/`. Use `NEXT_PUBLIC_API_URL` (from `.env.local`) as the base URL. Attach the Bearer token from `localStorage`.

### Design system

CSS variables in `globals.css`. Use Tailwind tokens — never raw hex.

Key tokens: `--background`, `--foreground`, `--border`, `--muted`, `--accent`.

---

## Seeds

Seeds live in [backend/src/database/seeds/document/](backend/src/database/seeds/document). Add a `*-seed.service.ts`, wire it into `seed.module.ts` and `run-seed.ts`.

---

## Key rules

- **IDs are strings** everywhere in the domain layer (`_id.toString()` in every mapper).
- **Roles are numeric in DB/JWT** (admin=1, host=2, customer=3).
- **MongoDB only** — TypeORM/Postgres paths from the upstream boilerplate were removed; do not re-add them.
- **No god-services** — one use-case class per operation.
- **No comments explaining WHAT code does** — only WHY if non-obvious.
