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
- [ ] **E-mail definitivo de contato** — hoje está apontando para `eduars.lopes@gmail.com` como solução temporária; trocar para um `contato@ib-to.org` (ou similar) quando existir (o plano da HostGator permite criar caixas de e-mail sem limite)
- [ ] **Lista real da Rede Nacional** — nome, função, cidade/estado, telefone e foto (se tiver) de cada representante/instrutor/monitor, para popular a página `/rede-nacional`
- [ ] **Conferir os telefones dos cartazes** — os cartazes do Recife trazem números de WhatsApp diferentes entre si: o de Formação de Instrutores mostra (81) 99162-3046 e (81) 99809-8742; os de Combate Corpo a Corpo e Combate com Faca mostram 8191623046 (10 dígitos, faltando um) e 81990098742 (um dígito diferente no meio). O site usa os números do primeiro cartaz nos três cursos até a confirmação
- [ ] **Tirar os treinamentos do Recife do ar depois da data** — os três são de 10 e 11 de outubro; depois disso alguém precisa removê-los (ou marcá-los como encerrados) manualmente
- [ ] **Seminário Bastão Tático: confirmar dados atuais** — a data foi retirada porque o curso é dado sempre. O preço (R$ 150), o local (sede da FIGAM, em Caxias do Sul) e o WhatsApp (54) 99662-7066 vêm do cartaz da edição de 29/08/2026; se as próximas turmas forem em outro lugar ou com outro preço, atualizar. Também assumimos que é aberto ao público
- [ ] **Curso Sobrevivência Urbana Nível 1: dados que faltam** — data, local, preço, modalidade de acesso e um contato para inscrição (o cartaz não traz)
- [ ] **Encontro nacional** — previsto para depois, possivelmente em janeiro, sem data. Cadastrar na página de Cursos quando houver data
- [ ] **Endereço da plataforma de cursos online** — quando existir, preencher `onlinePlatform.href` em `shared/content.ts` e o botão "Acessar a plataforma de cursos" aparece no lugar do "Em breve"
- [ ] **Hospedagem: terminar de conferir no cPanel** — o **Application Manager existe e está habilitado** (confirmado em 23/09/2026, sem nenhuma aplicação registrada ainda). Pela documentação, o formulário "Register Application" não tem uma lista de linguagens: o Node só funciona se a HostGator instalou os pacotes `ea-nodejs` (versões 16, 18, 20 ou 22, e só uma delas por vez). O jeito de confirmar é registrar um aplicativo mínimo de teste (`app.js`) num subdomínio e ver se responde. Falta também conferir a versão do PHP e se há acesso por terminal (SSH) e Composer
- [ ] **Erro 404 com status HTTP real e abrir rotas direto** — no servidor Apache da HostGator, abrir `/cursos` diretamente ou atualizar a página dá erro 404, porque as rotas existem só no navegador. A correção é um arquivo `.htaccess` que manda as rotas conhecidas para o `index.html` e devolve 404 de verdade para o resto; entra na issue de homologação

## 🧭 Proposta — homologação e plataforma de cursos online (aguarda aprovação de Eduardo e Aline)

### Decisões já tomadas

- **Cursos presenciais ficam no site oficial** (ib-to.org), na página `/cursos`.
- **Cursos online terão uma plataforma à parte** (decisão do Eduardo, 23/09/2026): layout totalmente diferente do site, mais tecnológico, mais fácil de organizar e mais personalizável, seguindo os modelos Solyd, Resend e Dankicode. O site do IBTO terá apenas um link para ela.
- **Toda a estrutura da HostGator será usada**, no frontend e no backend, inclusive para homologação.
- **O DojoManager é só referência de lógica.** É outro projeto, sem relação com o IBTO: a infraestrutura, o banco e o código dele não serão usados aqui; serve apenas para consultar como certas regras de negócio foram pensadas.

### O que o plano da HostGator inclui

Lido do backup do cPanel de 13/09/2026 (plano `P_100`); vale confirmar no painel.

| Recurso | O que o plano tem | O que isso significa para nós |
| --- | --- | --- |
| Subdomínios | ilimitados | Dá para criar `homolog.ib-to.org` (site) e um endereço para a plataforma de cursos, sem custo extra |
| Bancos MySQL | ilimitados | É o banco de dados natural da plataforma |
| Disco e tráfego | cerca de 100 GB, sem limite declarado de tráfego | Sobra para o site e as imagens; não serve para hospedar vídeo das aulas (ver abaixo) |
| Domínios adicionais | 0 | Só `ib-to.org` e seus subdomínios |
| Aplicações Node/Python (Passenger) | até 4 | Em tese dá para rodar um servidor Node, se a ferramenta estiver habilitada no painel |
| PHP | disponível (CGI desativado) | O `contact.php` funciona e o backend pode ser em PHP |
| Redis | não faz parte do plano | O cache do servidor atual já funciona sem ele |
| Caixas de e-mail | ilimitadas | Dá para criar `contato@ib-to.org` |

