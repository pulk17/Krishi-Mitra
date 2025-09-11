#-----------------------------------------------------------------
# Stage 1: Builder
# - This stage installs all dependencies and builds the source code.
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

# 8. Build the backend and its dependencies using TypeScript's build mode
RUN pnpm --filter "krishi-mitra-backend" run build

# 9. Prune development dependencies to shrink node_modules
RUN pnpm prune --prod


#-----------------------------------------------------------------
# Stage 2: Production Image (Simplified & Final)
# - Copies artifacts directly from the pruned builder stage.
#-----------------------------------------------------------------
FROM node:20-slim AS production

# 1. Set environment
ENV NODE_ENV=production
ENV PORT=3003

# 2. Copy the Python virtual environment
ENV VIRTUAL_ENV=/opt/venv
COPY --from=builder /opt/venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# 3. Set up the final application directory
WORKDIR /app

# 4. Copy the backend's package.json
COPY --from=builder /app/packages/backend/package.json .

# 5. Copy the pruned, production-only node_modules from the builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend/node_modules ./packages/backend/node_modules
COPY --from=builder /app/packages/types/node_modules ./packages/types/node_modules

# 6. Copy the compiled application code
COPY --from=builder /app/packages/backend/dist/ ./dist/

# 7. Expose the port and define the start command
EXPOSE 3003
CMD ["node", "dist/index.js"]