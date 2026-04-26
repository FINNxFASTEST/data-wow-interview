# NestJS + Next.js Boilerplate

A full-stack developer boilerplate with clean architecture — clone it, extend it, ship it.

- **Backend** — NestJS 11, **PostgreSQL + Sequelize**, JWT auth (access + refresh tokens), clean architecture
- **Frontend** — Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Infra** — Docker Compose for **PostgreSQL** + Redis (dev) and full stack (prod)

> **Legacy:** The stock upstream template used **MongoDB + Mongoose**. If you are still on that stack, see [Legacy: MongoDB + Mongoose (upstream)](#legacy-mongodb--mongoose-upstream) at the end of this file.

---

## How to run (current — PostgreSQL + Sequelize)

### Prerequisites

| Tool    | Version |
| ------- | ------- |
| Node.js | ≥ 20    |
| Docker  | recent  |

### 1. Start infrastructure (Postgres + Redis)

From the **repository root**:

```bash
docker compose up -d
```

- **PostgreSQL** — `localhost:5432` (user/db/password in `docker-compose.yml`, e.g. `your_app` / `your_app_db`)
- **Redis** — `localhost:6379`

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env if your Postgres host, port, or credentials differ
npm install
npm run start:dev
```

`npm run start:dev` runs the API on **port 3001** (watch mode).

**Important `.env` values** (align with your Postgres instance):

```env
NODE_ENV=development
DATABASE_URL=postgresql://your_app:your_app@localhost:5432/your_app_db
AUTH_JWT_SECRET=dev-secret-change-me
AUTH_REFRESH_SECRET=dev-refresh-secret-change-me
REDIS_ENABLED=false
```

If you are **not** using `DATABASE_URL`, you can set `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, and `DATABASE_NAME` instead (see `backend/.env.example`).

### 3. Seed demo accounts (after the backend can reach Postgres)

In another terminal, with the database up:

```bash
cd backend
npm run seed:run
```

(Equivalent: `npm run seed:run:relational`.)

| Email                | Password | Role  |
| -------------------- | -------- | ----- |
| `admin@example.com`  | `secret` | admin |
| `user@example.com`   | `secret` | user  |

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local` (or copy from `frontend/.env.local.example`):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Database migrations (optional in dev, required when `DATABASE_SYNC=false`)

In development, Sequelize can auto-apply the schema when `DATABASE_SYNC` is not set to `false`. For production-style runs or the Docker API image, run:

```bash
cd backend
npm run migration:run
```

- **Undo last migration:** `npm run migration:revert`
- **Generate a new file:** `npm run migration:generate -- --name your-name`

Migrations live in `backend/src/database/migrations/`.

### Service URLs

| Service      | URL                           |
| ------------ | ----------------------------- |
| Frontend     | http://localhost:3000         |
| Backend API  | http://localhost:3001/api/v1  |
| Swagger docs | http://localhost:3001/docs    |

**Stop infrastructure:** `docker compose down` (add `-v` to remove the Postgres volume).

---

## Full stack in Docker (API + web + database)

From the repository root (uses `docker-compose.yml` in this project):

```bash
docker compose up --build
```

- **Web** — http://localhost:3000
- **API** — http://localhost:3001
- The backend image runs `sequelize-cli db:migrate` on start, then `node dist/main.js`.
- **Seed** after Postgres is up and the API is listening:

```bash
docker compose exec backend node -e "require('child_process').execSync('npm run seed:run', {stdio:'inherit'})"
```

Set strong `AUTH_JWT_SECRET` and `AUTH_REFRESH_SECRET` in `docker-compose.yml` (or override via env) before any public deployment. Also set `FRONTEND_DOMAIN` to match the browser origin for CORS.

## Production (Docker) — optional alternate compose

```bash
docker compose -f docker-compose.prod.yml up --build
```

If your repo includes `docker-compose.prod.yml`, use it. Change `AUTH_JWT_SECRET` and `AUTH_REFRESH_SECRET` in that file (and any DB user/password) before a real deployment.

**Seed accounts (first run, after the backend is healthy):**

```bash
docker compose -f docker-compose.prod.yml exec backend node \
  -e "require('child_process').execSync('npm run seed:run', {stdio:'inherit'})"
```

**Stop:** `docker compose -f docker-compose.prod.yml down`
**Wipe data:** `docker compose -f docker-compose.prod.yml down -v`

---

## Using this as a starting point for your own project

### Option A — GitHub Template (recommended)

Click **"Use this template"** on GitHub. This creates a fresh repo under your account with no connection to this one.

### Option B — Clone then detach

```bash
git clone https://github.com/FINNxFASTEST/boilerplate my-project
cd my-project

# Remove the connection to this repo
git remote remove origin

# Point to your own repo
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Option C — degit (no git history at all)

```bash
npx degit FINNxFASTEST/boilerplate my-project
cd my-project
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

---

## Adding a feature module (current)

New domain code should use **Sequelize** models and a relational persistence folder (see `ARCHITECTURE.md` and, for this repo, `goal/TODO.md`). The `generate:resource:document` Hygen generator still scaffolds **Mongoose**-style files — it is a **legacy** helper from the upstream boilerplate; for PostgreSQL, either adapt the output or add modules by hand following the `users` / `session` pattern.

```bash
cd backend
# Legacy Mongoose scaffolder — output must be converted for Sequelize
npm run generate:resource:document -- --name YourResource
```

To add a field to a **Mongoose**-style document module (legacy):

```bash
cd backend
npm run add:property:to-document
```

After scaffolding, wire `YourResourceModule` into `src/app.module.ts` and follow [ARCHITECTURE.md](ARCHITECTURE.md) for the clean-architecture flow.

---

## Project structure

```
.
├── backend/
│   ├── src/
│   │   ├── auth/          # JWT login/register/refresh/logout
│   │   ├── users/         # User accounts + roles
│   │   ├── session/       # Refresh-token sessions (PostgreSQL or Redis cache)
│   │   ├── roles/         # RoleEnum + RolesGuard + @Roles()
│   │   ├── redis/         # Optional Redis client
│   │   ├── database/      # Sequelize config + seeds (relational)
│   │   ├── config/        # App/auth/DB config schemas
│   │   └── utils/         # Shared helpers
│   └── .env.example
├── frontend/
│   └── src/
│       ├── app/           # Pages: home, login, register
│       └── components/    # common/ + ui/ (shadcn)
├── docker-compose.yml         # Dev — Postgres + Redis
├── docker-compose.prod.yml   # Prod — full stack
└── ARCHITECTURE.md            # Clean architecture deep-dive
```

---

## Commands

### Backend

```bash
npm run start:dev                              # Watch mode
npm run start:debug                            # Watch + debugger (port 9229)
npm run build                                  # Compile TS → dist/
npm run start:prod                             # Run compiled output
npm run lint
npm run test                                   # Jest unit tests
npm run test:cov                               # Coverage report
npm run seed:run                               # Seed demo accounts (relational)
# Legacy Hygen (Mongoose-oriented):
npm run generate:resource:document -- --name Foo
npm run add:property:to-document
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

---

## Auth API

| Method | Endpoint                      | Description                        |
| ------ | ----------------------------- | ---------------------------------- |
| `POST` | `/api/v1/auth/email/register` | Create account                     |
| `POST` | `/api/v1/auth/email/login`    | Login                              |
| `GET`  | `/api/v1/auth/me`               | Current user (Bearer token)        |
| `POST` | `/api/v1/auth/refresh`          | Rotate refresh token                |
| `POST` | `/api/v1/auth/logout`           | Delete session                     |

---

## Troubleshooting

| Symptom                               | Fix                                                                 |
| ------------------------------------- | ------------------------------------------------------------------- |
| Backend won't start — `Cannot find module` | Run `npm install` in `backend/`                                     |
| Frontend shows network error          | Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`                |
| PostgreSQL connection refused         | Run `docker compose up -d` and verify `DATABASE_URL` / credentials  |
| JWT errors after restart              | `AUTH_JWT_SECRET` must stay the same between restarts                 |
| Port already in use                   | Change `APP_PORT` in `backend/.env`                                 |
| Redis errors                          | Set `REDIS_ENABLED=false` to use DB-backed sessions only              |

---

## Legacy: MongoDB + Mongoose (upstream)

The following applied to the **original stock boilerplate** before migrating this repo to PostgreSQL. Retained for forks or old branches that still use Mongoose.

### Local development (legacy)

**1. Start infrastructure**

```bash
docker compose up -d
```

(Stock compose: MongoDB on `localhost:27017` and Redis on `localhost:6379`.)

**2. Backend — legacy env**

```env
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/your_app_db
AUTH_JWT_SECRET=dev-secret-change-me
AUTH_REFRESH_SECRET=dev-refresh-secret-change-me
REDIS_ENABLED=false
```

**3. Seed (legacy command)**

```bash
cd backend
npm run seed:run:document
```

If that script is missing on your tree, the historical name was `seed:run:document` pointing at `src/database/seeds/document/`.

**4. Production seed (legacy)**

```bash
docker compose -f docker-compose.prod.yml exec backend node \
  -e "require('child_process').execSync('npm run seed:run:document', {stdio:'inherit'})"
```

**5. Scaffolding (legacy, Mongoose)**

```bash
cd backend
npm run generate:resource:document -- --name YourResource
npm run add:property:to-document
```

Schema files used `@nestjs/mongoose` and `mongoose` under `infrastructure/persistence/document/`. New work in this repository uses **Sequelize** and `src/database/seeds/relational/`.
