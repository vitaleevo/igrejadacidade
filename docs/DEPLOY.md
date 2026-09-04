# Deploy Produção — Igreja da Cidade Luanda

## 1. Pré-requisitos (no servidor, nunca no repo)

```bash
cp .env.example .env
# Gerar segredos:
python3 -c "import secrets; print(secrets.token_urlsafe(48))"  # SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(32))"  # ADMIN_API_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(32))"  # POSTGRES_PASSWORD
```

`.env` mínimo prod:
```
APP_ENV=production
POSTGRES_PASSWORD=<forte>
SECRET_KEY=<64 chars>
ADMIN_API_KEY=<40 chars>
DATABASE_URL=postgresql://rccg:<pass>@db:5432/rccg
NEXT_PUBLIC_API_URL=https://igrejadacidadeluanda.org
NEXT_PUBLIC_SITE_URL=https://igrejadacidadeluanda.org
NEXT_PUBLIC_TESTIMONIES_URL=https://testimonies.igrejadacidadeluanda.org
```

## 2. Subir

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend alembic upgrade head
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
curl -f https://igrejadacidadeluanda.org/api/health
```

Backend arranca com `alembic upgrade head` automático + `validate_production()` fail-fast.
Se `SECRET_KEY` fraco, SQLite em prod, ou DB inalcançável → container falha com log explícito.

## 3. Nginx + TLS

- `nginx/prod.conf` já limita `client_max_body_size 55m`, proxy `/api/` → backend, resto → frontend, preserva `X-Forwarded-*`.
- Terminar TLS no Cloudflare/LB (recomendado) ou montar certs e descomentar `:443` no `docker-compose.prod.yml`.
- DNS: `A @` → servidor, `A testimonies` → servidor (Cloudflare proxy ON para Turnstile + DDoS).

## 4. Storage / Email / Anti-robô (P1 antes de abrir form público)

- **Storage:** `STORAGE_BACKEND=local` serve só 1 réplica. Para ≥2 réplicas ou persistência real: `STORAGE_BACKEND=s3` + `S3_BUCKET` + `S3_ENDPOINT_URL` (R2) e trocar `utils/storage.py` para boto3 com upload privado + URL assinada 15min. `media_sha256` já permite dedup.
- **Rate limit distribuído:** in-process atual + Nginx `limit_req` + (futuro) Redis `INCR/EXPIRE` quando `REDIS_URL` configurado.
- **Turnstile:** criar sitekey/secret em Cloudflare, definir `TURNSTILE_SECRET_KEY` no backend e `NEXT_PUBLIC_TURNSTILE_SITE_KEY` no frontend. Sem secret = no-op dev; com secret = exige `cf-turnstile-response`.
- **Email transacional:** Resend/SES para confirmação + moderação (ainda não implementado — form só cria `pending`).
- **Backups:** `pg_dump` diário criptografado + retenção 30d + teste restore mensal.

## 5. Operação

```bash
# Moderar (nunca expor ADMIN_API_KEY no frontend):
curl -H "X-Admin-Key: $ADMIN_API_KEY" https://igrejadacidadeluanda.org/api/testimonies/admin?status=pending
curl -X PATCH -H "X-Admin-Key: $ADMIN_API_KEY" -H "Content-Type: application/json" \
  -d '{"status":"approved"}' https://igrejadacidadeluanda.org/api/testimonies/123

# Auditoria:
docker compose exec db psql -U rccg -d rccg -c "SELECT * FROM audit_logs ORDER BY id DESC LIMIT 20;"

# Logs:
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f backend frontend nginx
```

## 6. Checklist go-live

- [ ] `.env` prod com 3 segredos fortes, sem defaults
- [ ] `alembic upgrade head` OK, `/api/health` → `{"status":"ok","db":"up"}`
- [ ] `/api/docs` → 404 em prod, headers `HSTS + CSP + X-Frame DENY` presentes
- [ ] Upload `.exe→.jpg` → 400, PNG real → 201, `pending` invisível público até `approved+publish`
- [ ] `sitemap.xml` + `robots.txt` acessíveis, `noindex` OFF em prod
- [ ] Lighthouse HTTPS + teste teclado + 390/768/1440
- [ ] Dados oficiais (morada, telefone, mapa, sociais) substituídos
- [ ] S3/R2 + Turnstile + email configurados antes de divulgar form
