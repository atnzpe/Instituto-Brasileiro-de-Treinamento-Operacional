# CLAUDE.md — IBTO Landpage

Instruções para o Claude Code (e para qualquer pessoa) trabalhar neste repositório. O README explica o projeto; este arquivo diz **como trabalhar** nele.

## O projeto

Site institucional do IBTO (Instituto Brasileiro de Treinamento Operacional), reconstruído a partir do site antigo em Brizy, publicado em [ib-to.org](https://ib-to.org).

- **Pessoas:** Aline é PO, PM e QA (aceite e teste humano); Eduardo Lopes é o stakeholder principal (decisões de negócio); Gleyson Atanazio é o desenvolvedor e o Scrum Master, e está aprendendo — explique o porquê das coisas e prefira passos pequenos.
- **Idioma:** tudo em português do Brasil (commits, issues, PRs, documentação e textos do site).
- **Documentos-chave:** [README.md](./README.md), [ROADMAP.md](./ROADMAP.md) (fonte da ordem das próximas tarefas), [docs/guia-primeiras-tarefas.md](./docs/guia-primeiras-tarefas.md) e [QA_REPORT.html](./QA_REPORT.html).

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
- Sem `gh` instalado nesta máquina: para issues e PRs, gere o texto ou um link pré-preenchido para o time colar no GitHub.

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
