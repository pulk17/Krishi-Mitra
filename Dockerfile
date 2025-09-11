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

# Copy manifests first to leverage Docker cache
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

# THIS IS THE FIRST FIX: Copy all source code BEFORE installing.
# This ensures prisma/schema.prisma is available for the generate command.
COPY . .

# Install ALL dependencies.
RUN pnpm install --frozen-lockfile

# Build only the backend package. The `build` script already runs `prisma generate`.
RUN pnpm --filter "krishi-mitra-backend" build


#-----------------------------------------------------------------
# Stage 2: The "production" stage
# This stage creates the final, lean image for runtime.
#-----------------------------------------------------------------
FROM node:20-slim

# THIS IS THE SECOND FIX: Install openssl for Prisma's runtime.
RUN apt-get update && apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables for Python
ENV PYTHONUNBUFFERED=1
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install system dependencies (Python)
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set up Python virtual environment
RUN python3 -m venv $VIRTUAL_ENV

WORKDIR /app

# Install pnpm globally in the final stage
RUN npm install -g pnpm

# Copy only the manifests required to install PRODUCTION dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/

# Install ONLY production dependencies.
RUN pnpm install --prod --frozen-lockfile

# Copy the Python scripts and install their dependencies
COPY packages/backend/src/python/ ./packages/backend/src/python/
RUN pip install --no-cache-dir -r packages/backend/src/python/requirements.txt

# Copy the generated Prisma client and compiled code from the builder stage
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/prisma ./packages/backend/prisma
COPY --from=builder /app/packages/backend/ecosystem.config.js ./packages/backend/

# Change the final working directory
WORKDIR /app/packages/backend

# Expose the port your app will run on
EXPOSE 3003

# The command to start the application using pm2
CMD [ "pnpm", "start" ]