# Roadmap

Situação da reconstrução do site do IBTO, organizada em relação ao [QA_REPORT.html](./QA_REPORT.html) (auditoria do site antigo) e aos pedidos feitos ao longo do trabalho. Atualizado em 16/10/2026: o site e a plataforma de cursos estão no ar na homologação, e o próximo marco é o piloto com a diretoria.

Legenda: **✅ Feito** já está no código. **🚧 Pendente** é código pronto, esperando um dado, credencial ou decisão do time de negócio/infra. **🧭 Proposta** é uma recomendação técnica que precisa de aprovação. **🔭 Próximos passos** são as próximas issues/branches, na ordem em que devem ser feitas (o caminho de cada uma está no [fluxo de trabalho do README](./README.md#fluxo-de-trabalho)).

## 📍 Onde estamos (16/10/2026)

| Parte | Endereço de testes | Situação |
| --- | --- | --- |
| Site institucional | `homolog.ib-to.org` | No ar: páginas institucionais, **blog e eventos** (vindos da plataforma, #61), áreas de atuação vindas da plataforma (#57), botão "Entrar / Área do aluno" (#48), três idiomas, VLibras, PWA offline. O endereço `/cursos` leva ao catálogo da plataforma (PR #67) |
| Plataforma de cursos | `cursos-homolog.ib-to.org` | No ar: cadastros, filiados, financeiro, anuidade, cursos e trilhas, matrícula com PIX, chamada, certificado com QR, Meu dossiê, blog e galeria (detalhe no README da plataforma) |
| QA | — | Revalidação da Aline fechada em 16/10/2026 (#4): todos os achados do QA_REPORT resolvidos; ficam os testes humanos com leitor de tela, celulares físicos e envio real do formulário |
| Piloto | — | Base de demonstração em montagem (filiados reais já cadastrados); depois, o teste guiado da diretoria |
| Produção | `ib-to.org` e `cursos.ib-to.org` | Clone da homologação depois do piloto (#56) |

## ✅ Feito

### Fidelidade visual e de conteúdo

- [x] Paleta de cores trocada de um azul genérico para o bronze/dourado real do emblema do IBTO, com contraste de texto validado (padrão WCAG AA)
- [x] Início, Áreas de Atuação, Quem Somos e Contato reconstruídos no tema escuro real do site original (conferido contra cópias salvas das páginas ao vivo, não feito de memória)
- [x] Emblemas de serviço e ícones de redes sociais trocados pela arte real em alta resolução (antes: imagens de baixa qualidade)
- [x] Fotos da diretoria aumentadas, nas proporções do site original

### Correções do QA_REPORT.html

- [x] Performance — todas as imagens convertidas para WebP; o que pesava megabytes agora pesa dezenas de KB
- [x] Menu mobile — tamanho de toque e contraste corrigidos, abre e fecha corretamente
- [x] Navegação por teclado — nenhum link "invisível" pro teclado; todos alcançáveis e marcados como página atual
- [x] Título duplicado no topo da home — impossível de acontecer na reconstrução (só existe um título por página)
- [x] Erro 404 "mudo" — agora existe uma página real de "não encontrado" (o código de status HTTP real ainda depende de configuração do servidor, ver Pendente)
- [x] Descrição, título e imagem de cada página nos resultados de busca e ao compartilhar o link (Meta description, Open Graph, favicon, sitemap.xml)
- [x] Cabeçalhos de segurança na API
- [x] Texto alternativo (para leitores de tela) em toda logo/emblema/ícone
- [x] Link antigo `/services` redireciona automaticamente para `/areas-de-atuacao`

### Recursos novos

- [x] Formulário de contato de verdade (validado no navegador e no servidor), envia e-mail pelo `mail()` do PHP da HostGator (`mensagem.php`; a Resend foi descartada na issue #28)
- [x] Título e descrição próprios por página nos resultados de busca (antes, toda página mostrava a mesma descrição genérica)
- [x] Dados estruturados para buscadores e IAs (JSON-LD, `llms.txt`, `robots.txt`)
- [x] Widget oficial do governo (VLibras) para tradução em Libras, em todas as páginas
- [x] Página `/rede-nacional` criada (diretório de representantes/instrutores, no formato usado pela WKMF) — pronta para exibir dados reais, hoje vazia
- [x] Página `/cursos` (grade com modal de detalhes) com os 5 treinamentos presenciais: Formação de Instrutores, Combate Corpo a Corpo e Combate com Faca (10 e 11 de outubro, em Recife), Seminário Bastão Tático (sem data fixa, pois é dado sempre) e Curso Sobrevivência Urbana Nível 1 (sem data ainda). Cada modal mostra o que houver de datas, local, preço, instrutor, carga horária, conteúdo, materiais inclusos e WhatsApp. Os cursos online aparecem só como um aviso "em breve" da plataforma própria (decisão do Eduardo, ver Proposta)

## 🚧 Pendente — falta um dado, credencial ou decisão, não código

- [ ] **E-mail do formulário de contato** — hoje envia de `comando.ibto@gmail.com` para ele mesmo; a HostGator não assina pelo `gmail.com` e a mensagem pode cair no spam. Proposta (16/10/2026): usar `comando@ib-to.org` como remetente e destino, depois de confirmar que a caixa existe e que o SPF/DKIM está "Valid" no cPanel
- [ ] **Lista real da Rede Nacional** (#11) — depende da autorização do Mestre Eduardo; proposta: equipes ativas sempre, instrutores só com autorização (LGPD), com filtros por estado e área
- [ ] **Sobrevivência Urbana N1** — data, local, valor e instrutor (o Mestre cadastra no teste do piloto)
- [ ] **Autorização de imagem** dos instrutores dos cartazes e das fotos do Instagram usadas no blog e na galeria
- [ ] **Encontro nacional** — sem data; cadastrar na plataforma quando houver
- [ ] **Telefones dos cartazes** — números diferentes entre os cartazes do Recife; confirmar o oficial antes da produção

## 🧭 Proposta — homologação e plataforma de cursos online (aguarda aprovação de Eduardo e Aline)

### Decisões já tomadas

- **Cursos presenciais ficam no site oficial** (ib-to.org), na página `/cursos`.
- **Cursos online terão uma plataforma à parte** (decisão do Eduardo, 23/09/2026): layout totalmente diferente do site, mais tecnológico, mais fácil de organizar e mais personalizável, seguindo os modelos Solyd, Resend e Dankicode. O site do IBTO terá apenas um link para ela.
- **Toda a estrutura da HostGator será usada**, no frontend e no backend, inclusive para homologação.
- **Backend da plataforma: PHP 8.2+ e MySQL no plano atual da HostGator** (decisão de 26/09/2026, depois que a tabela oficial mostrou que o plano compartilhado só tem Python 3.6 e não tem Node nem SSH). O layout da plataforma continua em React + Vite + Bun, publicado como arquivos estáticos.
- **O DojoManager é só referência de lógica.** É outro projeto, sem relação com o IBTO: a infraestrutura, o banco e o código dele não serão usados aqui; serve apenas para consultar como certas regras de negócio foram pensadas.

### O que o plano da HostGator inclui

Lido do backup do cPanel de 13/09/2026 (plano `P_100`); vale confirmar no painel.

| Recurso | O que o plano tem | O que isso significa para nós |
| --- | --- | --- |
| Subdomínios | ilimitados | Dá para criar `homolog.ib-to.org` (site) e um endereço para a plataforma de cursos, sem custo extra |
| Bancos MySQL | ilimitados | É o banco de dados natural da plataforma |
| Disco e tráfego | cerca de 100 GB, sem limite declarado de tráfego | Sobra para o site e as imagens; não serve para hospedar vídeo das aulas (ver abaixo) |
| Domínios adicionais | 0 | Só `ib-to.org` e seus subdomínios |
| Aplicações Node/Python (Passenger) | até 4 no cadastro da conta | Pela tabela oficial da HostGator, no plano compartilhado só existe Python 3.6 (Django até 3.2) e **não existe Node.js**; o teste de 26/09 nem chegou a rodar o Python (ver Pendente) |
| PHP | 8.2, 8.3, 8.4 e 8.5 (tabela oficial) | Versões atuais e com suporte; o `mensagem.php` já funciona e o backend pode ser em PHP |
| MySQL | **Percona Server 5.7.44** no nosso servidor (conferido no phpMyAdmin em 26/09/2026) | Compatível com o Laravel 13 (aceita MySQL 5.7+). Atenção: o MySQL 5.7 saiu do suporte oficial em outubro de 2023; o banco só é acessível de dentro do servidor, o que reduz o risco. Vale perguntar à HostGator se a conta pode ir para um servidor com MySQL 8.0 |
| PHP padrão da conta | **8.3** (`ea-php83`), conferido no MultiPHP Manager em 26/09/2026 | Já atende o mínimo do Laravel 13 |
| SSH / Terminal | não suportado no compartilhado (tabela oficial) | Não dá para instalar pacotes no servidor; tudo o que o backend usar precisa ser enviado pronto |
| Cron e cliente Git | suportados | Tarefas agendadas e publicação a partir do GitHub |
| PostgreSQL | não suportado no compartilhado | Usar MySQL |
| Redis | não faz parte do plano | O cache do servidor atual já funciona sem ele |
| Caixas de e-mail | ilimitadas | Dá para criar `contato@ib-to.org` |

### Outras ferramentas do cPanel úteis para o projeto

Levantadas na documentação oficial (`docs.cpanel.net/cpanel`) em 26/09/2026. Várias dependem de a HostGator tê-las ativado, então a coluna "Conferir no painel" diz o que olhar.

| Ferramenta | Para que serve aqui | Conferir no painel |
| --- | --- | --- |
| **Git Version Control** (Arquivos) | Clonar o repositório do GitHub dentro da hospedagem e publicar com um arquivo `.cpanel.yml`, que copia arquivos para a pasta do site (`/bin/cp`). A documentação não prevê rodar o build (`bun run build`) no servidor, então o build continua sendo feito na nossa máquina | Se o ícone existe; repositório privado exige chave SSH |
| **Terminal** e **SSH Access** | Linha de comando no servidor: instalar pacotes (Python, Composer), ver logs, rodar migrações do banco | Se existem; a própria documentação avisa que nem todo provedor libera |
| **Cron Jobs** | Tarefas agendadas, por exemplo tirar do ar os cursos com data vencida ou enviar lembretes, com um script PHP rodando sozinho | Disponível na seção Avançado |
| **MySQL / MariaDB** e **phpMyAdmin** | Banco da plataforma e ferramenta visual para consultar e editar dados | Disponível (bancos ilimitados) |
| **PostgreSQL** | Alternativa ao MySQL, só se a HostGator o tiver instalado | Se aparece "PostgreSQL Databases" |
| **Remote Database Access** | Permitir que um servidor de fora acesse o MySQL. Não precisamos, porque tudo fica na HostGator; deixar desligado é mais seguro | — |
| **MultiPHP Manager** | Escolher a versão do PHP por domínio e subdomínio | Versão atual do PHP |
| **Domínios** | Criar subdomínios (sem marcar "Share document root", que é permanente) e forçar HTTPS | — |
| **SSL/TLS Status** (AutoSSL) | Certificado HTTPS gratuito e automático para os subdomínios | Se `homolog.ib-to.org` aparece com certificado válido |
| **Erros** (Métricas) | Log de erros do servidor; foi ele que mostrou por que o teste do Python deu 403 | — |
| **Backup** | Cópia completa da conta antes de mudanças grandes | Fazer um backup antes de publicar em produção |

### Como publicar o site em homologação

- Endereço: `homolog.ib-to.org`, criado no cPanel (Domínios).
- Sobe-se apenas o conteúdo de `dist/` (resultado de `bun run build`). A pasta `public/` não é enviada: o Vite copia o conteúdo dela para dentro de `dist/`, e é assim que `mensagem.php`, `robots.txt`, `sitemap.xml` e as imagens chegam ao servidor. O Bun só é necessário na máquina de quem gera o build, não na HostGator.
- Como enviar o `dist/`, do mais simples ao mais automático:
  1. **Gerenciador de Arquivos**: compactar o `dist/` em `.zip`, carregar e extrair na pasta do subdomínio. Bom para a primeira publicação.
  2. **FTP**: um programa como o FileZilla envia a pasta inteira; dá para criar uma conta FTP só para isso em "FTP Accounts".
  3. **Git Version Control**: o servidor puxa o repositório do GitHub e um `.cpanel.yml` copia os arquivos para o site. Como o servidor não roda o build, o `dist/` gerado teria de ser versionado numa branch só de publicação. Fica para depois que a homologação estiver funcionando.
- Falta criar um `.htaccess` (ver Pendente) para as rotas e o 404 de verdade.
- Formulário envia de `comando.ibto@gmail.com` para ele mesmo (decisão do Gleyson, 28/09/2026). Se as mensagens caírem no spam, criar no cPanel uma caixa do domínio para ser o remetente e conferir o SPF e o DKIM em **Email Deliverability** (o `config.php` virou opcional).
- Conferir se o HTTPS está ativo no subdomínio.

### Plataforma de cursos online: onde e com quê

- **Endereço:** ✅ `cursos.ib-to.org`, com `cursos-homolog.ib-to.org` para testes (Eduardo, 29/09/2026).
- **Projeto separado**, com repositório próprio, para o layout e a evolução independentes do site institucional.
- **Backend**: ✅ **decidido em 26/09/2026 — opção A (PHP + MySQL no plano atual).** A preferência inicial do time era Python, mas a tabela oficial da HostGator mudou o quadro. As opções avaliadas, para registro:

| Opção | Como funciona | Custo | Vantagem | Ponto de atenção |
| --- | --- | --- | --- | --- |
| **A. PHP + MySQL no plano atual (recomendada)** | API e painel em PHP 8.2+, dados no MySQL, tudo na hospedagem que já é paga | Nenhum extra | Versões atuais e com suporte; roda hoje (o `mensagem.php` já prova); cron e MySQL inclusos | Mais uma linguagem para o time aprender (PHP também é considerado amigável para iniciantes). Sem SSH, as bibliotecas do backend são instaladas na nossa máquina e enviadas prontas |
| B. Python moderno + MySQL em VPS | Contratar VPS na HostGator: Python e Django atuais, SSH e Node disponíveis | Mensalidade maior (consultar a HostGator) | Linguagem preferida do time; Django traz painel admin, login e controle de usuários prontos | Custo, e o VPS exige cuidar do servidor (atualizações e segurança) |
| Não recomendada | Python 3.6 / Django 3.2 no plano atual | Nenhum extra | — | Ambos sem atualizações de segurança há anos; inaceitável para uma plataforma com login, dados de filiados e pagamento. Além disso, o teste nem chegou a rodar |

Node.js fica descartado no plano atual (não suportado).

Em qualquer caso, o layout da plataforma continua em React + Vite, publicado como arquivos estáticos; só a API muda de linguagem.

- **Vídeo das aulas:** não é recomendável hospedar arquivos de vídeo numa hospedagem compartilhada (gastam muito tráfego e processamento). ✅ Decidido (Eduardo, 29/09/2026): **link do YouTube, Vimeo ou Google Drive**, incorporado na aula; em 02/10/2026 ele confirmou o **YouTube** como padrão (detalhes em "Decisões da plataforma").
- **Painel administrativo e controle de filiados:** a serem construídos dentro da plataforma (cursos, aulas, inscritos, filiados).

Regras de negócio que vale usar como referência (lógica pensada no DojoManager, sem reaproveitar código nem infraestrutura):

| Regra | Como aplicar no IBTO |
| --- | --- |
| As três modalidades vêm de dois campos: visibilidade (público ou restrito) e valor (vazio = gratuito) | Gratuito e privado = restrito sem valor; pago e aberto = público com valor; pago e restrito = restrito com valor |
| Vagas com trava contra lotação | No MySQL, a inscrição roda numa transação que bloqueia o curso enquanto conta as vagas |
| Cancelar inscrição sem apagar | Marca como cancelada e libera a vaga, mantendo o histórico |
| Confirmação de pagamento ligada à inscrição | Cada inscrição guarda a referência do pagamento, impedindo confirmar duas vezes |
| Ouvidoria com protocolo e anonimato real | Chamados com número de protocolo, complementando o formulário de contato |
| Certificado | Emitido ao concluir o curso |

### Pagamento: decisão de Eduardo

Duas opções:

- **Fluxo manual**: PIX e comprovante por WhatsApp, com o gestor confirmando no painel. Custo zero e rápido, mas dá trabalho a cada inscrição.
- **Gateway** com PIX e cartão, que avisa o sistema sozinho quando o pagamento cai (a HostGator consegue receber esse aviso pela internet). Candidatos a comparar: Asaas, Mercado Pago, Stripe e Pagar.me/Efí. Critérios: taxa por transação, PIX, cartão parcelado, recorrência (para a anuidade dos filiados) e ambiente de testes.

✅ Decidido (Eduardo, 29/09/2026): **começar com o fluxo manual**, com a **secretaria/tesouraria** confirmando no painel, e integrar o gateway em seguida, quando o provedor for escolhido (reconfirmado em 02/10/2026: "o ideal é automatizar depois"). Como o valor é dividido com o instrutor (50%, ver "Decisões da plataforma"), o **split de pagamento** (o gateway repassa a parte do instrutor sozinho) entra nos critérios de escolha.

### Filiados, carteirinha e LGPD

**Regra do projeto (26/09/2026):** o IBTO quer **exibir seus filiados**, mas sempre seguindo a LGPD (Lei Geral de Proteção de Dados) e as leis de privacidade internacionais, como a GDPR europeia. A maioria dos filiados é **operador de segurança** (policiais, militares, vigilantes), e expor nome completo, cidade, foto ou documento pode colocar a pessoa em risco.

A carteirinha de filiado já existe e traz: nome completo, nascimento, CPF, UF, município, número de registro (ex.: `BR2026XXXXPE`), validade, categoria, área de atuação, nível, equipe/academia, foto, data de emissão, QR code e código de barras.

| Dado | Onde pode aparecer |
| --- | --- |
| CPF, data de nascimento, endereço, telefone pessoal, foto do documento | **Nunca em público nem no repositório.** Só no banco de dados da plataforma, com acesso restrito e registro de quem acessou |
| Número de registro, validade (ativo ou vencido), categoria, área e nível | Página pública de **validação da carteirinha** (aberta pelo QR code), para confirmar que a pessoa é filiada |
| Nome | Na validação e em listas, abreviado por padrão (ex.: "Gleyson A."); nome completo só com consentimento |
| Foto, cidade e contato | Só com **consentimento explícito**, pedido campo a campo e revogável a qualquer momento; o padrão é não mostrar |

Princípios para qualquer tela que use dados de filiados:

- **Minimização:** publicar só o necessário para a finalidade (ex.: confirmar se a carteirinha é válida).
- **Consentimento registrado:** o filiado escolhe o que aparece e pode mudar ou retirar a qualquer momento; há opção de ficar oculto.
- **Finalidade clara e aviso de privacidade** publicado no site (política de privacidade e como pedir correção ou exclusão de dados).
- **Segurança:** dados só na plataforma (Laravel + MySQL), com senha forte, controle de permissão, criptografia dos campos sensíveis e registro de acesso; nunca em `shared/content.ts`, commits, issues ou logs.
- **Encarregado de dados (DPO):** a LGPD pede que a instituição indique quem responde por dados pessoais; é uma decisão do Eduardo.

Pontos a conferir na carteirinha atual: o CPF impresso aparece **sem o zero inicial** (10 dígitos em vez de 11), e a equipe aparece como "Instrutor Trinca" enquanto o cadastro enviado diz "Mestre Trinca". Vale padronizar antes de gerar novas carteirinhas.

### Decisões da plataforma (fechadas em 29/09/2026, revisadas em 02/10/2026)

Registradas na issue [#34](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/34), com o Eduardo (28/09, 29/09 e 02/10/2026) e o Gleyson.

| Tema | Decisão |
| --- | --- |
| Backend | PHP 8.3 + **Laravel 13** + MySQL no plano atual da HostGator (Gleyson, 29/09) |
| Vídeo das aulas | **YouTube** como padrão (Eduardo, 02/10), por link incorporado na aula; nada hospedado no nosso servidor. Vimeo e Google Drive seguem aceitos. Ponto de atenção: o link do YouTube não listado pode ser repassado; para cursos pagos, o Vimeo com restrição de domínio protege melhor |
| Pagamento | **PIX manual primeiro** (comprovante + confirmação no painel), **gateway automático depois** (provedor a escolher; o split de pagamento conta a favor) |
| Divisão do valor | **50% para o filiado que criou o curso e 50% para o IBTO** (Eduardo, 02/10; substitui o percentual informado pelo instrutor). Cada pagamento gera um conta a pagar (instrutor) e um conta a receber (IBTO); o percentual fica gravado em cada matrícula, para que uma mudança futura da regra não altere as matrículas antigas |
| Endereço | `cursos.ib-to.org` (testes em `cursos-homolog.ib-to.org`); reconfirmado pelo Eduardo em 02/10 |
| Estrutura do IBTO | **Um único IBTO**, sem unidades, com **equipes filiadas**; anuidade 2027 de **R$ 90,00** (reconfirmado em 02/10) |
| Quem cria cursos | Filiado **com permissão** (instrutor), só na área em que é capacitado; o curso **só vai ao ar depois de aprovado pela diretoria** |
| Papéis | **Hoje o Eduardo faz tudo** (02/10): aprova cursos, confirma pagamentos e cadastra filiados e equipes. O sistema mantém as permissões separadas (**diretoria**, **secretaria/tesouraria**, **setor administrativo**, **instrutor** e **aluno**, que se cadastra sozinho) para delegar depois sem mudar o código |
| Cadastro de filiado | **Só o IBTO cadastra**; a pessoa recebe um convite por e-mail para criar a própria senha |
| Idiomas | **Português (padrão), inglês e espanhol em todas as telas**, escolhidos pelo usuário; vale também para o site (Gleyson, 29/09) |

Ainda em aberto: o que pode ser público sobre cada filiado segue a regra de "Filiados, carteirinha e LGPD" abaixo; o encarregado de dados (DPO) é decisão do Eduardo (issue [#47](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/47)).

## 🔭 Próximos passos

Cada linha vira uma issue e uma branch, na ordem abaixo, seguindo o fluxo de trabalho do README. Concluídas ficam com ✅.

### Site institucional (ib-to.org)

| # | Issue / branch | Entrega | Depende de |
| --- | --- | --- | --- |
| 1 | ✅ `feature/cursos` — issue #5, mesclada (PR #6) | Grade de treinamentos presenciais com modal e aviso da plataforma online | — |
| 1b | ✅ `chore/github-actions-ci` — issue [#13](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/13), mesclada em 27/09/2026 (PR #14) | CI na aba **Actions**: lint, testes e build a cada push; `.gitattributes` padroniza o fim de linha | — |
| 1c | ✅ `fix/cursos-treinamentos-passados` — issue [#8](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/8), mesclada em 27/09/2026 (PR #12) | Treinamento passado aparece como "Encerrado"; botões de "Pré-inscrição"; primeiro teste automatizado | — |
| 1d | ✅ `feature/safe-area` — issue [#10](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/10), mesclada em 28/09/2026 (PR #32) | Safe Area em todas as páginas: `viewport-fit=cover` e utilitários `px-safe-N`, `pt-safe`, `pb-safe-N` e `dialog-safe` no header, rodapé, menu, modal, conteúdo e VLibras | — |
| 1e | ✅ `feature/offline-first-pwa` — issue [#9](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/9), mesclada em 29/09/2026 (PR #50); teste humano OK no computador, Android e iPhone | Site abre sem internet depois da primeira visita e pode ser instalado no celular (PWA), com aviso claro no formulário de contato offline (`SEM_INTERNET`) | — |
| 1f | ✅ `feature/home-cards-com-foto` — issue [#17](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/17), mesclada em 28/09/2026 (PR #18) | Fotos nos cards de Capacitações da home e cards do topo no tema escuro | — |
| 1g | ✅ `feature/banners-paginas` — issue [#20](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/20), mesclada em 28/09/2026 (PR #31) | Banners do site original em Áreas de Atuação, Quem Somos e Contato (WebP 800/1600 px) | — |
| 1h | ✅ `docs/claude-md-produtividade` — issue [#22](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/22), mesclada em 28/09/2026 (PR #23) | Regras no CLAUDE.md para economizar tokens no Claude Code | — |
| 2 | ✅ `feature/homologacao-hostgator` — issues [#15](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/15), [#19](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/19) e [#24](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/24), mesclada em 28/09/2026 (PR #16) | Primeiro deploy: `homolog.ib-to.org` protegido por senha (pedida só depois do HTTPS), `.htaccess` completo, guia de deploy e formulário protegido (origem, anti-robô, limite de envios, códigos de erro) | — |
| 2a | ✅ `feature/deploy-automatico-homologacao` — issue [#26](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/26), mesclada em 28/09/2026 (PR #16) | Deploy automático da homologação por FTPS a cada merge na `main` | — |
| 2b | ✅ `feature/contato-mail-hostgator` — issue [#28](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/28), mesclada em 28/09/2026 (PR #30) | Formulário de contato pelo `mail()` da HostGator, sem Resend: de `comando.ibto@gmail.com` para ele mesmo, `Reply-To` com o visitante, cabeçalhos sem quebra de linha | — |
| 3 | [#11](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/11) Cadastro das equipes filiadas | Etapa 1: lista pública das equipes em `/rede-nacional`, só com dados autorizados. Etapa 2: [#37](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/37), na plataforma | Planilha do Eduardo |
| 4 | ✅ [#4](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/4) Revalidação de QA — fechada em 16/10/2026 | Todos os achados resolvidos; testes humanos restantes listados na issue | — |
| 4a | ✅ #57 e #52 — áreas e cursos vindos da plataforma | Página de áreas lê a API da plataforma; `/cursos` passou a levar ao catálogo (PR #67) | — |
| 4b | ✅ #61 — blog e eventos no site (PR #69) | `/blog`, `/blog/<slug>`, `/eventos` e `/eventos/<slug>`; home sem cartões repetidos; offline e JSON-LD | — |
| 5 | `feature/ouvidoria` (sem issue ainda) | Chamados com protocolo no site institucional (PHP e MySQL da HostGator), complementando o formulário de contato | — |
| 6 | [#54](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/54) `feature/site-tres-idiomas` | Todas as páginas em **português, inglês e espanhol**, com seletor no menu do topo (regra do Gleyson, 29/09/2026) | Revisão das traduções do conteúdo institucional pelo Eduardo |

### Plataforma de cursos online — épico [#33](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/33)

Issues com o rótulo `plataforma` e o marco "Plataforma de cursos". ✅ = no ar na homologação; a issue fecha depois do teste do piloto. Ficam neste repositório até a plataforma ter o seu (depois são transferidas com `gh issue transfer`). A lógica de negócio pode ser consultada no DojoManager, sem reaproveitar código nem infraestrutura.

| Issue | Entrega | Depende de |
| --- | --- | --- |
| ✅ [#34](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/34) | **Definições:** Laravel 13, vídeo, pagamento, quem recebe (e divisão com o instrutor), endereço, papéis, quem cadastra filiados — fechadas em 29/09/2026 (ver "Decisões da plataforma") | — |
| ✅ [#35](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/35) | Base: Laravel 13 + React/Vite + MySQL em `cursos-homolog.ib-to.org`, publicação sem SSH (Cron Job), CI | #34 |
| ✅ [#53](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/53) | **Três idiomas** em todas as telas (pt-BR padrão, inglês e espanhol), com seletor e escolha lembrada; vem antes do login para as telas já nascerem traduzidas | #35 |
| ✅ [#36](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/36) | Login e papéis: aluno, filiado, instrutor e administrador | #53 |
| ✅ [#37](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/37) | Filiados, equipes filiadas e anuidade (R$ 90 em 2027), dados sensíveis criptografados | #36 |
| ✅ [#38](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/38) | Landing page chamativa e catálogo (gratuito restrito, pago aberto, pago restrito) | #35 |
| ✅ [#39](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/39) | Cursos, módulos, aulas (vídeo incorporado) e apostilas na área restrita | #36 e #38 |
| ✅ [#40](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/40) | Filiado cria curso na sua área, com revisão do IBTO | #37 e #39 |
| ✅ [#41](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/41) | Matrícula com PIX manual, trava de vagas, cancelar sem apagar | #39 |
| [#42](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/42) | Gateway de pagamento e cobrança recorrente da anuidade | #34 e #41 |
| [#43](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/43) | Provas e progresso do aluno | #39 |
| ✅ [#44](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/44) | Certificados com validação pública | #43 |
| [#45](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/45) | Painel administrativo: cursos, matrículas (CSV), filiados, financeiro | #37 e #41 |
| [#46](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/46) | Validação pública da carteirinha (QR code) | #37 |
| [#47](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/47) | LGPD: política de privacidade, consentimento, registro de acesso, DPO | #36 |
| ✅ [#48](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/48) | Link da plataforma na página `/cursos` do site | #35 |
| ✅ [#52](https://github.com/atnzpe/Instituto-Brasileiro-de-Treinamento-Operacional/issues/52) | Página `/cursos` do site lista sozinha os cursos online **abertos ao público** vindos da plataforma (restritos e em revisão ficam de fora; se a plataforma cair, volta o aviso) | #38 e #48 |

### Primeiras tarefas da equipe

Cinco entregas pequenas para começar, com passo a passo em [docs/guia-primeiras-tarefas.md](./docs/guia-primeiras-tarefas.md). A Tarefa 1 informou a decisão da linha 3 acima: no plano compartilhado, Python só na versão 3.6 e sem Node (tabela oficial da HostGator).

| Tarefa | Issue / branch | Entrega | Responsável | Depende de |
| --- | --- | --- | --- | --- |
| 1 | ✅ Fechar o teste da HostGator (concluída em 26/09/2026: plano só tem Python 3.6, sem Node e sem SSH; decidido PHP + MySQL; limpeza feita; PHP 8.3 e MySQL 5.7.44 anotados) | Resultado anotado e aplicações de teste removidas | Gleyson | — |
| 2 | `feature/rede-nacional-dados` | Página `/rede-nacional` com os representantes reais | Gleyson | Dados e autorização do Eduardo |
| 3 | `feature/cursos-dados-atualizados` | Dados dos cursos confirmados (telefones, Bastão Tático, Sobrevivência Urbana) | Gleyson | `feature/cursos` mesclada e confirmações do Eduardo |
| 4 | Preparar ambiente local de PHP e Laravel (só na máquina, sem branch) | Laravel Herd instalado, PHP 8.3+, Composer e instalador do Laravel conferidos | Gleyson | — |
| 5 | Estudo: primeiro projeto Laravel com o kit React (fora do repositório) | Projeto de estudo rodando, com login e uma tabela de cursos | Gleyson | 4 |

Itens transversais, sem ordem fixa:

- [ ] Ampliar os testes automatizados: já existem testes de lógica (`bun run test`, desde o PR #12) rodando na CI; faltam testes de interface (telas, teclado, modal) — vale priorizar com a Aline
- [x] Instalar e autenticar o `gh` (GitHub CLI) no ambiente de desenvolvimento, para abrir e gerenciar PRs/issues diretamente
- [ ] Rodar uma nova auditoria de qualidade contra o site já publicado em homologação, para confirmar que os ganhos de performance realmente aparecem fora do ambiente local
- [ ] **Organizar o trabalho nas abas do GitHub** (ver "Como usar cada aba do GitHub" abaixo)
- [ ] Avaliar uma seção de "eventos realizados" (histórico com fotos, como prova de experiência), separada da lista de treinamentos abertos

## Como usar cada aba do GitHub

Todas as abas do repositório podem entrar no fluxo de trabalho. Algumas funções dependem do plano do GitHub (o repositório é privado); onde for o caso, está indicado.

| Aba | Para que vamos usar | Passo do fluxo |
| --- | --- | --- |
| **Code** | Código, README, ROADMAP e CLAUDE.md; proteger a `main` em Settings → Branches (exigir PR e o ✅ do Actions antes do merge) | Branch, Clean Up |
| **Issues** | Uma issue por tarefa, com critério de aceite; resultados dos testes e do teste humano comentados nela; modelos de issue (bug, tarefa) em `.github/ISSUE_TEMPLATE` | Issue, Documentar resultados, Teste humano |
| **Pull requests** | PR aberto como rascunho depois do push e marcado como pronto após o teste humano; `Closes #número` fecha a issue no merge; modelo de PR com checklist | PR pronta, Code Review, Merge |
| **Actions** | Integração contínua (lint, testes e build a cada push) e, depois, deploy automático por FTP na HostGator | Testes automatizados, Deploy automático |
| **Projects** | Quadro Kanban (A fazer, Em andamento, Teste humano, Revisão, Feito) com as issues do ROADMAP, para a Aline e o Eduardo acompanharem sem ler código | Próxima Issue/Branch |
| **Security and quality** | Alertas de dependências vulneráveis (Dependabot) e política de segurança (`SECURITY.md`). A análise automática de código (CodeQL) e a busca de senhas vazadas em repositório privado dependem do plano pago do GitHub | Code Review |
| **Insights** | Acompanhar atividade: commits, contribuidores, PRs e issues fechadas por período | Retrospectiva |
| **Agents** | Agentes de IA do GitHub (como o Copilot) trabalhando em issues; depende de assinatura do Copilot. Opcional: o time já usa o Claude Code | Opcional |

