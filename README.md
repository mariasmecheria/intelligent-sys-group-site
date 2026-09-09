# Intelligent Systems Group — Website

The official website for the Intelligent Systems Group at the Technical University of Cluj-Napoca. Showcases the group's research, team members, publications, courses, projects, and grants.

## Overview

- **Backend** (`server/`) — Strapi v5 (TypeScript) headless CMS
- **Frontend** (`web/`) — Next.js (App Router)

Content is managed through Strapi's admin panel; the frontend fetches it via Strapi's REST API.

## Tech Stack

**Frontend**
- Next.js (App Router) + React
- Plain CSS Modules (no Tailwind, no component library)

**Backend**
- Strapi v5 (TypeScript)
- PostgreSQL

**Infrastructure**
- Docker (PostgreSQL in development; the full stack in production)

## Project Structure

```
project-root/
├── server/                    # Strapi backend
│   ├── src/api/               # Content type definitions
│   ├── config/                # Strapi configuration
│   ├── Dockerfile.dev
│   ├── Dockerfile             # Production image
│   └── .env
├── web/                       # Next.js frontend
│   ├── app/                   # Routes
│   ├── components/
│   ├── lib/                   # Strapi data-fetching functions
│   ├── Dockerfile             # Production image
│   └── .env
├── docker-compose.yml          # PostgreSQL only — local development
├── docker-compose.prod.yml     # Full stack — production
├── backup-db.sh
├── backups/
└── .env                        # Root-level values, used by Docker Compose
```

## Quick Start

### Prerequisites

- Docker Desktop
- Node.js 22+
- Git

### Setup

```bash
git clone <repository-url>
cd <project-folder>

cp server/.env.example server/.env
cp web/.env.example web/.env
```

Also create a root `.env` — see [SETUP.md](./SETUP.md) for which values it needs.

Start PostgreSQL:

```bash
docker compose up -d
```

Run Strapi:

```bash
cd server
npm install
npm run develop
```

Run Next.js:

```bash
cd web
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Strapi Admin: http://localhost:1337/admin
- Strapi API: http://localhost:1337/api

On first run, Strapi will prompt you to create an admin account.

### Importing legacy publication data (optional)

```bash
STRAPI_URL=http://localhost:1337 STRAPI_API_TOKEN=your_token node import-all.mjs
```

Generate the API token in Strapi admin under **Settings → API Tokens**.

## Content Model

| Content type | Purpose |
|---|---|
| Publication | Journal articles, conference papers, book chapters |
| Team Member | Profiles, publications, courses |
| Team | Groups team members into sub-teams — reserved for future integration |
| Course | Taught courses |
| Project | Research projects |
| Grant | Funded grants |
| Global | Site-wide navbar/footer/partners |
| Homepage | Hero, About Us, quick links, services, selected publications |

## Production Deployment

```bash
docker compose -f docker-compose.prod.yml up --build
```

See [SETUP.md](./SETUP.md) for environment variable requirements.

## Documentation

- [SETUP.md](./SETUP.md) — development setup, environment variables, troubleshooting
- [Strapi Documentation](https://docs.strapi.io/)
- [Next.js Documentation](https://nextjs.org/docs)

## License

Unknown for the moment. Standby.
