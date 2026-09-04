#!/usr/bin/env bash
# Build de pré-visualização (pacote estático para aprovação, sem API nem /admin).
# As rotas dinâmicas (src/app/api, src/app/(admin)) são temporariamente
# retiradas durante o export e repostas no fim — sempre, mesmo em falha.
set -euo pipefail
cd /home/alexandre/RCCG/frontend

STASH_DIR="$(mktemp -d)"
restore() {
  [ -d "$STASH_DIR/api" ] && mv "$STASH_DIR/api" src/app/api
  [ -d "$STASH_DIR/(admin)" ] && mv "$STASH_DIR/(admin)" "src/app/(admin)"
  rmdir "$STASH_DIR" 2>/dev/null || true
}
trap restore EXIT

mv src/app/api "$STASH_DIR/api"
mv "src/app/(admin)" "$STASH_DIR/(admin)"

NEXT_PUBLIC_APPROVAL_PREVIEW=true npm run build
node --test tests/approval-output.test.mjs
