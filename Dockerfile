# ---- build stage ----
FROM node:22-alpine AS build
WORKDIR /app

# Copy workspace manifests first (better layer caching)
COPY package*.json ./
COPY packages/hmcts-frontend/package*.json packages/hmcts-frontend/
COPY packages/hmcts-docs/package*.json packages/hmcts-docs/

# Install all deps for the workspace
RUN npm ci

# Copy source
COPY packages/hmcts-frontend packages/hmcts-frontend
COPY packages/hmcts-docs packages/hmcts-docs

# Build the design system CSS
RUN npm -w @hmcts/hmcts-frontend run build

# Remove dev deps for runtime
RUN npm prune --omit=dev && npm cache clean --force

# ---- runtime stage ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app /app

ENV PORT=3000
EXPOSE 3000

# Optional (requires /health route)
# HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
#   CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

USER node

CMD ["node", "packages/hmcts-docs/server.js"]


