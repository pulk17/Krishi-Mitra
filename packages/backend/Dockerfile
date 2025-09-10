# 1. Base Image: Use a modern Node.js version
FROM node:20-slim

# 2. Install Python and Pip
# This command sequence updates the package list, installs Python, pip, and Git,
# then cleans up to keep the image size small.
RUN apt-get update && \
    apt-get install -y python3 python3-pip git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 3. Set up the working directory inside the container
WORKDIR /app

# 4. Install pnpm globally
RUN npm install -g pnpm

# 5. Copy dependency manifests
# We copy these first to leverage Docker's layer caching.
# This step only re-runs if these files change.
COPY package.json pnpm-lock.yaml ./

# 6. Install Node.js dependencies
# --frozen-lockfile is a best practice for production installs.
RUN pnpm install --frozen-lockfile

# 7. Copy the backend source code into the container
COPY . .

# 8. Install Python dependencies
# This uses the requirements.txt file we created earlier.
RUN pip3 install --no-cache-dir -r src/python/requirements.txt

# 9. Build the TypeScript code
# This will compile your src folder to a dist folder.
RUN pnpm build

# 10. Expose the port the app runs on
# Railway will automatically use this, but it's good practice.
EXPOSE 3003

# 11. Define the command to start the app
# This runs the 'start' script from your package.json.
CMD [ "pnpm", "start" ]