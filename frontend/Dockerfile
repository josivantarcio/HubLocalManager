# ─── Stage 1: build ───────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build                  # gera build/  

# ─── Stage 2: servir estático ────────────────────────────────────────────
FROM nginx:stable-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
# (opcional) copie um nginx.conf customizado se precisar
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
