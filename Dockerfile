# Homesta Studio – render worker (Remotion + Chrome Headless Shell)
FROM node:22-bookworm-slim

# Libraries Chrome Headless Shell needs + fonts fallback
RUN apt-get update && apt-get install -y --no-install-recommends \
      libnss3 libdbus-1-3 libatk1.0-0 libgbm-dev libasound2 libxrandr2 libxkbcommon-dev \
      libxfixes3 libxcomposite1 libxdamage1 libatk-bridge2.0-0 libpango-1.0-0 libcairo2 libcups2 \
      ca-certificates fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
COPY . .

# Download Chrome Headless Shell into the image (no download at runtime)
RUN npx remotion browser ensure

ENV NODE_ENV=production \
    PORT=8080 \
    POLL_SECONDS=10 \
    RENDER_CONCURRENCY=1

EXPOSE 8080
HEALTHCHECK --interval=60s --timeout=5s --start-period=60s CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||8080)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["npx", "tsx", "server/worker.ts"]
