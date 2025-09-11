#-----------------------------------------------------------------
# Stage 1: Builder
# - This stage builds the application and its dependencies.
#-----------------------------------------------------------------
FROM node:20-slim AS builder

# 1. Install system dependencies including Python
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 2. Set up Python virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# 3. Set up Node.js environment and install pnpm
WORKDIR /app
RUN npm install -g pnpm

# 4. Copy manifests to leverage Docker layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

# 5. Install all monorepo dependencies
RUN pnpm install --frozen-lockfile

# 6. Copy the entire monorepo source code
COPY . .

# 7. Install Python dependencies
RUN pip install --no-cache-dir -r packages/backend/src/python/requirements.txt

# 8. Build the backend and all of its workspace dependencies
RUN pnpm --filter "krishi-mitra-backend..." run build

# 9. DIAGNOSTIC: Verify that the build output actually exists.
# This will fail the build if the file is missing, giving us a clear error.
RUN test -f /app/packages/backend/dist/index.js || (echo "--> BUILD FAILED: Compiled entrypoint /app/packages/backend/dist/index.js was NOT created." && exit 1)


#-----------------------------------------------------------------
# Stage 2: Pruner
# - This stage creates a minimal, production-only node_modules.
#-----------------------------------------------------------------
FROM builder AS pruner

WORKDIR /app
RUN pnpm deploy --filter krishi-mitra-backend --prod /prod --legacy


#-----------------------------------------------------------------
# Stage 3: Production Image (FINAL, HARDENED VERSION)
# - This stage creates the final, lean, and robust image.
#-----------------------------------------------------------------
FROM node:20-slim AS production

# 1. Install pnpm, which will be our process manager
RUN npm install -g pnpm

# 2. Set environment
ENV NODE_ENV=production
ENV PORT=3003

# 3. Copy the Python virtual environment
ENV VIRTUAL_ENV=/opt/venv
COPY --from=builder /opt/venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# 4. Set up the final, self-contained application directory
WORKDIR /app

# 5. Copy the pruned package.json and node_modules from the pruner stage
COPY --from=pruner /prod/package.json .
COPY --from=pruner /prod/node_modules ./node_modules

# 6. Copy the compiled application code using the robust trailing-slash syntax
COPY --from=builder /app/packages/backend/dist/ ./dist/

# 7. Expose the port and define the self-contained start command
EXPOSE 3003
CMD [ "pnpm", "start" ]