### Como publicar o site em homologação

- Endereço: `homolog.ib-to.org`, criado no cPanel (Domínios).
- Sobe-se apenas o conteúdo de `dist/` (resultado de `bun run build`). A pasta `public/` não é enviada: o Vite copia o conteúdo dela para dentro de `dist/`, e é assim que `contact.php`, `robots.txt`, `sitemap.xml` e as imagens chegam ao servidor. O Bun só é necessário na máquina de quem gera o build, não na HostGator.
- Falta criar um `.htaccess` (ver Pendente) para as rotas e o 404 de verdade.
- Copiar `config.example.php` para `config.php` no servidor e preencher a chave da Resend.
- Conferir se o HTTPS está ativo no subdomínio.

### Plataforma de cursos online: onde e com quê

- **Endereço:** um subdomínio próprio (sugestão `cursos.ib-to.org`, com `cursos-homolog.ib-to.org` para testes).
- **Projeto separado**, com repositório próprio, para o layout e a evolução independentes do site institucional.
- **Backend na HostGator**, com duas opções:

| Opção | Como funciona | Vantagem | Ponto de atenção |
| --- | --- | --- | --- |
| A. PHP + MySQL | API e painel em PHP, dados no MySQL | Sempre disponível no plano; o `contact.php` já é um primeiro exemplo | Depende de o time trabalhar com PHP e de haver Composer/SSH para um framework |
| B. Node.js + MySQL | Servidor Node pelo Application Manager, dados no MySQL | Mesma linguagem (TypeScript) do site | Depende de a HostGator ter instalado o Node (`ea-nodejs`), a confirmar com um aplicativo de teste (o Application Manager já existe); o servidor atual é em Bun e precisaria ser portado para Node; recursos limitados de hospedagem compartilhada |

  Recomendação: o Application Manager já existe no painel; se o aplicativo mínimo de teste rodar em uma versão moderna do Node (18, 20 ou 22), a opção B; se não rodar, a opção A.
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

### Decisões que dependem de vocês

1. Backend da plataforma: Node (se o Application Manager existir) ou PHP
2. Vídeo das aulas: serviço externo incorporado ou outra solução
3. Pagamento: fluxo manual agora ou já escolher o gateway
4. Definir "filiado": quem é, como entra, se paga anuidade e como isso libera os cursos restritos
5. Endereço final da plataforma (sugestão: `cursos.ib-to.org`)
6. Quem administra a plataforma e com quais papéis

## 🔭 Próximos passos

Cada linha vira uma issue e uma branch, na ordem abaixo, seguindo o fluxo de trabalho do README.

| # | Issue / branch | Entrega | Depende de |
| --- | --- | --- | --- |
| 1 | `feature/cursos` (em andamento) | Grade de treinamentos presenciais com modal e aviso da plataforma online | Teste humano |
| 2 | `feature/homologacao-hostgator` | `homolog.ib-to.org` com o site publicado, `.htaccess` (rotas e 404 de verdade), `contact.php` configurado e HTTPS conferido | Acesso ao cPanel |
| 3 | `docs/plataforma-cursos-definicao` | Registrar a stack do backend (Node ou PHP), o vídeo, o gateway e o repositório da plataforma, depois de olhar o cPanel | Decisões 1 a 3 |
| 4 | `feature/plataforma-base` | Projeto novo em subdomínio de testes: layout tecnológico, catálogo de cursos e banco MySQL | 3 |
| 5 | `feature/plataforma-filiados` | Cadastro e login; modalidades e acesso restrito | Decisão 4 |
| 6 | `feature/plataforma-admin` | Painel: cursos, aulas, inscritos (CSV) e filiados | 4 e 5 |
| 7 | `feature/plataforma-matricula-pagamento` | Matrícula com pagamento (manual e depois gateway) | Decisão 3 |
| 8 | `feature/ouvidoria` | Chamados com protocolo no site institucional (PHP e MySQL da HostGator), complementando o formulário de contato | 2 |
| 9 | `feature/certificados` | Emissão de certificado ao concluir o curso | 6 |
| 10 | `feature/link-plataforma-no-site` | Preencher o endereço da plataforma para o botão aparecer na página de Cursos | 4 |

Itens transversais, sem ordem fixa:

- [ ] Testes automatizados e integração contínua (hoje não existe nenhum teste automatizado no projeto — vale a pena priorizar isso com a Aline)
- [ ] Instalar e autenticar o `gh` (GitHub CLI) no ambiente de desenvolvimento, para abrir e gerenciar PRs/issues diretamente
- [ ] Rodar uma nova auditoria de qualidade contra o site já publicado em homologação, para confirmar que os ganhos de performance realmente aparecem fora do ambiente local
- [ ] Avaliar uma seção de "eventos realizados" (histórico com fotos, como prova de experiência), separada da lista de treinamentos abertos
