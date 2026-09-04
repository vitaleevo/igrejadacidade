#!/bin/bash
# Serve build de producao com heap limitado (caixa com pouca RAM + OOM killer ativo).
PORT="${1:-3006}"
cd /home/alexandre/RCCG/frontend || exit 1
nohup env NODE_OPTIONS=--max-old-space-size=256 npm run start -- --port "$PORT" > /tmp/rccg-prod.log 2>&1 &
echo $! > /tmp/rccg-prod.pid
sleep 10
echo STARTED_PROD_CAPPED
cat /tmp/rccg-prod.pid
tail -n 4 /tmp/rccg-prod.log
curl -s http://localhost:"$PORT"/ -o /tmp/w-home.html
echo HOME_EXIT:$?
echo HOME_BYTES:$(wc -c < /tmp/w-home.html)
for m in worship-hero.webp community-gathering.webp igreja-familias.webp igreja-mensagem.webp igreja-celebracao.webp Acredite carrossel; do printf "%s=" "$m"; grep -c "$m" /tmp/w-home.html || true; done
