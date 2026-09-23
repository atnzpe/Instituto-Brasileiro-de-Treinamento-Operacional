# Roadmap

Situação da reconstrução do site do IBTO, organizada em relação ao [QA_REPORT.html](./QA_REPORT.html) (auditoria do site antigo) e aos pedidos feitos ao longo do trabalho. Atualizado em 23/09/2026: inclui a página de Cursos e a proposta para a futura plataforma de cursos (backend, pagamento, filiados e painel administrativo).

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
- [x] Página `/cursos` (catálogo com modal de detalhes) — 8 cursos: 3 presenciais em Recife com data, horário, preço, instrutor, materiais inclusos e WhatsApp (Formação de Instrutores, Combate Corpo a Corpo e Combate com Faca) e 5 online; as três modalidades de acesso (gratuito e privado aos filiados / pago e aberto ao público / pago e restrito aos filiados) já existem como selos. Ainda é um catálogo de leitura: sem login, inscrição ou pagamento (ver Proposta)

## 🚧 Pendente — falta um dado, credencial ou decisão, não código

- [ ] **Chave de API da Resend** — o formulário de contato valida e avisa o erro corretamente, mas só vai enviar e-mail de verdade quando tivermos essa chave
- [ ] **E-mail definitivo de contato** — hoje está apontando para `eduars.lopes@gmail.com` como solução temporária; trocar para um `contato@ib-to.org` (ou similar) quando existir (o plano da HostGator permite criar caixas de e-mail sem limite)
- [ ] **Lista real da Rede Nacional** — nome, função, cidade/estado, telefone e foto (se tiver) de cada representante/instrutor/monitor, para popular a página `/rede-nacional`
- [ ] **Conferir os telefones dos cartazes** — os três cartazes de curso trazem números de WhatsApp diferentes entre si: o de Formação de Instrutores mostra (81) 99162-3046 e (81) 99809-8742; os de Combate Corpo a Corpo e Combate com Faca mostram 8191623046 (10 dígitos, faltando um) e 81990098742 (um dígito diferente no meio). O site usa os números do primeiro cartaz nos três cursos até a confirmação
- [ ] **Cursos online: modalidade e descrição** — dos 5 cursos online (Gestão de Risco Operacional, Cybersegurança Urbana, TCCC, Reconhecimento Aéreo, Introdução à Inteligência Operacional) só temos os nomes; falta dizer qual modalidade de acesso cada um usa, uma descrição curta e, se for o caso, preço e carga horária
- [ ] **Tirar os treinamentos do ar depois da data** — os três treinamentos presenciais são de 10 e 11 de outubro; depois disso alguém precisa removê-los (ou marcá-los como encerrados) manualmente. A plataforma da próxima fase deve fazer isso sozinha pelo status do curso
- [ ] **Hospedagem: confirmar o que o painel da HostGator libera** — ver a tabela em "Proposta"; falta olhar, no cPanel, se existe o ícone **Application Manager** (o nome certo da ferramenta de aplicações Node; antes procuramos por "Setup Node.js App", que não é o nome usado)
- [ ] **Erro 404 com status HTTP real** — a página já existe visualmente, mas o código de status `404` de verdade depende de uma configuração no servidor/CDN, a ser feita junto da publicação em homologação

## 🧭 Proposta — plataforma de cursos (aguarda aprovação de Eduardo e Aline)

Objetivo: cursos com as três modalidades de acesso, inscrição e pagamento, controle de filiados e painel administrativo, começando por um ambiente de homologação. A proposta abaixo vem de duas leituras: o que o plano atual da HostGator inclui e o que o DojoManager (o SaaS já em desenvolvimento pelo time) já resolve.

### O que o plano da HostGator inclui

Lido do backup do cPanel de 13/09/2026 (plano `P_100`); vale confirmar no painel.

| Recurso | O que o plano tem | O que isso significa para nós |
| --- | --- | --- |
| Subdomínios | ilimitados | Dá para criar `homolog.ib-to.org` sem custo extra |
| Bancos MySQL | ilimitados | Existe, mas exigiria construir do zero a nossa própria API, o login e as permissões (ver alternativa abaixo) |
| Disco e tráfego | cerca de 100 GB, sem limite de tráfego | Sobra para o site estático e as imagens |
| Domínios adicionais | 0 | Só `ib-to.org` e seus subdomínios |
| Aplicações Node/Python (Passenger) | até 4 | Em tese dá para rodar um servidor próprio, se a ferramenta estiver habilitada no painel; o nosso servidor atual é em Bun e teria de ser portado para Node |
| PHP | disponível (CGI desativado) | O `contact.php` funciona |
| Redis | não faz parte do plano | O cache do servidor atual já funciona sem ele |
| Caixas de e-mail | ilimitadas | Dá para criar `contato@ib-to.org` |

### Backend recomendado: reaproveitar a base do DojoManager (Supabase)

O DojoManager usa Supabase (banco Postgres, login, arquivos e funções de servidor, com regras de acesso dentro do próprio banco), React 19, Bun, Tailwind e Vercel — a mesma família de tecnologias do site do IBTO. Recomendamos usar o mesmo backend para a plataforma de cursos, por quatro motivos:

