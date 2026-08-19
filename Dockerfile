FROM ghcr.io/pnpm/pnpm:11.21.0 AS builder
WORKDIR /app
ENV CI=true
ENV VITE_API_URL=https://proxy.eldora.derg.ch/

RUN pnpm runtime set node 24 -g

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build


FROM nginxinc/nginx-unprivileged:1.31-alpine3.24 AS server

COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080

ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
