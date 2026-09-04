# Estado do projeto — 4 de setembro de 2026

## Etapa atual: landing page editorial de testemunhos

Pedido: transformar a página de testemunhos numa landing page visualmente mais cuidada, preservando campos, conteúdo e funcionamento.

- Hero próprio em azul-marinho com fotografia AI, título em branco/dourado, texto original e CTA para o formulário; sem a legenda AI removida pelo utilizador.
- Faixa de informação sobre testemunhos e consentimento; composição em duas colunas no desktop, guia lateral com âncoras e imagem AI secundária.
- Formulário num cartão branco com campos suaves, cantos arredondados e três divisões: About you, Your story, Your permission. São divisões visuais, não um assistente que esconda campos.
- Versão mobile em coluna única, guia compacto, imagem secundária ocultada e tamanhos adaptáveis. Cabeçalho branco e rodapé refinados.
- Nenhuma mudança no contrato da API, nas regras de consentimento ou no bloqueio de envio da pré-visualização.

Arquivos: `frontend/src/components/testimony/testimony.module.css`, `TestimonyForm.tsx`, páginas/layout de `testimonies` e `frontend/tests/approval-output.test.mjs`.

Validação: lint, 19 testes unitários, 6 testes da exportação, build estático e build normal aprovados. HTTP 200 na página local confirma novo hero, formulário e três secções; servidor 3008 reiniciado. Inspeção visual responsiva e Lighthouse não executados. O acesso local do browser anteriormente bloqueado não foi contornado.

Entrega local pronta em `http://localhost:3008/testimonies/`. Commit enviado ao repositório Sites: `10973e80683813445fcdbdc4a40119d7c0862aef`. Pacote estático: `work/testimony-landing.tar.gz` na pasta Windows desta tarefa. Duas tentativas de guardar a versão falharam no upload por timeout (60 segundos cada, em dois destinos de armazenamento do serviço); não foi guardada uma nova versão nem publicado um novo deployment. Foi pedida confirmação para publicar no mesmo link público; ainda sem resposta nesta etapa. Reutilizar commit e pacote validados ao retomar; não criar outro site.

Scorecard provisório por código: UX 89, UI 89, acessibilidade 86, consistência 92, conversão 75, escalabilidade 85; performance não medida. Não é certificação visual. Para UX/UI/acessibilidade, falta validar renderização e teclado em mobile/desktop; conversão continua limitada pelo envio público desativado; escalabilidade depende da infraestrutura de receção.

Estado: redesign implementado e testado, publicação deste visual pendente. A versão pública anterior continua disponível. Próximo passo imediato: confirmar publicação pública, guardar a versão e publicar; depois recolher aprovação visual. O produto completo ainda depende de backend de produção.

AVISO: O proximo passo e implementar a publicação e os ajustes da aprovação visual desta landing page. Antes de iniciar, leia `PROJECT_STATUS.md` para continuar exatamente de onde o projeto parou, entender o que ja foi feito e integrar a solucao com o sistema atual sem reler todo o repositorio.

## Etapa atual: página completa de testemunhos e remoção das legendas

Implementado no frontend, com os textos em inglês fornecidos pelo utilizador:

- Legenda visível “Imagem ilustrativa · IA” removida da Home desktop/mobile e de todos os heroes. As imagens continuam a ser AI; os textos alternativos descritivos foram preservados.
- Página `/testimonies` com introdução, nove campos/grupos, oito categorias, fotografia/vídeo opcional, escolhas Yes/No de contacto e consentimento explícito para publicação ou uso interno. Consentimento usa botões de opção mutuamente exclusivos, sem seleção automática.
- Campos opcionais vazios omitidos do pedido; validação de história, consentimento e ficheiros alinhada com o servidor. Upload por teclado, remoção de anexo, estados de envio/erro, prevenção de duplo envio e foco no resultado.
- Integração de envio agora usa `/api/testimonies` na mesma origem, aproveitando a reescrita existente do Next. Só mostra agradecimento após HTTP 201 com identificador numérico de recibo; sem falso sucesso em erros de rede/validação.
- Agradecimento apresentado no próprio formulário após sucesso. A página `/testimonies/obrigado` permite rever o texto; no modo de aprovação identifica expressamente que é uma demonstração sem envio.
- Na pré-visualização pública, formulário inteiro visível e explorável, mas botão de envio desativado e proteção adicional no código de submissão. Não foram publicados backend, base de dados nem anexos reais.

