# Histórico de versões (CHANGELOG)

Todas as mudanças que importam para quem visita o site `ib-to.org` ficam aqui, da mais nova para a mais antiga.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e as versões seguem o [Versionamento Semântico](https://semver.org/lang/pt-BR/):

- **MAIOR** (1.0.0): mudança que quebra algo para quem já usa (ex.: o site em produção com outra estrutura de endereços).
- **MENOR** (0.**2**.0): funcionalidade nova, sem quebrar nada.
- **CORREÇÃO** (0.1.**1**): conserto, sem funcionalidade nova.

Enquanto a versão começar com **0**, o site está em homologação (antes do lançamento oficial).
A plataforma de cursos (`cursos.ib-to.org`) tem o próprio histórico, no repositório `ibto-plataforma`.

## [Não lançado]

### Alterado

- CI só nas PRs (antes rodava também a cada push), para economizar os minutos do GitHub Actions.

### Adicionado

- Menu de idiomas no topo de todas as páginas (#54): Português (padrão), English e Español, com bandeira. Cada idioma abre a mesma página traduzida pelo Google Tradutor, sem carregar script do Google no site. No celular, fica no fim do menu.

## [0.2.0] — 17/10/2026 — piloto (homologação)

### Adicionado

- Versão no rodapé (#75), lida do `package.json`: o suporte sabe o que está no ar.

### Alterado

- Preto equilibrado em todo o site: o fundo passa do preto absoluto para um carvão (`#14161a`), o branco dos textos para um branco quente (`#f3f1ec`) e os cartões ganham um tom acima do fundo, para não cansar a vista; contraste continua acima do AA.
- Áreas de atuação: cada emblema num medalhão (o emblema preenche o círculo, sem o quadrado preto), com contorno dourado fino e leve realce de brilho (PRs #92 e #93).
- Contato: WhatsApp, Facebook e Instagram em medalhões circulares, no mesmo estilo (PR #94).
- Eventos: fotos só para filiados, com aviso e botão para entrar na plataforma (PR #91).

## [0.1.0] — 16/10/2026 — piloto (homologação)

Primeira versão marcada do site, publicada na homologação (`homolog.ib-to.org`) para o piloto da plataforma de cursos.

### Adicionado

- Landpage institucional com as seções do IBTO, áreas de atuação e treinamentos passados (PRs #2, #6, #12).
- Página inicial redesenhada: chamada principal com os botões de ação, próximos cursos e áreas vindos da plataforma, cartões com fotos (PRs #18, #77).
- Banners nas páginas internas e área segura para celulares com recorte na tela (PRs #31, #32).
- Formulário de contato em PHP, entregue na caixa do domínio `comando@ib-to.org` (PRs #30, #76).
- Modo offline e instalação como aplicativo (PWA), com o ícone do IBTO e o convite para instalar (PRs #50, #82).
- Botão "Entrar" e os cursos abrindo direto na plataforma; a antiga tela de cursos do site deixou de existir (PRs #64, #65, #67).
- Áreas de atuação, "Últimas do IBTO", blog e eventos lidos da plataforma (PRs #63, #66, #69).
- Três idiomas pelo Google Tradutor (português, inglês e espanhol), `robots.txt`, `llms.txt`, dados estruturados (JSON-LD) para buscadores e VLibras (PRs #55, #69).
- CI no GitHub Actions e publicação automática na homologação da HostGator (PRs #14, #16).

### Alterado

- O curso de Formação de Instrutor saiu do site: é um curso fechado, fora da vitrine (PR #62).

### Documentação

- README, ROADMAP, CLAUDE.md e as decisões da plataforma de cursos (PRs #23, #29, #49, #51, #70).
