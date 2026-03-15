# ── Build stage ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace structure
COPY package.json ./
COPY apps/backend/package.json apps/backend/
COPY packages/types/package.json packages/types/

# Install dependencies
RUN npm install --workspace=apps/backend --workspace=packages/types

# Copy source
COPY apps/backend/ apps/backend/
COPY packages/ packages/
COPY prisma/ prisma/
COPY tsconfig.base.json ./

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Build
RUN npm run build --workspace=apps/backend

# ── Production stage ──────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

# Copy built artifacts
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/prisma ./prisma

# Create logs directory
RUN mkdir -p logs && chown node:node logs

USER node

EXPOSE 5000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
