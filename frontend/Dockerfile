# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]