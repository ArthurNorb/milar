#!/usr/bin/env bash
# Sobe/atualiza a produção. Rode na VPS, dentro do repositório:
#   ./deploy/deploy.sh          # build + migrations + sobe tudo
#   ./deploy/deploy.sh logs     # acompanha os logs
#   ./deploy/deploy.sh ps       # status dos serviços
set -euo pipefail
cd "$(dirname "$0")/.."

ENV_FILE=.env.production
if [ ! -f "$ENV_FILE" ]; then
  echo "Falta $ENV_FILE (veja DEPLOY.md, passo Segredos)." >&2
  exit 1
fi

# O arquivo de segredos não pode ser legível por outros usuários.
perms=$(stat -c '%a' "$ENV_FILE")
if [ "$perms" != "600" ] && [ "$perms" != "400" ]; then
  echo "$ENV_FILE está com permissão $perms; rode: chmod 600 $ENV_FILE" >&2
  exit 1
fi

for f in origin.pem origin.key cloudflare-origin-pull-ca.pem; do
  if [ ! -f "/etc/milar/certs/$f" ]; then
    echo "Falta /etc/milar/certs/$f (veja DEPLOY.md, passo Cloudflare)." >&2
    exit 1
  fi
done

COMPOSE=(docker compose --env-file "$ENV_FILE" -f compose.prod.yml)

case "${1:-up}" in
  up)
    "${COMPOSE[@]}" build --pull
    "${COMPOSE[@]}" up -d --remove-orphans
    "${COMPOSE[@]}" ps
    docker image prune -f >/dev/null
    ;;
  logs) "${COMPOSE[@]}" logs -f --tail=200 ;;
  ps) "${COMPOSE[@]}" ps ;;
  down) "${COMPOSE[@]}" down ;;
  *) echo "uso: $0 [up|logs|ps|down]" >&2; exit 1 ;;
esac
