# Igreja da Cidade Luanda

Site oficial da **Igreja da Cidade Luanda**.

Inspirado em [newchdallas.com](https://www.newchdallas.com/), com arquitetura moderna **FastAPI + Next.js** e suporte a **subdomínios**.

## Domínios

| Site | URL |
|------|-----|
| **Principal** | `https://igrejadacidadeluanda.org` |
| **Testemunhos** | `https://testimonies.igrejadacidadeluanda.org` |

Em desenvolvimento local:
- Principal: `http://localhost:3000`
- Testemunhos: `http://testimonies.localhost:3000`  *(adicione ao `/etc/hosts`: `127.0.0.1 testimonies.localhost`)*

---

## Stack

- **Backend:** Python 3.11, FastAPI, SQLAlchemy, Pydantic, SQLite (dev) / Postgres (prod), Uvicorn
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Lucide Icons
- **Infra:** Docker Compose, Nginx (subdomínios em prod), Vercel/Railway ready

---

## Estrutura

```
project-root/
├── backend/               # FastAPI
│   ├── app/
│   │   ├── core/config.py
│   │   ├── models/testimony.py
│   │   ├── schemas/testimony.py
│   │   ├── routers/testimonies.py
│   │   ├── utils/storage.py
│   │   ├── database.py
│   │   └── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/              # Next.js
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                # Root layout (fontes + globals)
│   │   │   ├── (main)/                   # Site principal
│   │   │   │   ├── layout.tsx (Header/Footer)
│   │   │   │   ├── page.tsx (Home - Believe Belong Become)
│   │   │   │   ├── sou-novo/
│   │   │   │   ├── sobre/
│   │   │   │   ├── ministerios/
│   │   │   │   └── ...
│   │   │   └── (testimonies)/testimonies/
│   │   │       ├── page.tsx (Formulário)
│   │   │       └── obrigado/page.tsx
│   │   ├── components/
│   │   │   ├── layout/Header, Footer
│   │   │   ├── testimony/TestimonyForm
│   │   │   └── ui/Button, Input, ...
│   │   ├── lib/config.ts
│   │   └── lib/api.ts
│   ├── middleware.ts      # Roteamento por subdomínio
│   └── next.config.ts
└── docker-compose.yml
```

---

## Formulário de Testemunho

Campos implementados (conforme brief):

1. Nome Completo *
2. Telefone / WhatsApp (opcional)
3. Email (opcional)
4. Qual é o seu testemunho? *
5. Quando aconteceu?
6. Categoria (Healing, Answered Prayer, Employment/Finances, Family/Marriage, Deliverance, Conversion/Salvation, Miracle, Other)
7. Upload foto/vídeo (opcional, 50MB)
8. Podemos contactar?
9. Consentimento de publicação (publish / internal)

Backend valida, guarda o ficheiro de forma privada e cria registo com `status=pending` para moderação. Ficheiros só ficam acessíveis por uma rota pública depois de o testemunho ser aprovado e ter consentimento de publicação.

### Moderação

As rotas de moderação exigem o header `X-Admin-Key`, com o valor definido em `ADMIN_API_KEY`. Nunca exponha essa chave no frontend. Enquanto a chave não estiver configurada, a moderação fica desativada por segurança.

---

## Como rodar

### Backend (FastAPI)

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Docs: http://localhost:8000/api/docs
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
# http://testimonies.localhost:3000  (configure hosts)
```

### Docker (tudo)

```bash
docker compose up --build
```

Antes de iniciar com Docker, copie `.env.example` para `.env` e substitua todos os valores por chaves fortes.

---

## Subdomínio em produção

**Opção Vercel:** adicionar dois domínios ao mesmo projeto e usar `middleware.ts` que já detecta `host` e reescreve `/` → `/testimonies` para `testimonies.*`.

**Opção Nginx:**

```nginx
server {
  server_name igrejadacidadeluanda.org www.igrejadacidadeluanda.org;
  location / { proxy_pass http://frontend:3000; }
  location /api/ { proxy_pass http://backend:8000; }
}
server {
  server_name testimonies.igrejadacidadeluanda.org;
  location / { proxy_pass http://frontend:3000; proxy_set_header Host $host; }
}
```

**Opção DNS Cloudflare:** criar `A` para `@` e `testimonies`.

---

## Design System

- **Cores:** azul-marinho `#071A3D`, azul principal `#0B3B82`, azul secundário `#1F5AA6`, dourado `#F5BD42` e branco `#FFFFFF`
- **Tipografia:** Inter (texto) e Sora (títulos), sempre sem serifa
- **Direção visual:** composição editorial inspirada na estrutura do site de referência, com manifesto, blocos de alto contraste e grafismos diagonais próprios
- **Fotografia:** apenas imagens ilustrativas geradas por IA; fotografias reais da igreja não devem ser publicadas
- **Spacing:** escala de 4px, com raios moderados no mobile e componentes mais retos no desktop
- **Acessibilidade:** WCAG AA, focus ring, keyboard nav, `prefers-reduced-motion`

---

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/testimonies` | Criar testemunho (multipart) |
| GET | `/api/testimonies` | Listar aprovados publicados |
| GET | `/api/testimonies/admin` | Listar todos (admin) |
| GET | `/api/testimonies/{id}` | Detalhe público |
| PATCH | `/api/testimonies/{id}` | Aprovar/rejeitar |

---

## Antes da publicação

- [ ] Substituir endereço, telefone, email, mapa e canais sociais pelos dados oficiais.
- [ ] Configurar `POSTGRES_PASSWORD`, `SECRET_KEY` e `ADMIN_API_KEY` no ambiente de produção.
- [ ] Confirmar os dados bancários e integrar um fornecedor de pagamento antes de ativar contribuições online.
- [ ] Configurar armazenamento privado S3/R2 e e-mails transacionais para produção.
- [ ] Criar uma conta de administração/SSO antes de disponibilizar um painel de moderação no browser.
```
