# Stage 1: Build
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy root package files
COPY package.json bun.lock ./

# Copy web app package files
COPY apps/web/package.json apps/web/

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the web app (creates dist/apps/web/)
RUN bun run build

# Stage 2: Production
FROM oven/bun:1 AS runner

WORKDIR /app

# Copy package files for production install
COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/

# Install production dependencies only
RUN bun install --production

# Copy built assets from builder
# server.ts expects build at ../../dist/apps/web relative to apps/web/
COPY --from=builder /app/dist dist/
COPY --from=builder /app/apps/web/server.ts apps/web/
COPY --from=builder /app/apps/web/package.json apps/web/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=::

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["bun", "-e", "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1))"]

# Start the server
WORKDIR /app/apps/web
CMD ["bun", "--env-file=.env", "server.ts"]