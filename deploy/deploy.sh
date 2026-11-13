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
  if ! sudo -n test -f "/etc/milar/certs/$f"; then
    echo "Falta /etc/milar/certs/$f (veja DEPLOY.md, passo Cloudflare)." >&2
    exit 1
  fi
done

COMPOSE=(docker compose --env-file "$ENV_FILE" -f compose.prod.yml)

case "${1:-up}" in
  up)
    # Em VPS com menos de ~2 GB de RAM (ex.: E2.1.Micro) o build do Next não
    # cabe e ainda derrubaria os outros sites. Nesse caso as imagens vêm
    # prontas da sua máquina (deploy/ship.sh) e aqui só sobem.
    mem_kb=$(awk '/MemTotal/ {print $2}' /proc/meminfo)
    if [ "${FORCE_BUILD:-0}" = "1" ] || [ "$mem_kb" -ge 1900000 ]; then
      "${COMPOSE[@]}" build --pull
    else
      for img in milar-app:latest milar-migrate:latest; do
        if ! docker image inspect "$img" >/dev/null 2>&1; then
          echo "Imagem $img não encontrada. Esta VPS tem pouca RAM para o build:" >&2
          echo "rode na sua máquina:  ./deploy/ship.sh ubuntu@IP_DA_VPS" >&2
          exit 1
        fi
      done
    fi
    "${COMPOSE[@]}" up -d --no-build --remove-orphans
    "${COMPOSE[@]}" ps
    docker image prune -f >/dev/null
    # Confere o Nginx do host (não recarrega sozinho: isso afeta os outros sites).
    if command -v nginx >/dev/null 2>&1 && ! sudo nginx -t 2>/dev/null; then
      echo "Atenção: 'sudo nginx -t' falhou. Corrija antes de rodar 'sudo systemctl reload nginx'." >&2
    fi
    ;;
  logs) "${COMPOSE[@]}" logs -f --tail=200 ;;
  ps) "${COMPOSE[@]}" ps ;;
  down) "${COMPOSE[@]}" down ;;
  *) echo "uso: $0 [up|logs|ps|down]" >&2; exit 1 ;;
esac
