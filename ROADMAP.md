# Roadmap

Situação da reconstrução do site do IBTO, organizada em relação ao [QA_REPORT.html](./QA_REPORT.html) (auditoria do site antigo) e aos pedidos feitos ao longo do trabalho. Atualizado em 23/09/2026: inclui a página de Cursos presenciais e a proposta para a homologação e para a plataforma de cursos online, que será um projeto à parte.

Legenda: **✅ Feito** já está no código. **🚧 Pendente** é código pronto, esperando um dado, credencial ou decisão do time de negócio/infra. **🧭 Proposta** é uma recomendação técnica que precisa de aprovação. **🔭 Próximos passos** são as próximas issues/branches, na ordem em que devem ser feitas (o caminho de cada uma está no [fluxo de trabalho do README](./README.md#fluxo-de-trabalho)).

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

- [x] Formulário de contato de verdade (validado no navegador e no servidor), envia e-mail pela Resend, com uma versão em PHP como plano B para hospedagens sem suporte a Bun/Node
- [x] Título e descrição próprios por página nos resultados de busca (antes, toda página mostrava a mesma descrição genérica)
- [x] Dados estruturados para buscadores e IAs (JSON-LD, `llms.txt`, `robots.txt`)
- [x] Widget oficial do governo (VLibras) para tradução em Libras, em todas as páginas
- [x] Página `/rede-nacional` criada (diretório de representantes/instrutores, no formato usado pela WKMF) — pronta para exibir dados reais, hoje vazia
- [x] Página `/cursos` (grade com modal de detalhes) com os 5 treinamentos presenciais: Formação de Instrutores, Combate Corpo a Corpo e Combate com Faca (10 e 11 de outubro, em Recife), Seminário Bastão Tático (sem data fixa, pois é dado sempre) e Curso Sobrevivência Urbana Nível 1 (sem data ainda). Cada modal mostra o que houver de datas, local, preço, instrutor, carga horária, conteúdo, materiais inclusos e WhatsApp. Os cursos online aparecem só como um aviso "em breve" da plataforma própria (decisão do Eduardo, ver Proposta)

## 🚧 Pendente — falta um dado, credencial ou decisão, não código

- [ ] **Chave de API da Resend** — o formulário de contato valida e avisa o erro corretamente, mas só vai enviar e-mail de verdade quando tivermos essa chave
- [x] **E-mail definitivo de contato** — o formulário de contato envia para `comando.ibto@gmail.com`, e-mail oficial do IBTO
- [ ] **Lista real da Rede Nacional** — nome, função, cidade/estado, telefone e foto (se tiver) de cada representante/instrutor/monitor, para popular a página `/rede-nacional`
- [ ] **Conferir os telefones dos cartazes** — os cartazes do Recife trazem números de WhatsApp diferentes entre si: o de Formação de Instrutores mostra (81) 99162-3046 e (81) 99809-8742; os de Combate Corpo a Corpo e Combate com Faca mostram 8191623046 (10 dígitos, faltando um) e 81990098742 (um dígito diferente no meio). O site usa os números do primeiro cartaz nos três cursos até a confirmação
- [ ] **Tirar os treinamentos do Recife do ar depois da data** — os três são de 10 e 11 de outubro; depois disso alguém precisa removê-los (ou marcá-los como encerrados) manualmente
- [ ] **Seminário Bastão Tático: confirmar dados atuais** — a data foi retirada porque o curso é dado sempre. O preço (R$ 150), o local (sede da FIGAM, em Caxias do Sul) e o WhatsApp (54) 99662-7066 vêm do cartaz da edição de 29/08/2026; se as próximas turmas forem em outro lugar ou com outro preço, atualizar. Também assumimos que é aberto ao público
- [ ] **Curso Sobrevivência Urbana Nível 1: dados que faltam** — data, local, preço, modalidade de acesso e um contato para inscrição (o cartaz não traz)
- [ ] **Encontro nacional** — previsto para depois, possivelmente em janeiro, sem data. Cadastrar na página de Cursos quando houver data
- [ ] **Endereço da plataforma de cursos online** — quando existir, preencher `onlinePlatform.href` em `shared/content.ts` e o botão "Acessar a plataforma de cursos" aparece no lugar do "Em breve"
- [ ] **Hospedagem: terminar de conferir no cPanel** — o **Application Manager existe e está habilitado** (confirmado em 23/09/2026, sem nenhuma aplicação registrada ainda). Pela documentação, o formulário "Register Application" não tem uma lista de linguagens, então o jeito de confirmar é registrar um aplicativo mínimo de teste num subdomínio e ver se responde. Vamos testar primeiro o **Python** (`passenger_wsgi.py`, que usa o Python do servidor) e só testar o Node (`app.js`, que depende dos pacotes `ea-nodejs`) se o Python falhar. **Resultado em 26/09/2026:** a aplicação `teste-python` foi registrada corretamente, mas o endereço devolve 403 e o log do Apache mostra `AH01276: Cannot serve directory /home1/edua1187/teste-python.ib-to.org/` — o servidor entrega a pasta vazia do subdomínio e o Passenger nunca chega a iniciar a aplicação (nem a pasta `logs` dela foi criada). **Resposta do suporte e tabela oficial de compatibilidades da HostGator (26/09/2026):** o atendimento não conseguiu confirmar o Passenger e indicou abrir chamado técnico; a [tabela de compatibilidades](https://suporte.hostgator.com.br/hc/pt-br/articles/30811116692115-Quais-s%C3%A3o-as-compatibilidades-da-HostGator) diz que, nos planos compartilhados (Start, P, M, Turbo, Plus e Revenda), o Python fica **limitado à versão 3.6** e o Django **até a 3.2** (ambos sem atualizações de segurança desde 2021 e 2024), e que **Node.js e SSH não são suportados**; versões modernas de Python, Node e SSH existem só em VPS ou servidor dedicado. Ver a decisão de backend em "Proposta"
- [ ] **Erro 404 com status HTTP real e abrir rotas direto** — no servidor Apache da HostGator, abrir `/cursos` diretamente ou atualizar a página dá erro 404, porque as rotas existem só no navegador. A correção é um arquivo `.htaccess` que manda as rotas conhecidas para o `index.html` e devolve 404 de verdade para o resto; entra na issue de homologação

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
| PHP | 8.2, 8.3, 8.4 e 8.5 (tabela oficial) | Versões atuais e com suporte; o `contact.php` já funciona e o backend pode ser em PHP |
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
- Sobe-se apenas o conteúdo de `dist/` (resultado de `bun run build`). A pasta `public/` não é enviada: o Vite copia o conteúdo dela para dentro de `dist/`, e é assim que `contact.php`, `robots.txt`, `sitemap.xml` e as imagens chegam ao servidor. O Bun só é necessário na máquina de quem gera o build, não na HostGator.
- Como enviar o `dist/`, do mais simples ao mais automático:
  1. **Gerenciador de Arquivos**: compactar o `dist/` em `.zip`, carregar e extrair na pasta do subdomínio. Bom para a primeira publicação.
  2. **FTP**: um programa como o FileZilla envia a pasta inteira; dá para criar uma conta FTP só para isso em "FTP Accounts".
  3. **Git Version Control**: o servidor puxa o repositório do GitHub e um `.cpanel.yml` copia os arquivos para o site. Como o servidor não roda o build, o `dist/` gerado teria de ser versionado numa branch só de publicação. Fica para depois que a homologação estiver funcionando.
- Falta criar um `.htaccess` (ver Pendente) para as rotas e o 404 de verdade.
- Copiar `config.example.php` para `config.php` no servidor e preencher a chave da Resend.
- Conferir se o HTTPS está ativo no subdomínio.

### Plataforma de cursos online: onde e com quê

- **Endereço:** um subdomínio próprio (sugestão `cursos.ib-to.org`, com `cursos-homolog.ib-to.org` para testes).
- **Projeto separado**, com repositório próprio, para o layout e a evolução independentes do site institucional.
- **Backend**: ✅ **decidido em 26/09/2026 — opção A (PHP + MySQL no plano atual).** A preferência inicial do time era Python, mas a tabela oficial da HostGator mudou o quadro. As opções avaliadas, para registro:

| Opção | Como funciona | Custo | Vantagem | Ponto de atenção |
| --- | --- | --- | --- | --- |
| **A. PHP + MySQL no plano atual (recomendada)** | API e painel em PHP 8.2+, dados no MySQL, tudo na hospedagem que já é paga | Nenhum extra | Versões atuais e com suporte; roda hoje (o `contact.php` já prova); cron e MySQL inclusos | Mais uma linguagem para o time aprender (PHP também é considerado amigável para iniciantes). Sem SSH, as bibliotecas do backend são instaladas na nossa máquina e enviadas prontas |
| B. Python moderno + MySQL em VPS | Contratar VPS na HostGator: Python e Django atuais, SSH e Node disponíveis | Mensalidade maior (consultar a HostGator) | Linguagem preferida do time; Django traz painel admin, login e controle de usuários prontos | Custo, e o VPS exige cuidar do servidor (atualizações e segurança) |
| Não recomendada | Python 3.6 / Django 3.2 no plano atual | Nenhum extra | — | Ambos sem atualizações de segurança há anos; inaceitável para uma plataforma com login, dados de filiados e pagamento. Além disso, o teste nem chegou a rodar |

Node.js fica descartado no plano atual (não suportado).

Em qualquer caso, o layout da plataforma continua em React + Vite, publicado como arquivos estáticos; só a API muda de linguagem.

- **Vídeo das aulas:** não é recomendável hospedar arquivos de vídeo numa hospedagem compartilhada (gastam muito tráfego e processamento). O caminho comum é incorporar vídeos de um serviço próprio para isso (por exemplo YouTube não listado ou Vimeo); é uma decisão de Eduardo.
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

Sugestão: começar a homologação com o fluxo manual e integrar o gateway em seguida, quando o provedor for escolhido.

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

### Decisões que dependem de vocês

1. ~~Backend da plataforma~~ — decidido: PHP + MySQL no plano atual (26/09/2026). Forma de organizar o PHP: **recomendado Laravel 13** (exige PHP 8.3+; segurança por padrão, padrão de mercado; comparação em [docs/guia-primeiras-tarefas.md](./docs/guia-primeiras-tarefas.md#laravel-ou-php-simples)), aguardando confirmação
2. Vídeo das aulas: serviço externo incorporado ou outra solução
3. Pagamento: fluxo manual agora ou já escolher o gateway
4. Definir "filiado": quem é, como entra, se paga anuidade e como isso libera os cursos restritos
5. Endereço final da plataforma (sugestão: `cursos.ib-to.org`)
6. Quem administra a plataforma e com quais papéis
7. Filiados e LGPD: o que pode ser público sobre cada filiado (ver "Filiados, carteirinha e LGPD" abaixo)

## 🔭 Próximos passos

Cada linha vira uma issue e uma branch, na ordem abaixo, seguindo o fluxo de trabalho do README.

| # | Issue / branch | Entrega | Depende de |
| --- | --- | --- | --- |
| 1 | `feature/cursos` — ✅ teste humano aprovado e code review feito em 26/09/2026 (PR #6, fecha a issue #5); aguardando merge | Grade de treinamentos presenciais com modal e aviso da plataforma online | Merge |
| 1b | ✅ `chore/github-actions-ci` — issue [#13](https://github.com/Al1nex/Instituto-Brasileiro-de-Treinamento-Operacional/issues/13), mesclada em 27/09/2026 (PR #14) | Integração contínua na aba **Actions**: a cada push, roda `bun install`, `bun run lint`, `bun run test` e `bun run build` e mostra ✅/❌ na branch e no PR; `.gitattributes` padroniza o fim de linha | — |
| 1c | ✅ `fix/cursos-treinamentos-passados` — issue [#8](https://github.com/Al1nex/Instituto-Brasileiro-de-Treinamento-Operacional/issues/8), mesclada em 27/09/2026 (PR #12) | Treinamento passado aparece como "Encerrado", sem preço nem botão, sozinho depois da data; botões de "Pré-inscrição"; primeiro teste automatizado | — |
| 1d | `feature/safe-area` — issue [#10](https://github.com/Al1nex/Instituto-Brasileiro-de-Treinamento-Operacional/issues/10) | Safe Area em todas as páginas: `viewport-fit=cover` e espaçamentos `env(safe-area-inset-*)` no header, rodapé, menu mobile, modal, conteúdo e VLibras, com utilitários reutilizáveis | — |
| 1e | `feature/offline-first-pwa` — issue [#9](https://github.com/Al1nex/Instituto-Brasileiro-de-Treinamento-Operacional/issues/9) | Site abre sem internet depois da primeira visita e pode ser instalado no celular (PWA), com aviso claro no formulário de contato offline | 1d e 2 (service worker exige HTTPS) |
| 2 | `feature/homologacao-hostgator` — issue [#15](https://github.com/Al1nex/Instituto-Brasileiro-de-Treinamento-Operacional/issues/15) (em andamento) | Primeiro deploy: `homolog.ib-to.org` protegido por senha, com `.htaccess` (HTTPS, rotas, 404 de verdade, segurança, `noindex`), guia `docs/deploy-homologacao.md` e pacote `.zip`; `config.php` só quando houver a chave da Resend | Acesso ao cPanel |
| 3 | `docs/plataforma-cursos-definicao` | Confirmar o Laravel 13 como estrutura do backend PHP (recomendado; publicação sem SSH descrita no guia), o vídeo, o gateway e o repositório da plataforma | Decisões 2 e 3 |
| 4 | `feature/plataforma-base` | Projeto novo em subdomínio de testes: layout tecnológico, catálogo de cursos e banco MySQL | 3 |
| 5 | `feature/plataforma-filiados` | Cadastro e login; modalidades e acesso restrito | Decisão 4 |
| 6 | `feature/plataforma-admin` | Painel: cursos, aulas, inscritos (CSV) e filiados | 4 e 5 |
| 7 | `feature/plataforma-matricula-pagamento` | Matrícula com pagamento (manual e depois gateway) | Decisão 3 |
| 8 | `feature/ouvidoria` | Chamados com protocolo no site institucional (PHP e MySQL da HostGator), complementando o formulário de contato | 2 |
| 9 | `feature/certificados` | Emissão de certificado ao concluir o curso | 6 |
| 10 | `feature/link-plataforma-no-site` | Preencher o endereço da plataforma para o botão aparecer na página de Cursos | 4 |
| 11 | `chore/deploy-automatico` | Deploy automático pela aba **Actions**: a cada merge na `main`, gerar o build e enviar o `dist/` por FTP para a HostGator (primeiro para homologação), com usuário e senha FTP guardados nos segredos do repositório | 1b e 2 |
| 12 | `feature/validacao-carteirinha` | Página pública de validação da carteirinha (aberta pelo QR code), mostrando só registro, status/validade, categoria, área, nível e nome abreviado; política de privacidade publicada | 4, 5 e decisão 7 |

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
- [ ] Instalar e autenticar o `gh` (GitHub CLI) no ambiente de desenvolvimento, para abrir e gerenciar PRs/issues diretamente
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

