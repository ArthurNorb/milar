#!/usr/bin/env bash
# Backup local: dump do Postgres + fotos enviadas, com retenção.
# Rodado pelo timer systemd milar-backup.timer (veja DEPLOY.md).
set -euo pipefail
cd "$(dirname "$0")/.."

DEST="${BACKUP_DIR:-/var/backups/milar}"
KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"
COMPOSE=(docker compose --env-file .env.production -f compose.prod.yml)

umask 077
mkdir -p "$DEST"
chmod 700 "$DEST"
ts=$(date +%F-%H%M)

# Dump no formato custom (comprimido, restaurável com pg_restore).
"${COMPOSE[@]}" exec -T db pg_dump -U milar -d milar -Fc > "$DEST/db-$ts.dump.tmp"
mv "$DEST/db-$ts.dump.tmp" "$DEST/db-$ts.dump"

# Fotos: lidas de dentro do container do app (volume /data/uploads).
"${COMPOSE[@]}" exec -T app tar -czf - -C /data/uploads . > "$DEST/uploads-$ts.tar.gz.tmp"
mv "$DEST/uploads-$ts.tar.gz.tmp" "$DEST/uploads-$ts.tar.gz"

find "$DEST" -maxdepth 1 -type f \( -name 'db-*.dump' -o -name 'uploads-*.tar.gz' \) \
  -mtime +"$KEEP_DAYS" -delete
find "$DEST" -maxdepth 1 -type f -name '*.tmp' -mmin +60 -delete

echo "Backup ok: $DEST/db-$ts.dump, $DEST/uploads-$ts.tar.gz"
