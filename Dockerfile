# ---------- Build React app ----------
FROM node:20-slim AS client-build

WORKDIR /app

# Copy only package files first for better caching
COPY package.json package-lock.json* ./
# Install without running lifecycle scripts (postinstall will run later explicitly)
RUN npm ci --ignore-scripts

# Copy the rest of the files and build React
COPY . .
RUN npm run build

# ---------- Build Node.js server ----------
FROM node:20-slim AS server-build

WORKDIR /app

COPY package.json package-lock.json* ./
# Install devDependencies so TypeScript and @types/* are available
RUN npm ci --ignore-scripts

# Copy all source files (except node_modules and dist)
COPY . .

# Copy React build from client-build (copy full `dist` directory produced by client build)
# This avoids nested `dist/dist/build` when the client build already places files inside `dist/`.
COPY --from=client-build /app/dist ./dist

# Compile server
RUN npx tsc

# Remove devDependencies so copied node_modules contain only production deps
RUN npm prune --production

# ---------- Production image ----------
FROM node:20-slim

WORKDIR /app

# Copy server build and React build
COPY --from=server-build /app/dist ./dist
COPY --from=server-build /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/server.js"]
