#-----------------------------------------------------------------
# FINAL, SIMPLIFIED SINGLE-STAGE DOCKERFILE
#-----------------------------------------------------------------
FROM node:20-slim

# 1. Set environment variables
ENV PYTHONUNBUFFERED=1
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# 2. Install system dependencies including Python
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 3. Set up Python virtual environment
RUN python3 -m venv $VIRTUAL_ENV

# 4. Set up Node.js environment and install pnpm
WORKDIR /app
RUN npm install -g pnpm

# 5. Copy all manifests
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

# 6. Copy the prisma schema first to leverage caching
COPY packages/backend/prisma ./packages/backend/prisma

# 7. Install ALL monorepo dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# 8. Copy the rest of the source code
COPY . .

# 9. Install Python dependencies
RUN pip install --no-cache-dir -r packages/backend/src/python/requirements.txt

# 10. Build the backend application
# This runs `prisma generate` and `tsc --build`
RUN pnpm --filter "krishi-mitra-backend" run build

# 11. Set the final working directory
WORKDIR /app/packages/backend

# 12. Expose the port and define the start command
EXPOSE 3003
CMD [ "pnpm", "start" ]