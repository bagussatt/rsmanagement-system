FROM node:20-alpine

RUN apk add --no-cache \
    openssl \
    zlib \
    libgcc \
    musl

WORKDIR /app

COPY package.json /app
COPY pnpm-lock.yaml /app

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . /app

ENV NODE_ENV=development
ENV DATABASE_URL="postgresql://user:password@postgres:5432/mydb"

RUN npx prisma generate

EXPOSE 3000

CMD ["npx", "ts-node", "src/main.ts"]
