# 1. Base Image
FROM node:20-slim

# 2. Install Python, Pip, and Git
RUN apt-get update && \
    apt-get install -y python3 python3-venv python3-pip git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 3. Create and activate a Python virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# 4. Set up the working directory
WORKDIR /app

# 5. Install pnpm
RUN npm install -g pnpm

# 6. Copy dependency manifests
COPY pnpm-lock.yaml ./
COPY package.json ./

# 7. Copy package.json files for each workspace package
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/

# 8. Install ALL monorepo dependencies
RUN pnpm install --frozen-lockfile

# 9. Copy the source code for the backend and its dependencies
COPY packages/backend/ ./packages/backend/
COPY packages/types/ ./packages/types/

# 10. Install Python dependencies INTO the virtual environment
RUN pip install --no-cache-dir -r packages/backend/src/python/requirements.txt

# 11. Build only the backend package
RUN pnpm --filter krishi-mitra-backend build

# 12. Set the final working directory
WORKDIR /app/packages/backend

# 13. Expose the port
EXPOSE 3003

# 14. Define the command to start the app
CMD [ "pnpm", "start" ]