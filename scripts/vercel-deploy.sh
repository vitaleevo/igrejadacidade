#!/usr/bin/env bash
# Liga o repo à Vercel e faz deploy prod — CORRER NA TUA MÁQUINA após `vercel login`.
# Nunca commitar segredos. Valores lidos do teu .env local ou digitados (ocultos).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR/frontend"

if ! vercel whoami >/dev/null 2>&1; then
  echo "Faz login primeiro: vercel login"
  exit 1
fi

echo "== Link (scope: vitaleevo, repo: igrejadacidade, root: frontend) =="
vercel link --yes 2>/dev/null || vercel link

echo "== Envs Production (lê do .env local se existir, senão pede sem eco) =="
ask_secret() {
  local name="$1" file_val="$2"
  if [ -n "$file_val" ]; then echo "$file_val"; return; fi
  read -rsp "$name: " v; echo; echo "$v"
}
# Tenta ler de frontend/.env.local (gitignored) sem imprimir
get_env() { grep -E "^$1=" .env.local 2>/dev/null | cut -d= -f2- || true; }

API_URL="${NEXT_PUBLIC_API_URL:-$(get_env NEXT_PUBLIC_API_URL)}"
[ -z "$API_URL" ] && API_URL="https://api.igrejadacidadeluanda.org"
SITE_URL="https://igrejadacidadeluanda.org"
TESTI_URL="https://testimonies.igrejadacidadeluanda.org"

ADMIN_KEY="$(get_env ADMIN_API_KEY)"
[ -z "$ADMIN_KEY" ] && ADMIN_KEY="$(ask_secret ADMIN_API_KEY "")"
APP_SECRET="$(get_env SECRET_KEY)"
[ -z "$APP_SECRET" ] && APP_SECRET="$(ask_secret SECRET_KEY "")"

set_env() { printf '%s' "$2" | vercel env add "$1" production --force >/dev/null 2>&1 || true; }
set_env NEXT_PUBLIC_API_URL "$API_URL"
set_env NEXT_PUBLIC_SITE_URL "$SITE_URL"
set_env NEXT_PUBLIC_TESTIMONIES_URL "$TESTI_URL"
set_env ADMIN_API_KEY "$ADMIN_KEY"
set_env SECRET_KEY "$APP_SECRET"

echo "== Deploy prod =="
vercel --prod

echo "== Domínios (adiciona após DNS pronto) =="
vercel domains add igrejadacidadeluanda.org 2>/dev/null || true
vercel domains add www.igrejadacidadeluanda.org 2>/dev/null || true
vercel domains add testimonies.igrejadacidadeluanda.org 2>/dev/null || true

echo OK — verifica em https://vercel.com/dashboard
