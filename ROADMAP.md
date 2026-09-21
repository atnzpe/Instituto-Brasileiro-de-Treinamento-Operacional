# Roadmap

Situação da reconstrução do site do IBTO, organizada em relação ao [QA_REPORT.html](./QA_REPORT.html) (auditoria do site antigo) e aos pedidos feitos ao longo do trabalho. Atualizado após a branch `feature/landpage` ser mesclada na `main`, fechando a issue "Auditoria IB #1".

Legenda: **✅ Feito** já está em produção no código. **🚧 Pendente** é código pronto, esperando um dado ou credencial que só o time de negócio/infra tem. **🔭 Próximos passos** ainda não foi iniciado.

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

## 🚧 Pendente — falta um dado ou credencial, não código

- [ ] **Chave de API da Resend** — o formulário de contato valida e avisa o erro corretamente, mas só vai enviar e-mail de verdade quando tivermos essa chave
- [ ] **E-mail definitivo de contato** — hoje está apontando para `eduars.lopes@gmail.com` como solução temporária; trocar para um `contato@ib-to.org` (ou similar) quando existir
- [ ] **Lista real da Rede Nacional** — nome, função, cidade/estado, telefone e foto (se tiver) de cada representante/instrutor/monitor, para popular a página `/rede-nacional`
- [ ] **Decisão de hospedagem** — direção combinada: front-end na Vercel (cada branch já ganha uma URL de teste, servindo como homologação) + HostGator reservada para um futuro banco de dados. Falta: adaptar o envio de e-mail para rodar como função da Vercel (ou manter o plano B em PHP se a decisão for ficar só na HostGator), e liberar acesso remoto ao MySQL na HostGator quando o banco existir de fato
- [ ] **Erro 404 com status HTTP real** — a página já existe visualmente, mas o código de status `404` de verdade depende de uma configuração no servidor/CDN, a ser feita junto da decisão de hospedagem

## 🔭 Próximos passos

- [ ] Definir o que o banco de dados planejado vai guardar (conteúdo do site? lista da Rede Nacional? as duas coisas?) e desenhar isso antes de conectar o MySQL da HostGator
- [ ] Painel para editar o conteúdo do site sem precisar mexer em código, se for esse o objetivo
- [ ] Testes automatizados e integração contínua (hoje não existe nenhum teste automatizado no projeto — vale a pena priorizar isso com a Aline)
- [ ] Instalar e autenticar o `gh` (GitHub CLI) no ambiente de desenvolvimento, para abrir e gerenciar PRs/issues diretamente
- [ ] Rodar uma nova auditoria de qualidade contra o site já publicado (fora do ambiente local), para confirmar que os ganhos de performance realmente aparecem em produção
