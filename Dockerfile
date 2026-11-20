FROM node:24-alpine

ENV NODE_ENV=production \
    PORT=80

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# tsx es devDependency y se usa en runtime (el alias "@/" no lo resuelve tsc)
RUN pnpm install --frozen-lockfile --prod=false

COPY tsconfig.json ./
COPY src ./src

USER node
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

CMD ["pnpm", "exec", "tsx", "src/main.ts"]
