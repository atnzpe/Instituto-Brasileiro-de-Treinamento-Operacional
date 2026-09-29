# CLAUDE.md — IBTO Landpage

Instruções para o Claude Code (e para qualquer pessoa) trabalhar neste repositório. O README explica o projeto; este arquivo diz **como trabalhar** nele.

## O projeto

Site institucional do IBTO (Instituto Brasileiro de Treinamento Operacional), reconstruído a partir do site antigo em Brizy, publicado em [ib-to.org](https://ib-to.org).

- **Pessoas:** Aline é PO, PM e QA (aceite e teste humano); Eduardo Lopes é o stakeholder principal (decisões de negócio); Gleyson Atanazio (`atnzpe`) lidera o projeto, é o dono do repositório no GitHub, o desenvolvedor e o Scrum Master, e está aprendendo — explique o porquê das coisas e prefira passos pequenos.
- **Idioma:** tudo em português do Brasil (commits, issues, PRs, documentação e textos do site).
- **Documentos-chave:** [README.md](./README.md), [ROADMAP.md](./ROADMAP.md) (fonte da ordem das próximas tarefas), [docs/guia-primeiras-tarefas.md](./docs/guia-primeiras-tarefas.md) e [QA_REPORT.html](./QA_REPORT.html).
- **Repositório e quadro:** [atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional) (transferido da conta da Aline em 28/09/2026) e o [GitHub Project](https://github.com/users/atnzpe/projects/5/views/1) com as issues em ordem.

## Fluxo de trabalho (obrigatório)

```text
Issue ➡️ Branch ➡️ Código/Commits ➡️ Testes automatizados ➡️ Push da branch
➡️ Documentar resultados na Issue ➡️ Teste humano (local e homologação) ➡️ se o teste humano der OK ➡️
PR pronta para revisão ➡️ Code Review ➡️ Merge ➡️ Deploy automático ➡️ Conferir produção ➡️
Clean Up ➡️ Próxima Issue/Branch seguindo o ROADMAP
```

- Toda mudança começa numa issue e numa branch nova a partir da `main` atualizada: `feature/…`, `fix/…` ou `docs/…`.
- **Nunca** fazer commit ou push direto na `main`. Branch nova sobe com `git push -u origin <branch>`.
- Commits em português, no formato `tipo(assunto): o que mudou e por quê` (`feat`, `fix`, `docs`, `chore`). Nada de "ajustes".
- "Testes automatizados" são `bun run lint`, `bun run test` (testes em `tests/`, com o executor do Bun) e `bun run build`; a CI em `.github/workflows/ci.yml` roda os três a cada push. O lint deve sair sem nenhum aviso (a regra `only-export-components` fica desligada só em `src/routes/`, porque o padrão do TanStack Router exporta `Route` e o componente juntos); qualquer aviso novo deve ser tratado. Lógica nova com regra de negócio (datas, status, cálculos) ganha teste. O deploy automático (`.github/workflows/deploy.yml`, FTPS) publica só a homologação; a produção ainda é manual.
- O teste humano é da Aline ou do Gleyson. Nunca marque como feito antes de eles confirmarem.
- Não reescreva histórico já enviado (nada de `--force`, `--amend` em commit publicado ou `reset --hard` sem pedir).
- Issues, PRs e comentários: com o `gh` (no Windows, `"/c/Program Files/GitHub CLI/gh.exe"` pelo Bash; no PowerShell as aspas do `--jq` quebram).

## Stack

| Parte | Tecnologia |
| --- | --- |
| Site | React 19 + TypeScript + Vite + Bun, Tailwind CSS v4, TanStack Router e Query |
| Conteúdo | `shared/content.ts` (fonte única dos textos, usada pelo site e pela API) |
| API de desenvolvimento | `server/index.ts` com `Bun.serve()` — **só local**; a HostGator não roda Bun |
| Formulário de contato em produção | `public/mensagem.php` (PHP + cURL para a API da Resend) |
| Hospedagem | HostGator, plano compartilhado P: arquivos estáticos + PHP 8.3 + MySQL (Percona Server 5.7.44) |
| Plataforma de cursos online (futura, projeto à parte) | Front em React + Vite; backend em **PHP + Laravel 13 + MySQL** no mesmo plano |

Limites do plano que valem para qualquer proposta: **sem SSH/Terminal, sem Node.js, Python só na 3.6 (não usar)**. Bibliotecas do backend são instaladas na máquina local e enviadas prontas; comandos no servidor rodam por Cron Job. Não proponha Vercel, Supabase, Node ou Python para a infraestrutura do IBTO.

O repositório `C:\workspace\dojomanager-saas-enterprise` é outro projeto, sem relação com o IBTO: pode ser lido para entender regras de negócio, nunca reaproveitado como infraestrutura.

## Comandos

```bash
bun install
bun run dev      # http://localhost:5173
bun run server   # API local em http://localhost:3001 (opcional)
bun run build    # typecheck + build de produção em dist/
bun run lint     # oxlint
bun run test     # testes automatizados
```

Publicação: `bun run build` (o `.env.production` já aponta o formulário para `/mensagem.php`) e enviar só o conteúdo de `dist/`; a pasta `public/`, com o `.htaccess`, é copiada para dentro dele pelo Vite. Passo a passo em [docs/deploy-homologacao.md](./docs/deploy-homologacao.md).

## Padrão de qualidade de toda página

- **Segurança em primeiro lugar:** nunca versionar segredos (`.env`, `public/config.php`); validar entrada no servidor; em PHP, consultas com parâmetros e saída escapada.
- **SEO e LLM:** cada rota tem `head()` com título, descrição e Open Graph; páginas novas entram em `public/sitemap.xml`, `public/llms.txt` e na regra de rotas do `public/.htaccess` (o teste `tests/htaccess.test.ts` falha se faltar).
- **Acessibilidade:** um `<h1>` por página, texto alternativo em imagens, navegação por teclado, contraste WCAG AA; o widget VLibras fica só no `index.html`.
- **Mobile first** com Tailwind, no tema escuro do site (fundo preto e bronze/dourado, inclusive no menu do topo).
- **Conteúdo real:** nunca inventar dados (datas, preços, telefones, pessoas). Quando faltar, deixar vazio ou "a definir" e registrar a pendência no ROADMAP.
- **LGPD e privacidade (filiados):** o IBTO exibe seus filiados, mas a maioria é operador de segurança. CPF, data de nascimento, endereço, telefone pessoal e documentos **nunca** vão para o site público, o repositório, commits, issues ou logs — só para o banco da plataforma, com acesso restrito. Em público, só o mínimo necessário (registro, validade, categoria, área, nível, nome abreviado); nome completo, foto, cidade e contato só com consentimento explícito, campo a campo e revogável. Detalhes em "Filiados, carteirinha e LGPD" no ROADMAP.

## Uso eficiente do Claude Code (economizar tokens)

Cada mensagem faz o Claude reler a conversa inteira; conversas longas são o maior gasto. Este arquivo é lido em toda conversa, então mantenha-o curto.

**Para quem pede (Gleyson, Aline):**

- **Uma conversa por issue.** Terminou a issue (ou parou no teste humano), use `/clear`. Para retomar: "Vamos continuar a issue #N". O estado fica na issue, no ROADMAP e aqui, não na conversa.
- Conversa longa sem ter terminado: `/compact` com o foco, por exemplo `/compact foco na homologação da #15`. `/context` mostra o que está ocupando espaço.
- **Seja específico:** cite a issue, o arquivo ou a página (`src/components/ContactForm.tsx`, `/cursos`), e junte vários pedidos numa mensagem só.
- **Erros: cole o texto** (só as primeiras linhas do Console, sem a pilha inteira). Print só quando o problema for visual, e recortado na parte que importa.
- **Tarefas grandes** (página nova, sistema das instituições): comece no Plan mode (Shift+Tab), aprove o plano e só então peça a execução.
- **Modelo (`/model`):** Sonnet para textos, cores, documentação e ajustes pequenos; Opus para segurança, arquitetura e bugs difíceis.
- Diga "sem print" quando você mesmo for conferir o visual.

**Para o Claude:**

- Procure com Grep/Glob antes de abrir arquivos; leia só o trecho necessário e não releia o que já está na conversa.
- Nunca varra `docs referencia/backup` inteiro: as imagens do site antigo ficam em `public_html/1.18/var/assets/img/media/iW=5000&iH=any/` e as já encontradas estão registradas nas issues.
- Capturas de tela e navegador automatizado só quando pedido ou numa mudança visual grande; saída de comandos sempre resumida (`tail`, `--jq`).
- Não crie subagentes sem pedido. Respostas curtas; o detalhe vai na issue.
- Não tente ler vídeos do YouTube: a página não traz o conteúdo. Peça o trecho da transcrição.
