# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV APP_PORT=3001
ENV DATABASE_SYNC=false
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/src ./src
COPY --from=build /app/tsconfig.json ./
COPY package.json ./
COPY sequelize.config.cjs .sequelizerc ./
EXPOSE 3001
CMD ["sh", "-c", "npx sequelize-cli db:migrate && node dist/main.js"]
