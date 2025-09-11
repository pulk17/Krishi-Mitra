# --- file: Dockerfile ---

#-----------------------------------------------------------------
# Stage 1: Builder
# Installs dependencies and builds the TypeScript code
#-----------------------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install pnpm and openssl (needed for prisma generate)
RUN npm install -g pnpm && \
    apt-get update && apt-get install -y openssl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy manifests first (better cache usage)
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/

# Copy source
COPY . .

# Allow prisma/esbuild scripts (prevents pnpm approve-builds warnings)
RUN pnpm config set allow-scripts true

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build backend (runs prisma generate + tsc)
RUN pnpm --filter "krishi-mitra-backend" build


#-----------------------------------------------------------------
# Stage 2: Production runtime
#-----------------------------------------------------------------
FROM node:20-slim

WORKDIR /app

# Install system deps for Prisma
RUN apt-get update && apt-get install -y openssl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Copy manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/

# Copy Prisma schema (needed for generate in runtime)
COPY packages/backend/prisma ./packages/backend/prisma

# Allow scripts + install only production deps
RUN pnpm config set allow-scripts true && \
    pnpm install --prod --frozen-lockfile

# Generate Prisma client in runtime stage
RUN pnpm --filter krishi-mitra-backend exec prisma generate

# Copy compiled backend from builder
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/ecosystem.config.js ./packages/backend/

# Change working dir
WORKDIR /app/packages/backend

# Use Render's PORT environment variable (default 3003 if not set)
ENV PORT=3003
EXPOSE $PORT

# Start app
CMD ["pnpm", "start"]
