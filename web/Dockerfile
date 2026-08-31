# Next.js -- production image.
# Builds the app once at image-build time, serves the built output at
# runtime. No hot-reload, no dev tooling in the final image.

FROM node:22-slim AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
# NEXT_PUBLIC_* vars get inlined into the client-side bundle at BUILD
# time, not read at runtime. Must be passed as a build arg (see
# docker-compose.prod.yml) and match the real public domain in production.
ARG NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 3000
ENV HOSTNAME=0.0.0.0
CMD ["npm", "start"]