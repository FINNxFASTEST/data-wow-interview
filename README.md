# How to Run


## Production

```bash
docker compose up --build
```

| Service      | URL                          |
| ------------ | ---------------------------- |
| Frontend     | http://localhost:3000        |
| Backend API  | http://localhost:3001/api/v1 |
| Swagger docs | http://localhost:3001/docs   |

---

## Demo Accounts

| Email                   | Password | Role     |
| ----------------------- | -------- | -------- |
| `admin@example.com`     | `secret` | admin    |
| `host@example.com`      | `secret` | host     |
| `customer@example.com`  | `secret` | customer |


---

## Development

### 1. Start infrastructure (MongoDB + Redis)

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```

### 3. Seed demo accounts

```bash
cd backend
npm run seed:run:document
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

| Service      | URL                          |
| ------------ | ---------------------------- |
| Frontend     | http://localhost:3000        |
| Backend API  | http://localhost:3001/api/v1 |
| Swagger docs | http://localhost:3001/docs   |

---
