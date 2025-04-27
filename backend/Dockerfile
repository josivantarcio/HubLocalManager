# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install global dependencies
RUN npm install -g npm@latest && \
    npm install -g @nestjs/cli

# Copy configuration files
COPY package*.json ./
COPY tsconfig*.json ./
COPY ormconfig.js ./

# Install production dependencies
RUN npm ci

# Copy all source files
COPY src ./src
COPY migrations ./migrations

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package and config files
COPY package*.json ./
COPY tsconfig*.json ./
COPY ormconfig.js ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/migrations ./migrations

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Run migrations and start the application
CMD ["sh", "-c", "npm run migration:run && node dist/main"]