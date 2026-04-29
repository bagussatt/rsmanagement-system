FROM node:20-alpine AS server-build
RUN apk add --no-cache \
    openssl \
    zlib \
    libgcc \
    musl

WORKDIR /app

COPY server/package.json /app
COPY server/pnpm-lock.yaml /app

RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY server /app
ENV NODE_ENV=development
ENV DATABASE_URL="postgresql://user:password@postgres:5432/mydb"

RUN pnpm run prisma:generate && pnpm build
RUN pnpm prune --prod

FROM node:20-alpine AS client-build
RUN apk add --no-cache \
    openssl \
    zlib \
    libgcc \
    musl

WORKDIR /app

COPY client/package.json /app
COPY client/package-lock.json /app

RUN npm ci

COPY client /app
ENV NODE_ENV=production
RUN npm run build


FROM node:20-alpine3.20 AS runner
RUN apk add --no-cache \
    openssl \
    zlib \
    libgcc \
    musl

WORKDIR /app
COPY --from=server-build /app/dist /app/dist
COPY --from=server-build /app/node_modules /app/node_modules
COPY --from=server-build /app/prisma /app/prisma

COPY --from=client-build /app/out /app/public

# Argument to pass the GitHub repository URL for labeling the image
ARG GITHUB_URL
LABEL org.opencontainers.image.source=$GITHUB_URL

ENV NODE_ENV=development
EXPOSE 3000
# This command starts the Node.js application using the built server code
CMD ["node", "dist/main.js"]
