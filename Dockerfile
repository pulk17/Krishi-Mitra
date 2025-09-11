# --- file: Dockerfile ---

#-----------------------------------------------------------------
# Stage 1: The "builder" stage
# This stage installs all dependencies and builds the TypeScript code.
#-----------------------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install pnpm and openssl for prisma generate
RUN npm install -g pnpm && \
    apt-get update && apt-get install -y openssl

# Copy manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/

# Copy all source code BEFORE installing.
COPY . .

# Install ALL dependencies.
RUN pnpm install --frozen-lockfile

# Build the backend. The `build` script in package.json runs `prisma generate`
# which is necessary here for the TypeScript compiler (tsc) to find the client types.
RUN pnpm --filter "krishi-mitra-backend" build


#-----------------------------------------------------------------
# Stage 2: The "production" stage
# This stage creates the final, lean image for runtime.
#-----------------------------------------------------------------
FROM node:20-slim

# Install openssl for Prisma's runtime
RUN apt-get update && apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/

# Copy the prisma schema, which is needed for the generate command
COPY packages/backend/prisma ./packages/backend/prisma

# Install ONLY production dependencies.
RUN pnpm install --prod --frozen-lockfile

# ----------------------------> THE DEFINITIVE FIX <----------------------------
# Explicitly generate the Prisma client inside the final production stage.
# We use `pnpm exec` to run the `prisma` binary directly. This is the correct syntax.
RUN pnpm --filter krishi-mitra-backend exec prisma generate
# ------------------------------------------------------------------------------

# Copy the compiled application code from the builder stage
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/ecosystem.config.js ./packages/backend/

# Change the final working directory
WORKDIR /app/packages/backend

# Expose the port
EXPOSE 3003

# The command to start the application
CMD [ "pnpm", "start" ]