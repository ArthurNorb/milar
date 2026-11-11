# syntax=docker/dockerfile:1
# Imagem de produção do Milar (funciona em ARM64 — Oracle Ampere A1 — e x86_64).

ARG NODE_IMAGE=node:22-alpine

# ---------- dependências (inclui dev: o build e o drizzle-kit precisam) ----------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- build do Next (output: standalone) ----------
FROM deps AS builder
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* é embutido no build.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
# Valores fictícios só para o build (o cliente do banco é lazy e não conecta).
# Não vão para a imagem final: o estágio runner não herda deste.
ENV DATABASE_URL=postgres://build:build@127.0.0.1:1/build \
    SESSION_SECRET=build-only-secret-not-used-at-runtime-0000
COPY . .
RUN npm run build

# ---------- migrations (one-shot, roda antes do app) ----------
FROM deps AS migrator
COPY drizzle.config.ts ./
COPY drizzle ./drizzle
COPY lib/db/schema.ts ./lib/db/schema.ts
USER node
CMD ["node", "node_modules/drizzle-kit/bin.cjs", "migrate"]

# ---------- runtime enxuto ----------
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    UPLOADS_DIR=/data/uploads

# Código pertence ao root (o processo não consegue alterá-lo); só .next
# (cache de imagens/ISR) e /data (fotos) são graváveis pelo usuário node.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN mkdir -p /app/.next/cache /data/uploads \
 && chown -R node:node /app/.next /data

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]
