# Development Setup Guide

## Local Development

Strapi and Next.js run **natively** (not in Docker); only PostgreSQL runs in a container. Schema changes made through Strapi's admin panel are written directly to disk this way, with no container filesystem involved.

```bash
# Start PostgreSQL
docker compose up -d

# Terminal 1 — Strapi
cd server
npm install
npm run develop

# Terminal 2 — Next.js
cd web
npm install
npm run dev
```

- Strapi admin: http://localhost:1337/admin
- Frontend: http://localhost:3000

Commit schema changes (`server/src`, `server/config`) to git regularly.

## Environment Variables

Three `.env` files are used, since Docker Compose's own variable substitution and each app's runtime environment are read separately:

| File | Used by |
|---|---|
| `server/.env` | Strapi (secrets, database credentials, public URLs) |
| `web/.env` | Next.js (`NEXT_PUBLIC_STRAPI_URL`) |
| Root `.env` | Docker Compose itself, for any `${VARIABLE}` in the compose files |

Database credentials and the three public URL variables (`PUBLIC_STRAPI_URL`, `STRAPI_ADMIN_URL`, `NEXT_PUBLIC_STRAPI_URL`) need to be set in **both** the relevant subfolder `.env` and the root `.env`.

### `server/.env`

```
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=
DATABASE_USERNAME=
DATABASE_PASSWORD=

ADMIN_JWT_SECRET=
JWT_SECRET=
ENCRYPTION_KEY=
API_TOKEN_SALT=
TRANSFER_TOKEN_SALT=
APP_KEYS=

PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_ADMIN_URL=http://localhost:1337/admin
```

Generate secrets with:
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

`DATABASE_HOST` is `localhost` for native development; `docker-compose.prod.yml` overrides this to `postgres` automatically.

### `web/.env`

```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### Root `.env`

```
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_ADMIN_URL=http://localhost:1337/admin
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## Production Build

```bash
docker compose -f docker-compose.prod.yml up --build
```

Multi-stage builds — `npm run build` at image-build time, `npm start` at runtime. Update all three `.env` files to your real domain (not `localhost`) before deploying.

## Database Backups

```bash
bash backup-db.sh
```

Full export (content + media):
```bash
docker compose exec strapi npm run strapi export -- --no-encrypt --file backup
docker compose cp strapi:/opt/app/backup.tar.gz ./backups/backup_$(date +%Y%m%d_%H%M).tar.gz
```

`docker-compose.prod.yml` also runs a daily automated backup with 7-day retention.

## API Reference

```bash
curl http://localhost:1337/api/publications
curl "http://localhost:1337/api/publications?populate=team_members,links"
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Content not showing on frontend | Confirm the entry is published, and that the content type has `find`/`findOne` enabled for the Public role (Settings → Users & Permissions → Roles → Public) |
| Images not loading | Check the URL is built from `NEXT_PUBLIC_STRAPI_URL`, not an internal Docker hostname |
| `ECONNREFUSED` on Strapi startup | PostgreSQL isn't running (`docker compose up -d`), or `DATABASE_HOST` doesn't match how you're running Strapi |
| `password authentication failed` | Password in `.env` doesn't match Postgres's actual password, or contains an unquoted special character |
| Compose warns a variable "is not set" | The variable is missing from the root `.env` |
| Fresh-install screen after renaming the project folder | Add `name: your-project-name` at the top of the compose file |
| Port already in use | `netstat -ano \| findstr :5432` (Windows), then stop the conflicting process or change the port mapping |
| Low disk space from old images | `docker image prune`, or `docker system prune -a` |
