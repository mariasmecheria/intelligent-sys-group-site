# Strapi -- production image.
# Builds the admin panel AND compiles the TypeScript backend once at
# image-build time, serves the compiled output at runtime.

FROM node:22-slim AS base
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /opt/app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
# Build-time config for the Strapi admin bundle. Compose's runtime
# `environment:` does NOT apply during `docker build` -- these must be
# passed explicitly as build args (see docker-compose.prod.yml).
ARG PUBLIC_STRAPI_URL
ARG STRAPI_ADMIN_URL
ENV PUBLIC_STRAPI_URL=$PUBLIC_STRAPI_URL
ENV STRAPI_ADMIN_URL=$STRAPI_ADMIN_URL
# For a TypeScript project, this compiles config/ and src/ (not just the
# admin UI) into dist/ -- dist/config, dist/src, dist/build, etc. The
# runtime stage must load from dist/, never from raw .ts source.
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=deps /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/package.json ./package.json
COPY --from=build /opt/app/public ./public
# tsconfig.json is required at runtime so Strapi's CLI detects this as a
# TypeScript project and knows to read compiled config from dist/config
# instead of expecting raw .js config at project root.
COPY --from=build /opt/app/tsconfig.json ./tsconfig.json

# Deliberately NOT copying raw config/ or src/ (.ts) into this stage --
# they're already compiled into dist/ above. Copying the raw TS files
# here caused Strapi to try loading them directly at runtime (no
# TypeScript compiler active in `npm start`), which failed with
# "Config file not loaded, extension must be one of .js,.json" and left
# db.config.connection undefined.

EXPOSE 1337
CMD ["npm", "start"]