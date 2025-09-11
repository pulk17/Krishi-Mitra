# --- file: Dockerfile ---

#-----------------------------------------------------------------
# Stage 1: The "builder" stage
# This stage builds the TypeScript source code.
#-----------------------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy manifests first to leverage Docker cache
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

# Install ALL dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile

# Copy the rest of the monorepo source code
COPY . .

# Build only the backend package
RUN pnpm --filter "krishi-mitra-backend" build


#-----------------------------------------------------------------
# Stage 2: The "production" stage
# This stage creates the final, lean image for runtime.
#-----------------------------------------------------------------
FROM node:20-slim

# Set environment variables for Python (still needed for the venv)
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

# --> THE DEFINITIVE FIX <--
# Install pnpm globally in the final stage
RUN npm install -g pnpm

# Copy ONLY the manifests required to install PRODUCTION dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/
# We don't copy the frontend package.json as it's not a backend dependency

# Install ONLY production dependencies using the lockfile.
# This correctly builds the node_modules structure with valid symlinks.
RUN pnpm install --prod --frozen-lockfile

# Copy the Python scripts and install their dependencies
COPY packages/backend/src/python/ ./packages/backend/src/python/
RUN pip install --no-cache-dir -r packages/backend/src/python/requirements.txt

# Copy the compiled application code and necessary assets from the builder stage
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/backend/prisma ./packages/backend/prisma
COPY --from=builder /app/packages/backend/ecosystem.config.js ./packages/backend/

# Change the final working directory
WORKDIR /app/packages/backend

# Expose the port your app will run on
EXPOSE 3003

# The command to start the application using pm2
CMD [ "pnpm", "start" ]