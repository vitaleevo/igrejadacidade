#!/bin/bash
cd /home/alexandre/RCCG/frontend || exit 1
setsid nohup env NODE_OPTIONS=--max-old-space-size=256 npm run start -- --port 3008 </dev/null >/tmp/rccg-3008.log 2>&1 &
disown
echo LAUNCHED
sleep 12
curl -s http://localhost:3008/ -o /tmp/s8.html
echo CURL_EXIT:$?
wc -c /tmp/s8.html
tail -n 4 /tmp/rccg-3008.log