Arquivos principais: `frontend/src/components/testimony/TestimonyForm.tsx`, `TestimonySuccess.tsx`, `frontend/src/lib/testimony-submission.ts`, páginas da área `testimonies` e `frontend/tests/testimony-submission.test.mjs`.

Verificação: lint e builds normal/estático aprovados; 19 testes unitários do frontend, 5 da exportação e 2 testes existentes da API aprovados. API testada com base de teste, sem alteração ao backend. Existem avisos de descontinuação de Pydantic/Starlette e deteção de módulo do Node, sem falhas. Revisão visual, interação num browser e Lighthouse ainda não executados.

Estado da trilha: interface implementada e testes técnicos concluídos; receção pública real permanece pendente de alojamento seguro do backend e armazenamento privado. Não declarar produção completa nem 100/100.

### Publicação desta etapa

- Commit: `519f9aee570992662f72428a20fd1eff359990fd`.
- Versão Sites 2: `appgprj_6a9a0bdb8a4c8191869aeda484dd6c46~appgver_b9340636a58481918c132cfba176dd83`.
- Deployment `appgdep_6a9a981f0ab88191b3ae29049a6866c5` concluído com `succeeded` em 4 de setembro de 2026, 10:06:51 UTC.
- Página publicada: `https://igreja-cidade-luanda-aprovacao.holyconexao.chatgpt.site/testimonies/`.
- HTTP 200 confirmado na Home, formulário e agradecimento, no Ubuntu e no site público; legenda removida em ambos e aviso de envio desativado presente apenas na pré-visualização. Servidor local 3008 reiniciado em segundo plano, logs `work/testimony-3008.*.log` na pasta Windows desta tarefa.
- Reutilizado o mesmo site público de aprovação, sem alteração de audiência nem criação de outra tarefa.

Próximo passo: aprovar visualmente o formulário; para receber testemunhos reais online, confirmar destino/infraestrutura de produção do backend existente antes de ativar o envio. Não expor o Ubuntu ou a administração através de um túnel público como atalho.

Scorecard provisório por inspeção de código (não é medição nem certificação): UX 88, UI 88, acessibilidade 86, consistência 92, conversão 75, escalabilidade 85; performance não medida. UX/UI precisam de validação responsiva real; acessibilidade precisa de teste por teclado/leitor de ecrã; conversão está limitada intencionalmente pelo envio público desativado; escalabilidade depende do alojamento/armazenamento e dos controlos de upload do backend. Classificação: requer refinamento e ativação de infraestrutura, não produção completa.

AVISO: O proximo passo e implementar a ligação segura do formulário público ao serviço de receção de testemunhos. Antes de iniciar, leia `PROJECT_STATUS.md` para continuar exatamente de onde o projeto parou, entender o que ja foi feito e integrar a solucao com o sistema atual sem reler todo o repositorio.

## Etapa atual: Home, heroes AI e link de aprovação

