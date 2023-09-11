FROM debian:stable-slim as get

WORKDIR /bun

RUN apt-get update
RUN apt-get install curl unzip -y
RUN curl --fail --location --progress-bar --output "/bun/bun.zip" "https://github.com/oven-sh/bun/releases/download/bun-v0.8.1/bun-linux-x64.zip"
RUN unzip -d /bun -q -o "/bun/bun.zip"
RUN mv /bun/bun-linux-x64/bun /usr/local/bin/bun
RUN chmod 777 /usr/local/bin/bun

FROM debian:stable-slim as builder
RUN apt-get update
RUN apt-get install sqlite3 -y
COPY --from=get /usr/local/bin/bun /bin/bun
RUN ln -s /bin/bun /bin/bunx && chmod 777 /bin/bunx
WORKDIR /app
COPY ./ /app

RUN bun install
RUN bun run build

ENV NODE_ENV production

CMD ["bun", "run", "/app/start.ts"]