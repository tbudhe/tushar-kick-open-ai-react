# ---------- Build React app ----------
FROM node:20-slim AS client-build

WORKDIR /app

# Copy only package files first for better caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the files and build React
COPY . .
RUN npm run build

# ---------- Build Node.js server ----------
FROM node:20-slim AS server-build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

# Copy all source files (except node_modules and dist)
COPY . .

# Copy React build from client-build
COPY --from=client-build /app/dist/build ./dist/build

# Compile server
RUN npx tsc

# ---------- Production image ----------
FROM node:20-slim

WORKDIR /app

# Copy server build and React build
COPY --from=server-build /app/dist ./dist
COPY --from=server-build /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/server.js"]

