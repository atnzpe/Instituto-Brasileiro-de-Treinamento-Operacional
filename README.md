# IBTO — Instituto Brasileiro de Treinamento Operacional

Reconstrução do site institucional [ib-to.org](https://ib-to.org): mesmo conteúdo, mesma identidade visual, mas numa base mais rápida, acessível e fácil de manter do que a original.

## Índice

- [Sobre o projeto](#sobre-o-projeto)
- [Equipe](#equipe)
- [Status atual](#status-atual)
- [Guia rápido para quem não é da área técnica](#guia-rápido-para-quem-não-é-da-área-técnica)
- [Guia para o time técnico](#guia-para-o-time-técnico)
  - [Stack](#stack)
  - [Estrutura de pastas](#estrutura-de-pastas)
  - [Como rodar o projeto](#como-rodar-o-projeto)
  - [Variáveis de ambiente](#variáveis-de-ambiente)
  - [Publicação (deploy)](#publicação-deploy)
- [Como testar (QA)](#como-testar-qa)
- [Fidelidade de conteúdo](#fidelidade-de-conteúdo)
- [Próximos passos](#próximos-passos)

## Sobre o projeto

O site antigo do IBTO (feito na plataforma Brizy) passou por uma auditoria de qualidade completa — o resultado está em [QA_REPORT.html](./QA_REPORT.html) — que encontrou problemas sérios de performance, acessibilidade e SEO (nota geral 4.4/10, reprovado). Este repositório é a reconstrução do site do zero, corrigindo cada um desses problemas, mantendo o mesmo conteúdo real, a mesma marca e o mesmo visual (fundo preto, bronze/dourado, emblema tático) do site original.

## Equipe

| Papel | Responsável |
| --- | --- |
| Product Owner / Product Manager / QA | Aline |
| Stakeholder principal | Eduardo Lopes |
| Desenvolvimento | time técnico (devs e estagiários) |
| Scrum Master | a definir |

Dúvidas sobre **prioridade, escopo ou aceite de uma entrega** → Aline. Dúvidas sobre **direcionamento do negócio/institucional** → Eduardo.

## Status atual

A branch `feature/landpage` já foi mesclada na `main` e fechou a issue "Auditoria IB #1": todos os itens do `QA_REPORT.html` foram corrigidos ou têm um motivo documentado para ainda estarem pendentes (ver [Próximos passos](#próximos-passos) e o arquivo [ROADMAP.md](./ROADMAP.md), que traz o detalhe item a item). O relatório [QA_REPORT_V2.html](./QA_REPORT_V2.html) compara, item a item, o que a auditoria original encontrou contra o que existe hoje no código, e é o ponto de partida para a validação de QA da Aline.

Em resumo, o que mudou em relação ao site antigo:

- **Visual**: tema escuro fiel ao emblema do IBTO em todas as páginas, com contraste de texto validado (ninguém mais vai ter dificuldade de ler por causa de cor).
- **Velocidade**: imagens que pesavam megabytes agora pesam alguns KB — o site carrega muito mais rápido, principalmente no celular.
- **Acessibilidade**: menu utilizável por teclado e leitor de tela, e o **widget oficial do governo (VLibras)** para tradução em Libras em todas as páginas.
- **Contato de verdade**: a página de Contato agora tem um formulário funcional que envia e-mail (antes não existia nenhuma forma de contato pelo site).
- **Encontrabilidade (SEO)**: cada página tem título e descrição próprios nos resultados de busca e ao compartilhar o link (antes, todo link mostrava a mesma informação genérica).

## Guia rápido para quem não é da área técnica

Você não precisa instalar nada nem entender de código para acompanhar o projeto:

1. **Para ver o que já foi corrigido e o que falta**: abra o [ROADMAP.md](./ROADMAP.md) — está organizado em "✅ Feito", "🚧 Pendente" e "🔭 Próximos passos", em linguagem direta.
2. **Para ver o diagnóstico original do site antigo**: abra o [QA_REPORT.html](./QA_REPORT.html) no navegador — é um relatório visual, com prints e notas por categoria. Para ver o que mudou desde então, abra o [QA_REPORT_V2.html](./QA_REPORT_V2.html).
3. **Para acompanhar o código sem rodar nada**: qualquer pasta e arquivo mencionados abaixo podem ser abertos direto no GitHub, mesmo sem saber programar — o conteúdo de texto do site inteiro, por exemplo, está centralizado em um único arquivo: `shared/content.ts`.
4. **Para testar o site rodando**: peça a alguém do time técnico para subir o ambiente local (próxima seção) ou aguarde a publicação (deploy) — o link será compartilhado aqui assim que estiver no ar.

## Guia para o time técnico

### Stack

| Camada | Tecnologia |
| --- | --- |
| Runtime / gerenciador de pacotes | [Bun](https://bun.sh) |
| Build / servidor de desenvolvimento | [Vite](https://vitejs.dev) |
| Interface | React 19 + TypeScript |
| Estilo | Tailwind CSS v4 (tokens em `src/index.css`) |
| Rotas | TanStack Router (baseado em arquivos, `src/routes/`) |
| Busca de dados | TanStack Query (`src/hooks/useContent.ts`) |
| API | `Bun.serve()` nativo (`server/index.ts`) |
| Cache | Redis via `ioredis` — opcional, o site funciona sem ele |
| E-mail | API do Resend (versão Bun) ou PHP + cURL (fallback para hospedagem estática) |
| Lint | oxlint |

### Estrutura de pastas

```text
shared/content.ts        # todo o texto/conteúdo real do site — usado pelo front-end e pela API
src/
  routes/                # páginas: /, /areas-de-atuacao, /quem-somos, /contato,
                          # /rede-nacional, /services (redirecionamento legado)
  components/             # Header, Footer, Hero, TeamCard, ServiceGrid, ContactForm, etc.
  hooks/                  # useContent.ts (busca de conteúdo), useDocumentTitle.ts
  lib/api.ts              # funções que chamam a API de conteúdo e o endpoint de contato
server/
  index.ts                # Bun.serve() — /api/nav, /api/content/:slug, /api/contact
  cache.ts                # cache com Redis (com fallback automático se o Redis cair)
  redisClient.ts          # configuração da conexão com o Redis
public/
  images/                 # imagens reais do site (logo, hero, fotos da equipe, emblemas)
  contact.php             # alternativa em PHP ao formulário de contato (hospedagem sem Bun)
  llms.txt, robots.txt, sitemap.xml, favicon.ico
QA_REPORT.html            # auditoria que motivou esta reconstrução
QA_REPORT_V2.html         # revalidação: o que mudou desde a auditoria original
ROADMAP.md                # o que foi feito, o que falta e o que vem a seguir
```

### Como rodar o projeto

```bash
bun install
bun run dev      # servidor de desenvolvimento — http://localhost:5173
bun run server   # API de conteúdo/contato — http://localhost:3001
```

O front-end funciona sozinho mesmo sem rodar `bun run server` — a aplicação já nasce com o conteúdo real embutido e só atualiza contra a API em segundo plano. Redis também é opcional em desenvolvimento.

Outros comandos:

```bash
bun run build     # gera a versão de produção em dist/
bun run lint      # checagem de estilo de código (oxlint)
bun run preview   # visualiza a versão de produção localmente
```

### Variáveis de ambiente

Copie `.env.example` para `.env` e preencha com valores reais (esse arquivo detalha cada uma):

- `REDIS_URL` — opcional, só usada pela API.
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` — necessárias para o formulário de contato enviar e-mail de verdade (as versões em Bun e em PHP usam as mesmas três).
- `VITE_CONTACT_ENDPOINT` — só necessária numa publicação 100% estática sem a API em Bun (aponta o formulário para `/contact.php`); deixe em branco no ambiente local.

### Publicação (deploy)

Dois caminhos possíveis, que podem ser combinados:

1. **Hospedagem estática (ex.: HostGator)** — gerar o build com `VITE_CONTACT_ENDPOINT=/contact.php bun run build`, enviar a pasta `dist/` (já inclui `contact.php`) para o servidor, copiar `config.example.php` para `config.php` e preencher a chave real do Resend. Não precisa de Bun/Node no servidor.
2. **Vercel** — publica a pasta `dist/` como site estático; cada branch/PR já ganha uma URL de teste automática (útil como ambiente de homologação). O endpoint de contato pode virar uma função serverless da própria Vercel, reaproveitando a mesma lógica do `server/index.ts`.

## Como testar (QA)

Para quem for validar entregas (Aline ou qualquer pessoa do time):

1. Rode o projeto localmente (seção acima) ou acesse a URL de homologação quando publicada.
2. Confira as quatro páginas principais: Início, Áreas de Atuação, Quem Somos e Contato — mais a nova página Rede Nacional.
3. Teste em celular (ou reduza a janela do navegador) — o site foi construído mobile-first.
4. Teste o menu só com o teclado (Tab) — todos os links devem ser alcançáveis.
5. Teste o formulário de Contato — sem a `RESEND_API_KEY` configurada, ele deve mostrar uma mensagem de erro visível, nunca fingir que enviou.
6. Compare com os achados do `QA_REPORT.html` e marque no `ROADMAP.md` o que já foi validado.

## Fidelidade de conteúdo

Todo texto, imagem, biografia da diretoria, emblema de serviço e link em `shared/content.ts` veio do site real, conferido contra cópias salvas das páginas originais — nada de texto de preenchimento. A única exceção é a lista de representantes em `/rede-nacional`, que está propositalmente vazia até recebermos os dados reais (ver Roadmap).

## Próximos passos

Veja o detalhamento completo em [ROADMAP.md](./ROADMAP.md).
