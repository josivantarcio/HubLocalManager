# ─── Stage 1: build ───────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# 1) Copia package.json e instala todas as deps
COPY package.json package-lock.json* ./
RUN npm ci

# 2) Copia código-fonte e compila
COPY tsconfig*.json ./
COPY src/ ./src/
COPY ormconfig.js ./               # pega seu ormconfig.js
RUN npm run build                  # deve gerar dist/

# ─── Stage 2: produção ───────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /usr/src/app

# 3) Instala apenas deps de produção
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# 4) Traz build e config do stage anterior
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/ormconfig.js ./

ENV NODE_ENV=production
EXPOSE 3000                         # porta padrão NestJS

# 5) Comando de startup
CMD ["node", "dist/main.js"]
