#!/bin/bash
# Arranca RCCG em dev: backend :8000 (8002 = fallback se 8000 ocupada) + frontend :3000.
# Uso: bash run-site.sh [BACKEND_PORT]
PORT="${1:-8000}"
cd /home/alexandre/RCCG/backend || exit 1
nohup .venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port "$PORT" > /tmp/rccg-backend.log 2>&1 &
echo $! > /tmp/rccg-backend.pid
cd /home/alexandre/RCCG/frontend || exit 1
nohup env NEXT_PUBLIC_API_URL=http://localhost:"$PORT" NEXT_PUBLIC_SITE_URL=http://localhost:3000 NEXT_PUBLIC_TESTIMONIES_URL=http://testimonies.localhost:3000 npm run dev -- --port 3000 > /tmp/rccg-frontend.log 2>&1 &
echo $! > /tmp/rccg-frontend.pid
sleep 2
echo STARTED
cat /tmp/rccg-backend.pid
cat /tmp/rccg-frontend.pid
