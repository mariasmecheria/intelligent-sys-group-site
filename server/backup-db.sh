#!/bin/bash
# Usage: ./backup-db.sh
# Reads DATABASE_USERNAME and DATABASE_NAME from your .env file automatically.

set -e

if [ ! -f .env ]; then
  echo "No .env file found in current directory. Run this from your Strapi project root."
  exit 1
fi

DB_USER=$(grep '^DATABASE_USERNAME=' .env | cut -d '=' -f2-)
DB_NAME=$(grep '^DATABASE_NAME=' .env | cut -d '=' -f2-)

if [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]; then
  echo "Could not find DATABASE_USERNAME or DATABASE_NAME in .env"
  exit 1
fi

mkdir -p backups
FILENAME="backups/backup_$(date +%Y%m%d_%H%M).sql"

docker compose exec -T postgres pg_dump -U "$DB_USER" -d "$DB_NAME" > "$FILENAME"

echo "Backup saved to $FILENAME"
ls -lh "$FILENAME"