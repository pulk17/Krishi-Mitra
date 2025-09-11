# --- file: Dockerfile ---

#-----------------------------------------------------------------
# Stage 1: The "builder" stage
# This stage installs all dependencies, copies source, and builds the app.
#-----------------------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy manifests and prisma schema first to leverage Docker cache
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/backend/prisma ./packages/backend/prisma

# Install ALL dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile

# Copy the rest of the monorepo source code
COPY . .

# Build only the backend package
RUN pnpm --filter "krishi-mitra-backend" build


#-----------------------------------------------------------------
# Stage 2: The "production" stage
# This stage creates the final, lean image with only what's needed for runtime.
#-----------------------------------------------------------------
FROM node:20-slim

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

WORKDIR /app/packages/backend

# --> THIS IS THE FIX <--
# Install pnpm in the final production stage so the CMD can use it.
RUN npm install -g pnpm

# Install Python dependencies from the source code
COPY --from=builder /app/packages/backend/src/python/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy production node_modules from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend/node_modules ./node_modules
COPY --from=builder /app/packages/types/node_modules ./node_modules/@krishi-mitra/types/node_modules

# Copy the compiled application code and necessary files from the builder stage
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/prisma ./prisma
COPY --from=builder /app/packages/backend/package.json .
COPY --from=builder /app/packages/backend/ecosystem.config.js .

# Expose the port your app will run on
# Render will automatically map its internal port to this one
EXPOSE 3003

# The command to start the application using pm2
CMD [ "pnpm", "start" ]