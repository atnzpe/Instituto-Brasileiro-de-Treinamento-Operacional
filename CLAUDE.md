# CLAUDE.md — IBTO Landpage

Instruções para o Claude Code (e para qualquer pessoa) trabalhar neste repositório. O README explica o projeto; este arquivo diz **como trabalhar** nele.

## O projeto

Site institucional do IBTO (Instituto Brasileiro de Treinamento Operacional), reconstruído a partir do site antigo em Brizy, publicado em [ib-to.org](https://ib-to.org).

- **Pessoas:** Aline é PO, PM e QA (aceite e teste humano); Eduardo Lopes é o stakeholder principal (decisões de negócio); Gleyson desenvolve e está aprendendo — explique o porquê das coisas e prefira passos pequenos.
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
- "Testes automatizados" hoje são `bun run build` e `bun run lint` (os avisos `only-export-components` das rotas são conhecidos). Ainda não há suíte de testes nem deploy automático; não diga que existem.
- O teste humano é da Aline ou do Gleyson. Nunca marque como feito antes de eles confirmarem.
- Não reescreva histórico já enviado (nada de `--force`, `--amend` em commit publicado ou `reset --hard` sem pedir).
- Sem `gh` instalado nesta máquina: para issues e PRs, gere o texto ou um link pré-preenchido para o time colar no GitHub.

## Stack

| Parte | Tecnologia |
| --- | --- |
| Site | React 19 + TypeScript + Vite + Bun, Tailwind CSS v4, TanStack Router e Query |
| Conteúdo | `shared/content.ts` (fonte única dos textos, usada pelo site e pela API) |
| API de desenvolvimento | `server/index.ts` com `Bun.serve()` — **só local**; a HostGator não roda Bun |
| Formulário de contato em produção | `public/contact.php` (PHP + cURL para a API da Resend) |
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
```

Publicação: gerar o build com `VITE_CONTACT_ENDPOINT=/contact.php bun run build` e enviar só o conteúdo de `dist/` (a pasta `public/` é copiada para dentro dele pelo Vite).

## Padrão de qualidade de toda página

- **Segurança em primeiro lugar:** nunca versionar segredos (`.env`, `public/config.php`); validar entrada no servidor; em PHP, consultas com parâmetros e saída escapada.
- **SEO e LLM:** cada rota tem `head()` com título, descrição e Open Graph; páginas novas entram em `public/sitemap.xml` e `public/llms.txt`.
- **Acessibilidade:** um `<h1>` por página, texto alternativo em imagens, navegação por teclado, contraste WCAG AA; o widget VLibras fica só no `index.html`.
- **Mobile first** com Tailwind, no tema escuro do site (fundo preto e bronze/dourado, inclusive no menu do topo).
- **Conteúdo real:** nunca inventar dados (datas, preços, telefones, pessoas). Quando faltar, deixar vazio ou "a definir" e registrar a pendência no ROADMAP.
- Nome, telefone e foto de pessoas só com autorização delas.
