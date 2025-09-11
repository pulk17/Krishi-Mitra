#-----------------------------------------------------------------
# Stage 1: Builder
# - Installs all dependencies (prod + dev)
# - Copies all source code
# - Builds the TypeScript and generates Prisma client
#-----------------------------------------------------------------
FROM node:20-slim AS builder

# 1. Install Python, Pip, and Git
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 2. Create and set up a Python virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# 3. Set up the working directory and install pnpm
WORKDIR /app
RUN npm install -g pnpm

# 4. Copy manifests to leverage Docker layer caching
#    Crucially, this includes pnpm-workspace.yaml
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

# 5. Install ALL monorepo dependencies
RUN pnpm install --frozen-lockfile

# 6. Copy the entire monorepo source code
COPY . .

# 7. Install Python dependencies INTO the virtual environment
RUN pip install --no-cache-dir -r packages/backend/src/python/requirements.txt

# 8. Build the backend package AND all of its workspace dependencies
RUN pnpm --filter "krishi-mitra-backend..." run build


#-----------------------------------------------------------------
# Stage 2: Pruner
# - Creates a clean production-only node_modules directory
#-----------------------------------------------------------------
FROM builder AS pruner

WORKDIR /app
# Use pnpm's deploy command to create a pruned production node_modules
RUN pnpm deploy --filter krishi-mitra-backend --prod /prod --legacy


#-----------------------------------------------------------------
# Stage 3: Production Image
# - Starts from a fresh slim image
# - Copies only the necessary built artifacts
#-----------------------------------------------------------------
FROM node:20-slim AS production

# 1. Set environment
ENV NODE_ENV=production
ENV PORT=3003

# 2. Copy the Python virtual environment
ENV VIRTUAL_ENV=/opt/venv
COPY --from=builder /opt/venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# 3. Set up the working directory
WORKDIR /app

# 4. Copy the pruned, production-only node_modules and package.json
COPY --from=pruner /prod/package.json /prod/pnpm-lock.yaml ./
COPY --from=pruner /prod/node_modules ./node_modules
COPY --from=pruner /prod/packages/backend/package.json ./packages/backend/

# 5. Copy the compiled application code
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist

# 6. Set the final working directory for the running app
WORKDIR /app/packages/backend

# 7. Expose the port and define the start command
EXPOSE 3003
CMD [ "node", "dist/server.js" ]