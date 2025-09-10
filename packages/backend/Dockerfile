# 1. Base Image
FROM node:20-slim

# 2. Install Python and Pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 3. Set up the working directory
WORKDIR /app

# 4. Install pnpm
RUN npm install -g pnpm

# 5. Copy the ROOT pnpm lockfile and the root package.json
COPY pnpm-lock.yaml ./
COPY package.json ./

# 6. Copy the necessary package.json files for each workspace package
COPY packages/types/package.json ./packages/types/
COPY packages/backend/package.json ./packages/backend/

# 7. Install ALL monorepo dependencies
# pnpm will use the lockfile and workspace structure to install everything efficiently.
RUN pnpm install --frozen-lockfile

# 8. Copy the source code for the backend and its dependencies (the types package)
COPY packages/backend/ ./packages/backend/
COPY packages/types/ ./packages/types/

# 9. Install Python dependencies for the backend
RUN pip3 install --no-cache-dir -r packages/backend/src/python/requirements.txt

# 10. Build only the backend package
RUN pnpm --filter krishi-mitra-backend build

# 11. Set the final working directory
WORKDIR /app/packages/backend

# 12. Expose the port
EXPOSE 3003

# 13. Define the command to start the app
CMD [ "pnpm", "start" ]