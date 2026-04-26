# KOB Interview — Concert Ticket Service — TODO

## Project Goal
Build a **Concert Ticket Service** REST API using:
- **NestJS 11** (Clean Architecture — see ARCHITECTURE.md)
- **PostgreSQL** (NOT MongoDB — boilerplate ships with Mongo, must be replaced)
- **Sequelize ORM** via `@nestjs/sequelize` (replaces `@nestjs/mongoose`)
- **JWT auth** (keep existing auth module, adapt to Sequelize)
- **Roles**: admin (1), host/organizer (2), customer (3)

---

## Stack Migration (must do first)
- [x] Remove `mongoose`, `@nestjs/mongoose`, `mongoose-autopopulate` from `package.json`
- [x] Install `sequelize`, `sequelize-typescript`, `@nestjs/sequelize`, `pg`, `pg-hstore`
- [x] Replace `DatabaseModule` (Mongoose config) with Sequelize `SequelizeModule.forRootAsync`
- [x] Update `docker-compose.yml`: replace MongoDB service with PostgreSQL service
- [x] Update `backend/.env` / `.env.example`: change `DATABASE_URL` to PostgreSQL connection string
- [x] Migrate `users` module: replace Mongoose schema + document repo → Sequelize model + repo
- [x] Migrate `session` module: replace Mongoose schema → Sequelize model
- [x] Delete `src/database/seeds/document/` folder; create new `src/database/seeds/relational/` seeds
- [x] Update `seed:run` script in `package.json`

---

## Domain Modules to Build

### 1. Venues
- [ ] Domain: `id`, `name`, `address`, `city`, `capacity`, `createdAt`, `updatedAt`
- [ ] CRUD: create (admin), findAll, findById, update (admin), delete (admin)

### 2. Events (Concerts)
- [ ] Domain: `id`, `title`, `description`, `venueId`, `hostId`, `startsAt`, `endsAt`, `status` (draft/published/cancelled), `createdAt`, `updatedAt`
- [ ] CRUD: create (host/admin), findAll (public), findById (public), update (host/admin), cancel (host/admin)

### 3. Ticket Types
- [ ] Domain: `id`, `eventId`, `name` (e.g. VIP/General), `price`, `totalQuantity`, `soldQuantity`, `createdAt`, `updatedAt`
- [ ] Create (host/admin), findByEvent (public), update (host/admin)

### 4. Orders / Bookings
- [ ] Domain: `id`, `userId`, `ticketTypeId`, `quantity`, `totalPrice`, `status` (pending/confirmed/cancelled), `createdAt`, `updatedAt`
- [ ] Create order (customer — reserve tickets, check availability), findMyOrders (customer), cancelOrder (customer/admin)
- [ ] Must be atomic: decrement `soldQuantity` on ticket type, prevent overselling

---

## Auth Adjustments
- [ ] Keep JWT strategy — adapt to Sequelize `UserEntity` instead of Mongoose `UserSchemaClass`
- [ ] Keep `RolesGuard` + `@Roles()` decorator
- [ ] Seed script: admin, host, customer accounts (password: `secret`)

---

## Testing Checkpoints
- [ ] `POST /api/v1/auth/email/register` — register new customer
- [ ] `POST /api/v1/auth/email/login` — login all three seed accounts
- [ ] `POST /api/v1/venues` (admin token) — create venue
- [ ] `POST /api/v1/events` (host token) — create event
- [ ] `POST /api/v1/ticket-types` (host token) — add ticket types
- [ ] `POST /api/v1/orders` (customer token) — book tickets
- [ ] `GET /api/v1/orders/me` (customer token) — list my orders
- [ ] Verify sold-out protection: order more than available → 422

---

## File Layout (Sequelize pattern per module)
Each domain module follows this layout (Mongoose replaced by Sequelize):

```
src/<resource>/
  domain/<resource>.ts                        # pure TS class, no ORM deps
  infrastructure/
    persistence/
      <resource>.repository.ts               # abstract port
      entities/<resource>.entity.ts          # Sequelize @Table/@Column model
      mappers/<resource>.mapper.ts           # toDomain / toPersistence (static)
      repositories/<resource>.repository.ts  # implements port with Sequelize
    <resource>s-persistence.module.ts        # SequelizeModule.forFeature([Entity])
  application/use-cases/                     # one file per operation
  presentation/dto/ + controller
  <resource>s.module.ts
```

---

## Notes for AI Handoff
- Boilerplate was MongoDB-only. All `document/` paths in `infrastructure/persistence/` use Mongoose — replace with `relational/` (Sequelize) equivalents.
- Clean architecture layers (domain → application → infrastructure → presentation) stay identical — only the infrastructure/persistence layer changes.
- IDs: use `string` UUID in domain layer; Sequelize entity uses `DataType.UUID` with `defaultValue: DataType.UUIDV4`.
- `_id.toString()` pattern (Mongo) → `id` directly (Sequelize UUID).
- Do NOT re-introduce MongoDB. Entire persistence layer must be Sequelize/PostgreSQL.
- `RoleEnum`: admin=1, host=2, customer=3 — kept as-is.
