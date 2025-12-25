# Stage 1: Dependencies
FROM node:22.14.0-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.9.2 --activate

COPY .yarnrc.yml package.json yarn.lock* pnpm-lock.yaml* ./

RUN yarn install --immutable

# Stage 2: Builder
FROM node:22.14.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

# Stage 3: Runner
FROM node:22.14.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Next.js 15 leverages standalone output for optimized production builds
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY public ./public
CMD ["node", "server.js"]