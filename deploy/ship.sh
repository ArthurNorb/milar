#!/usr/bin/env bash
# Faz o build das imagens de produção NA SUA MÁQUINA e envia para a VPS por SSH.
# Use quando a VPS tem pouca RAM para buildar (E2.1.Micro, 1 GB).
#
#   ./deploy/ship.sh ubuntu@IP_DA_VPS
#
# Requisitos: Docker local, acesso SSH à VPS, mesma arquitetura (x86_64 → x86_64).
# O código na VPS (compose, nginx, scripts) é atualizado com git pull, então dê
# push antes: o script confere se o seu HEAD já está no remoto.
set -euo pipefail
cd "$(dirname "$0")/.."

HOST="${1:-}"
REMOTE_DIR="${REMOTE_DIR:-/opt/milar}"
SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://milararquitetura.com.br}"

if [ -z "$HOST" ]; then
  echo "uso: $0 usuario@IP_DA_VPS" >&2
  exit 1
fi

# A imagem é feita da árvore local: nada de mudança não commitada indo para produção.
if [ -n "$(git status --porcelain)" ]; then
  echo "Há mudanças não commitadas. Commite (e dê push) antes de enviar." >&2
  exit 1
fi
git fetch --quiet
if ! git merge-base --is-ancestor HEAD '@{u}' 2>/dev/null; then
  echo "Seu HEAD ainda não está no remoto. Dê git push antes (a VPS faz git pull)." >&2
  exit 1
fi

local_arch=$(docker info --format '{{.Architecture}}')
remote_arch=$(ssh "$HOST" uname -m)
if [ "$local_arch" != "$remote_arch" ]; then
  echo "Arquitetura diferente (local $local_arch, VPS $remote_arch). Use docker buildx --platform." >&2
  exit 1
fi

echo "→ Build local (NEXT_PUBLIC_SITE_URL=$SITE_URL)..."
NEXT_PUBLIC_SITE_URL="$SITE_URL" POSTGRES_PASSWORD=build-only \
  docker compose -f compose.prod.yml build --pull app migrate

echo "→ Enviando imagens para $HOST (camadas iguais vão uma vez só)..."
docker save milar-app:latest milar-migrate:latest | gzip -1 | ssh "$HOST" 'gunzip | docker load'

echo "→ Atualizando o código e subindo na VPS..."
ssh -t "$HOST" "cd '$REMOTE_DIR' && git pull --ff-only && ./deploy/deploy.sh"