- `Home` adicionado ao menu desktop, menu móvel e barra inferior, com indicação acessível da página atual.
- `PageHero` agora usa uma imagem AI em todas as páginas internas, com camada azul-escura, título sem serifa, entrelinha adaptada e identificação “Imagem ilustrativa · IA”. As páginas Assistir e Grupos usam imagens temáticas; Testemunhos passou a usar o mesmo componente.
- Mantidas as imagens AI existentes da Home. Não foram utilizadas fotografias reais nem geradas imagens adicionais nesta etapa.
- Criado modo `NEXT_PUBLIC_APPROVAL_PREVIEW=true`: exportação estática, banner de aprovação, pedido de não indexação e formulário de testemunhos desativado. API, segredos, anexos e backend não fazem parte do pacote publicado.
- O modo normal do Ubuntu mantém o formulário e a integração existentes. Servidor 3008 reiniciado; HTTP 200 confirmado em Home, Doar, Assistir e Testemunhos, com formulário presente apenas no modo normal.
- Verificação: lint aprovado; build normal e build de pré-visualização aprovados; 4 testes de movimento e 4 testes da exportação aprovados. Estes últimos cobrem os heroes de 17 páginas internas, Home nas três navegações, ausência do formulário/API na cópia pública e inclusão dos quatro ativos AI usados nos heroes.
- Revisão visual e Lighthouse continuam não executados; não atribuir 100/100 nem interpretar testes de HTML como validação visual.

### Publicação da pré-visualização

Usar Sites e reutilizar `frontend/.openai/hosting.json`; não criar outro site. O utilizador autorizou explicitamente um link público para aprovação. Acesso configurado como público. Não foi definida expiração automática; o acesso pode ser retirado após a aprovação.

- Projeto: `appgprj_6a9a0bdb8a4c8191869aeda484dd6c46`.
- Versão: `appgprj_6a9a0bdb8a4c8191869aeda484dd6c46~appgver_8d15a85683cc819195be3202e96f784a`.
- Deployment: `appgdep_6a9a0cfb00548191ba16820223adf445`, concluído com estado `succeeded` em 4 de setembro de 2026, 00:16:54 UTC.
- Link público de aprovação: `https://igreja-cidade-luanda-aprovacao.holyconexao.chatgpt.site`.
- HTTP 200 anónimo confirmado na Home, Doar, Assistir, Testemunhos e imagem AI de comunidade; banner de aprovação presente e formulário ausente. Abertura do link solicitada no painel da aplicação. Não foi realizada inspeção visual automatizada.
- Repositório Git inicializado apenas em `frontend`, conforme fluxo de publicação; commit enviado: `227d61a404489977b20723eac1b4a353cda3cd7c`. `.env*`, dependências e builds excluídos. Credenciais de publicação não foram guardadas no projeto.

Para atualizar a pré-visualização: executar `NEXT_PUBLIC_APPROVAL_PREVIEW=true npm run build`, depois `node --test tests/approval-output.test.mjs`, publicar exclusivamente `out/` pelo empacotador Sites e guardar uma versão com o commit correspondente. O empacotador instalado tem CRLF; nesta sessão usou-se uma cópia com fins de linha normalizados em `work/sites-packager` na pasta Windows desta tarefa. Não alterar o plugin instalado.

Depois de exportar, executar `npm run build` sem a variável de aprovação e reiniciar o servidor local para restaurar o modo normal. Os dois builds usam `.next`; não executar simultaneamente. `.next-preview/` é um artefacto ignorado de uma tentativa anterior, não a saída atual de publicação.

Próximo passo desta trilha: recolher aprovação visual no link e confirmar conteúdos/contactos reais antes da publicação definitiva. O backend e os dados oficiais continuam pendentes para produção.

## Última etapa: ajustes responsivos e acessibilidade por inspeção de código

**Âmbito da verificação:** revisão estrutural; não foi possível ver a página no navegador, pois o acesso guardado a `http://172.31.78.219:3008/` continua bloqueado. Não contornar essa preferência por outra ferramenta ou endereço.

Foi feito:

- Hero e cartão de comunidade mobile agora têm texto no fluxo normal, permitindo crescer com ampliação de texto sem depender de altura fixa e posicionamento absoluto.
- Título do hero mobile adapta-se à largura; entrelinha ampliada para reduzir colisões entre linhas.
- Máscara da faixa-manifesto mobile isolada no elemento decorativo, deixando de mascarar o texto e o fundo inteiro.
- Menu mobile com altura limitada ao espaço disponível, rolagem própria e reserva para a navegação inferior.
- Menu Sobre tratado como divulgação de links, sem papéis ARIA de menu que exigiriam navegação por setas; Escape restitui foco e saída por Tab fecha o painel.
- Foco com contorno duplo claro/escuro e margem de rolagem para o cabeçalho fixo.
- Preferência de movimento reduzido lida com `useSyncExternalStore`, snapshot estável no servidor e desmontagem do listener.

