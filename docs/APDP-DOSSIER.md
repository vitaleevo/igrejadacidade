# Dossier APDP — Igreja da Cidade Luanda (site + testemunhos)

Documento de trabalho para a notificação do tratamento à **Agência de Proteção de Dados (APDP)**,
nos termos da Lei n.º 22/11, de 17 de junho. Rever com advogado antes de submeter.
NÃO contém segredos — apenas descrição do tratamento.

## 1. Responsável pelo tratamento

- **Entidade:** Igreja da Cidade Luanda, Luanda, Angola
- **Contacto privacidade / encarregado:** contacto@igrejadacidadeluanda.org *(designar pessoa responsável)*
- **Finalidade do site:** informar sobre a igreja; receber e (com consentimento) publicar testemunhos.

## 2. Inventário de dados (o que, onde, porquê)

| Dado | Origem | Finalidade | Base legal (22/11) |
|---|---|---|---|
| Nome completo | Form testemunhos (obrigatório) | Identificar/autenticar o testemunho; moderação | Consentimento |
| Telefone / email (opcionais) | Form testemunhos | Contacto para detalhes | Consentimento |
| História, data, categoria | Form testemunhos | Conteúdo do testemunho | Consentimento |
| Anexo foto/vídeo (opcional) | Form testemunhos | Ilustrar testemunho publicado | Consentimento + autorização de ficheiros |
| Confirmação idade 18+ / encarregado | Form testemunhos (obrigatório) | Proteger menores | Obrigação legal |
| Consentimento publish/internal | Form testemunhos | Base da publicação | Consentimento explícito |
| Sessão admin (cookie httpOnly) | Login /admin | Gestão e moderação | Interesse legítimo (segurança) |
| Logs de auditoria (ação, IP, timestamp) | Moderação | Prova e segurança | Interesse legítimo |

**Onde fica:** base de dados + ficheiros na Convex (nuvem, fora de Angola);
site na Vercel (só运行时, sem dados pessoais persistentes); email transacional via SMTP próprio.

## 3. Medidas implementadas (prova técnica)

- Consentimento granular sem pré-seleção, validado no servidor (código: `convex/testimonies.ts`).
- Duplo gate de publicação: só `aprovado + publish` aparece (queries `listPublic`/`getPublic`).
- Minimização: opcionais omitidos; anexos privados até aprovação.
- Segurança: chave admin só no servidor, cookie httpOnly + SameSite, validação de tipos/tamanhos/magic-bytes de anexos, anti-robô Turnstile (quando configurado), TLS em todo o lado.
- Auditoria append-only de cada moderação (quem/o quê/quando).
- Retenção automática: rejeitados eliminados (registo + anexos) 180 dias após decisão (`convex/crons.ts`, mensal).
- Políticas públicas: `/privacidade`, `/termos`, `/cookies`, `/sitemap`; `/admin` com `noindex`.

## 4. Transferências internacionais

Base de dados e ficheiros na Convex (fora de Angola). Base legal: **consentimento** recolhido no formulário + informação na Política de Privacidade. Se a APDP exigir localização em Angola/UE, a Convex permite migrar de região (novo deployment + export/import).

## 5. Direitos dos titulares (procedimento)

Pedidos para o email de privacidade, responder em ≤ 15 dias úteis:
1. Confirmar identidade (responder pelo mesmo email/telefone fornecido).
2. Acesso: exportar registo + anexos do Convex (dashboard → dados).
3. Correção: editar via `/admin` (requer novo estado + auditoria).
4. Eliminação: apagar registo + ficheiro no Convex; confirmar por email.
5. Oposição/retirada: equivale a rejeitar + eliminar.

## 6. Violações de dados (plano)

1. Conter (rodar chaves: Vercel env, Convex, SMTP).
2. Avaliar risco para titulares em 24h.
3. Notificar a APDP e, em risco elevado, os titulares afetados.
4. Registar incidente + lições (manter neste dossier).

## 7. A designar pela igreja

- [ ] Nome do encarregado da proteção de dados + publicar contacto.
- [ ] Submeter notificação à APDP (juntar este dossier + prints das políticas).
- [ ] Periodicidade de revisão deste dossier (sugerido: anual).
- [ ] Criar chaves Turnstile (Cloudflare, grátis) e definir `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` na Vercel.
- [ ] Rodar SMTP da caixa `testimonies@` (password esteve exposta) e definir `SMTP_*` na Vercel.
