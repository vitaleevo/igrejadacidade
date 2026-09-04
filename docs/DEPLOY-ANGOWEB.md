# Deploy — igrejadacidadeluanda.org (Angoweb + Vercel + GitHub)

> ⚠️ SEGURANÇA: os tokens/chaves/PDFs que partilhaste no chat (cPanel API, SSH privada,
> password de email, Convex deploy key/PAT) estão EXPOSTOS. Roda-os TODOS no cPanel/Convex
> antes do go-live e nunca os commites. Este repo só guarda placeholders.

## Arquitetura decidida (testemunhos → /admin)

- Form público `/testimonies` (e `testimonies.igrejadacidadeluanda.org`) → `POST /api/testimonies`
  → `status=pending` + email best-effort para `testimonies@...` → gerido em `/admin`.
- `/admin/login` pede a chave, valida server-side (`ADMIN_API_KEY` em env, `timingSafeEqual`,
  cookie `httpOnly + SameSite=Lax + 8h`). O browser NUNCA vê a chave. Proxy
  `/api/admin/*` encaminha para o backend com `X-Admin-Key` só no servidor.
- cPanel `ws101` (partilhado) fica SÓ com DNS + email. Docker/Next standalone NÃO corre
  em cPanel partilhado. Deploy:
  - Frontend → Vercel (repo `vitaleevo/igrejadacidade`), domínios `igrejadacidadeluanda.org` +
    `testimonies.igrejadacidadeluanda.org` + `www`.
  - Backend + Postgres → VPS com Docker (IP `65.21.108.120` se for VPS com root) via
    `docker-compose.prod.yml`, ou Railway/Render se o `ws101` não der root.

## 1. GitHub (sem colar tokens no chat)

```bash
cd /home/alexandre/RCCG
git remote add origin https://github.com/vitaleevo/igrejadacidade.git  # HTTPS + gh auth
gh auth login
git add -A && git commit -m "feat: admin + prod hardening" && git push -u origin main
```

Nunca `git push` com token na URL. Usa `gh` ou SSH agent (`ssh-add ~/.ssh/igrejadacidade`).

## 2. DNS (cPanel → Zone Editor de igrejadacidadeluanda.org)

 Nameservers actuais: ns1/ns2/ns3.angoweb.net — manter.

| Tipo | Nome | Valor | TTL |
|---|---|---|---|
| A | @ | `76.76.21.21` (Vercel) | 300 |
| CNAME | www | `cname.vercel-dns.com.` | 300 |
| CNAME | testimonies | `cname.vercel-dns.com.` | 300 |
| A | api | `65.21.108.120` (backend VPS) | 300 |
| MX | @ | `ws101.angoweb.net` prio 0 | 3600 |
| TXT | @ | `v=spf1 +a +mx +ip4:65.21.108.120 ~all` | 3600 |

Depois: Vercel → Add Domain `igrejadacidadeluanda.org` + `testimonies...` → vai pedir para manter os CNAME acima.
Backend: `NEXT_PUBLIC_API_URL=https://api.igrejadacidadeluanda.org`.

## 3. Email (cPanel → Email Accounts)

Conta `testimonies@igrejadacidadeluanda.org` já existe. No servidor backend, `.env` (0600):

```
SMTP_HOST=ws101.angoweb.net
SMTP_PORT=465
SMTP_USER=testimonies@igrejadacidadeluanda.org
SMTP_PASSWORD=<colar-no-servidor-via-ssh-ou-cpanel-terminal>
SMTP_FROM=testimonies@igrejadacidadeluanda.org
NOTIFY_EMAIL=testimonies@igrejadacidadeluanda.org
FRONTEND_ADMIN_URL=https://igrejadacidadeluanda.org/admin
```

Testar: submeter testemunho → ver email + linha `notify email sent` nos logs. Falha de email não bloqueia (log `warning`).

## 4. Vercel (frontend)

- Import `vitaleevo/igrejadacidade`, Root Directory `frontend`, Framework Next.js.
- Env (Production): `NEXT_PUBLIC_API_URL=https://api...`, `NEXT_PUBLIC_SITE_URL=https://igrejadacidadeluanda.org`,
  `NEXT_PUBLIC_TESTIMONIES_URL=https://testimonies...`, `ADMIN_API_KEY=<40 chars>`, `SECRET_KEY=<64 chars>`.
- Domains: adicionar os 3, verificar DNS, esperar TLS.
- `vercel.json` já mete `X-Robots-Tag: noindex` em `/admin/*`.

## 5. Backend (VPS 65.21.108.120 — SÓ com SSH agent, sem colar chave privada no repo)

```bash
ssh -i ~/.ssh/igrejadacidade root@65.21.108.120  # ou utilizador sudo
git clone https://github.com/vitaleevo/igrejadacidade.git && cd igrejadacidade
cp .env.example .env && nano .env  # preencher APP_ENV=production + 3 segredos + SMTP + DATABASE_URL
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.prod.yml exec backend alembic upgrade head
curl -f https://api.igrejadacidadeluanda.org/api/health
```

Nginx `prod.conf` já faz `client_max_body_size 55m` + proxy. TLS: Cloudflare/LB na frente (recomendado) ou certbot no VPS.

## 6. Convex

Projecto `igrejadacidade` (`canny-oyster-379`) fica em standby. Postgres continua canónico
(testemunhos + audit). Se quiseres realtime no admin mais tarde, espelhamos `approved` para o
Convex via webhook — não migramos agora para não partir a moderação. Roda o Deploy Key + PAT
que expuseste (Dashboard → Settings → Regenerate).

## 7. Go-live

- [ ] Rodar TODOS os segredos expostos (cPanel API, SSH, email, Convex, ADMIN_API_KEY)
- [ ] `curl /api/health` → `ok/up`; `/api/docs` → 404; headers HSTS+CSP presentes
- [ ] Submissão real → 201 + email + visível em `/admin` como pending → Aprovar → público
- [ ] `/admin` com `noindex`, logout limpa cookie, PATCH sem cookie → 401
- [ ] `sitemap.xml/robots.txt`, Lighthouse HTTPS, 390/768/1440
