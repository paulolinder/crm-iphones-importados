# ===============================
# Eleve Imports CRM - Production Dockerfile
# ===============================
# Multi-stage build for optimal image size
# Compatible with Easypanel and similar platforms
# ===============================

# ------------------------------
# Stage 1: Dependencies
# ------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production=false

# ------------------------------
# Stage 2: Builder
# ------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build arguments for environment
ARG NUXT_PUBLIC_SUPABASE_URL
ARG NUXT_PUBLIC_SUPABASE_KEY
ARG NUXT_PUBLIC_APP_NAME="Eleve Imports CRM"
ARG NUXT_PUBLIC_APP_VERSION="0.1.0"

# Set environment variables for build
ENV NUXT_PUBLIC_SUPABASE_URL=$NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_KEY=$NUXT_PUBLIC_SUPABASE_KEY
ENV NUXT_PUBLIC_APP_NAME=$NUXT_PUBLIC_APP_NAME
ENV NUXT_PUBLIC_APP_VERSION=$NUXT_PUBLIC_APP_VERSION
ENV NODE_ENV=production

# Build the application
RUN npm run build

# ------------------------------
# Stage 3: Production Runner
# ------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs

# Copy built application
COPY --from=builder --chown=nuxtjs:nodejs /app/.output /app/.output

# Switch to non-root user
USER nuxtjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", ".output/server/index.mjs"]