1. **Já existe e foi pensado para isso.** As migrations do DojoManager cobrem cursos com visibilidade pública/restrita, preço e vagas com trava contra lotação, inscrições, ligação com o financeiro, ouvidoria com protocolo e anonimato, certificados e controle de acesso por cargo.
2. **As três modalidades já cabem no modelo.** Cada curso tem `visibilidade` (Público/Restrito) e `valor` (vazio = gratuito). "Gratuito e privado aos filiados" = Restrito sem valor; "Pago e aberto ao público" = Público com valor; "Pago e restrito aos filiados" = Restrito com valor.
3. **A HostGator não precisa rodar servidor.** O site continua estático (na HostGator ou na Vercel) e conversa com o Supabase pela internet; isso resolve o impasse do Bun.
4. **Menos risco.** Login, permissões e pagamentos são as partes mais delicadas; construir isso sobre o MySQL da HostGator seria refazer o que o DojoManager já testou.

Pontos a confirmar antes de aprovar: o plano e o custo do Supabase para produção, e onde ficam os dados dos filiados (LGPD). A alternativa (MySQL da HostGator com API própria em PHP ou Node) funciona, mas custa mais tempo.

O que reaproveitar do DojoManager (arquivos em `database/`):

| Necessidade do IBTO | Base no DojoManager | Adaptação necessária |
| --- | --- | --- |
| Catálogo público/restrito com preço e vagas | `008_cursos`, `011_cursos_financeiro`, `012_cursos_whatsapp_e_vagas` | Trocar a hierarquia Confederação/Federação/Academia pela do IBTO (Rede Nacional) |
| Inscrição com trava de vagas | `009_cursos_inscricoes` | Hoje só o aluno logado se inscreve; curso público pago precisa aceitar visitante |
| Confirmação de pagamento | `011_cursos_financeiro` | É manual (gestor confirma e o comprovante vai por WhatsApp); não tem gateway |
| Controle de filiados e cargos | tabela `usuarios` e permissões por cargo | Definir o que é "filiado" no IBTO |
| Ouvidoria | `005_ouvidoria`, `006_ouvidoria_consulta_protocolo` | Complementa o formulário de contato com protocolo |
| Certificados | `019_certificados` | Emitir ao concluir o curso |
| Painel administrativo | telas `admin/tabs` (cursos, inscritos em CSV, financeiro) | Adaptar para os papéis do IBTO |

### Pagamento: decisão de Eduardo

O DojoManager **não** tem gateway de pagamento. Duas opções:

- **Manter o fluxo manual** (PIX e comprovante por WhatsApp, o gestor confirma no painel): custo zero e rápido de entregar, mas dá trabalho a cada inscrição.
- **Integrar um gateway** com PIX e cartão, confirmando a inscrição sozinho (o gateway avisa o sistema quando o pagamento cai). Candidatos a comparar: Asaas, Mercado Pago, Stripe e Pagar.me/Efí. Critérios: taxa por transação, PIX, cartão parcelado, recorrência (para a anuidade dos filiados) e ambiente de testes.

Sugestão: começar a homologação com o fluxo manual e integrar o gateway na fase seguinte, quando Eduardo escolher o provedor.

### Ambiente de homologação

- Endereço: `homolog.ib-to.org` (subdomínio criado no cPanel)
- Site: build estático publicado no subdomínio, como descrito no README
- Backend: um projeto Supabase separado do de produção
- Pagamento em modo de testes e e-mails de teste
- Ordem: sempre homologação primeiro, produção depois

### Decisões que dependem de vocês

1. Aprovar o backend (Supabase reaproveitando o DojoManager) ou preferir o MySQL da HostGator
2. Fluxo manual de pagamento agora, ou já escolher o gateway
3. Definir "filiado": quem é, como entra, se paga anuidade e como isso libera os cursos restritos
4. Onde publicar o site final: HostGator (estático, plano atual) ou Vercel
5. Quem administra a plataforma e com quais papéis

## 🔭 Próximos passos

Cada linha vira uma issue e uma branch, na ordem abaixo, seguindo o fluxo de trabalho do README.

| # | Issue / branch | Entrega | Depende de |
| --- | --- | --- | --- |
| 1 | `feature/cursos` (em andamento) | Catálogo público de cursos com modal | Teste humano |
| 2 | `feature/homologacao-hostgator` | Subdomínio `homolog.ib-to.org`, publicação do site estático e configuração do `contact.php` | Acesso ao cPanel |
| 3 | `feature/supabase-base` | Projeto Supabase de homologação com as migrations de cursos, inscrições e ouvidoria adaptadas | Decisão 1 |
| 4 | `feature/cursos-dinamicos` | A página `/cursos` passa a ler os cursos do banco (visão pública), com status e vagas automáticos | 3 |
| 5 | `feature/filiados-login` | Cadastro e login de filiado; acesso aos cursos restritos | Decisão 3 |
| 6 | `feature/painel-admin-cursos` | Cadastro e edição de cursos, lista de inscritos (CSV), confirmação de pagamento | 4 e 5 |
| 7 | `feature/inscricao-e-pagamento` | Inscrição de visitante e de filiado, com pagamento (manual e depois gateway) | Decisão 2 |
| 8 | `feature/ouvidoria` | Chamados com protocolo, complementando o formulário de contato | 3 |
| 9 | `feature/certificados` | Emissão de certificado ao concluir o curso | 6 |

Itens transversais, sem ordem fixa:

- [ ] Testes automatizados e integração contínua (hoje não existe nenhum teste automatizado no projeto — vale a pena priorizar isso com a Aline)
- [ ] Instalar e autenticar o `gh` (GitHub CLI) no ambiente de desenvolvimento, para abrir e gerenciar PRs/issues diretamente
- [ ] Rodar uma nova auditoria de qualidade contra o site já publicado em homologação, para confirmar que os ganhos de performance realmente aparecem fora do ambiente local