Arquivos adicionais: `frontend/src/lib/motion-preference.ts`, `frontend/tests/motion-preference.test.mjs`, `frontend/package.json`.

Verificação: `npm run test:ui` (4/4 testes), `npm run lint` e `npm run build` aprovados. O teste em Node 22 emite apenas um aviso de deteção automática de módulo TypeScript, sem falhas. Os testes cobrem snapshot SSR, preferência cliente, notificação/limpeza e estabilidade do HTML SSR; não substituem testes reais de hidratação ou navegação.

Servidor iniciado em segundo plano, sem janela visível, pela aplicação Windows/WSL. HTTP 200 confirmado em `/`, `/sou-novo`, `/doar`, `/eventos` e `/assistir`; HTML servido inclui menu rolável, hero em fluxo e imagens AI. Logs em `work/redesign-3008.out.log` e `work/redesign-3008.err.log` na pasta desta tarefa.

Estado: implementação desta etapa concluída e servida; acabamento visual ainda não certificado. Próximo passo: desbloquear o acesso ao site no navegador ou fornecer capturas a 320/390 px, 768 px e 1440 px; depois validar layout, foco, ampliação de texto e Lighthouse.

## Ativação e verificação final — 4 de setembro

- Servidor de produção da porta 3008 reiniciado a partir de `/home/alexandre/RCCG/frontend` para carregar o novo build. O processo anterior mantinha HTML da versão antiga em memória.
- HTML servido confirmado com novo manifesto, ativos AI e botão de pausa do carrossel, sem referências às antigas fotografias.
- Carrossel com pausa explícita, controlos de 44 px e anúncios automáticos limitados para leitores de ecrã; contador móvel substitui indicadores pequenos.
- Lint aprovado sem avisos; build e TypeScript aprovados novamente.
- HTTP 200 confirmado em `/`, `/sou-novo`, `/eventos`, `/grupos`, `/assistir`, `/doar`, `/ministerios/criancas`, `/testimonies` e nos três novos ativos AI.
- Endereço ativo: `http://172.31.78.219:3008/`.
- Sem alterações ao backend. Revisão visual responsiva e Lighthouse continuam pendentes; não há certificação de 100/100.

## Última etapa concluída: redesign fiel à referência

Objetivo: aproximar a homepage da linguagem editorial de `newchdallas.com`, sem copiar a marca, mantendo “Igreja da Cidade Luanda”, azul/branco e uma experiência mobile semelhante a uma aplicação.

Foi feito:

- Hero reconstruído com fotografia, faixa-manifesto “Crer. Pertencer. Transformar.”, grafismos diagonais e carrossel acessível reduzido a três mensagens.
- Homepage desktop reorganizada em blocos de celebrações, “O que esperar”, próximos encontros, famílias, mensagem e atalhos.
- Homepage mobile preservada como experiência própria, com hero vertical, ações rápidas, horários prioritários e navegação inferior fixa.
- Cabeçalho e CTAs tornados mais compactos e geométricos, próximos do ritmo da referência.
- Fotografias reais removidas da experiência publicada; os caminhos antigos foram substituídos por imagens sintéticas para evitar exposição acidental.
- Três novos ativos WebP gerados por IA integrados, com 52 KB, 51 KB e 120 KB.
- Textos alternativos e etiquetas visíveis identificam as imagens como ilustrativas e geradas por IA.

Arquivos principais:

- `frontend/src/app/(main)/page.tsx`
- `frontend/src/components/home/HeroSlideshow.tsx`
- `frontend/src/components/home/MobileHome.tsx`
- `frontend/src/components/layout/Header.tsx`
- `frontend/src/components/layout/Footer.tsx`
- `frontend/src/app/globals.css`

Verificação executada:

```bash
cd frontend
npm run lint
npx tsc --noEmit
npm run build
```

Resultado: lint sem avisos, TypeScript aprovado, build aprovado com 17 rotas e homepage ativa em `http://172.31.78.219:3008/` com HTTP 200.

Estado atual:

- O redesign está implementado e compilado.
- A inspeção visual automatizada no navegador continua indisponível devido à preferência de acesso guardada para o endereço local; falta a aprovação visual humana em desktop e mobile.

Estado do projeto:

- Fase/trilha atual: acabamento visual e validação final.
- Sólido agora: arquitetura frontend, responsividade estrutural, política AI-only, lint, tipos e build.
- Falta imediato: revisão visual em 390×844, 768×1024 e 1440×900; Lighthouse no ambiente final; confirmação dos dados oficiais.
- Distância do fim: esta trilha está quase concluída; o produto completo ainda depende de conteúdo e infraestrutura de produção.

## Próximo passo recomendado

Fazer a revisão visual final no navegador, corrigir qualquer detalhe responsivo observado e executar Lighthouse após publicação em HTTPS.

AVISO: O proximo passo e implementar os últimos ajustes visuais encontrados na revisão responsiva. Antes de iniciar, leia `PROJECT_STATUS.md` para continuar exatamente de onde o projeto parou, entender o que ja foi feito e integrar a solucao com o sistema atual sem reler todo o repositorio.

## Entregue

- Site institucional com páginas de boas-vindas, ministérios, eventos, grupos, transmissão, contribuição e contacto.
- Páginas institucionais para privacidade, termos, oração, batismo, aconselhamento e páginas da secção Sobre.
- Formulário de testemunhos com validação, limites básicos de abuso e consentimento explícito.
- Moderação da API protegida por `X-Admin-Key`.
- Anexos de testemunhos deixam de ser servidos publicamente antes da aprovação e do consentimento de publicação.
- Configuração Docker sem palavras-passe embutidas; valores obrigatórios em `.env`.
- Testes de regressão da API em `backend/tests/test_testimonies.py`.
- Frontend integralmente redesenhado com direção editorial inspirada no site de referência, sem copiar a identidade visual.
- Novo sistema visual responsivo em azul-marinho, azul principal, dourado e branco, aplicado ao cabeçalho, rodapé, homepage e páginas internas.
- Duas imagens originais geradas para o hero e a secção de comunidade; versões WebP de 80 KB e 94 KB substituem cerca de 4 MB de PNG na experiência publicada.
- Nova rota `/ministerios/criancas` e navegação móvel nativa, acessível por teclado e independente de JavaScript para abrir/fechar.
- Fluxo de testemunhos reestilizado e integrado no mesmo sistema visual.
- Verificação TypeScript reativada na compilação de produção.

## Verificação concluída

- `npm run lint`: aprovado sem erros.
- `npx tsc --noEmit`: aprovado sem erros.
- `npm run build`: aprovado, com 15 páginas geradas.
- Rotas públicas principais: todas responderam com HTTP 200.
- Browser: homepage e página de ministérios verificadas em desktop e 390 px, sem overflow horizontal; menu móvel confirmado.
- Origem de desenvolvimento do endereço Ubuntu autorizada de forma explícita, eliminando o bloqueio dos ficheiros interativos ao abrir pelo IP `172.31.78.219`.
- Logótipo oficial integrado no cabeçalho, rodapé, área de testemunhos e ícone do site; comunicação pública normalizada para “Igreja da Cidade Luanda”.

## Verificação pendente

- Executar a suíte `pytest -q` do backend após alterações futuras na API.
- Fazer um envio completo de testemunho com dados de teste antes da publicação definitiva.
- Executar Lighthouse no ambiente de produção final, já com domínio, HTTPS e CDN ativos.

## Dependências externas

- Dados oficiais da igreja: contacto, localização, mapa e canais sociais.
- Credenciais de e-mail, armazenamento de ficheiros e eventual provedor de pagamentos.
- Domínio, DNS, HTTPS e cópia de `.env.example` para `.env` com segredos próprios.
