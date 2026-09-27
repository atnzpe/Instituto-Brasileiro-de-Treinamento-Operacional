# Publicar a homologação na HostGator

Passo a passo para colocar o site em `https://homolog.ib-to.org`, protegido por senha, para o time testar antes da produção. Issue: #15.

## Como usar este guia

- Faça **uma parte por vez**, na ordem. Cada parte termina num ponto seguro.
- Nada aqui mexe no site atual em `ib-to.org`: tudo acontece numa pasta e num endereço separados.
- Travou? Mande o print ou a mensagem de erro para o Claude.

## O que você precisa

- Acesso ao cPanel da HostGator.
- O pacote gerado pelo Claude: `C:\workspace\ibto\deploy\ibto-homolog-<código>.zip` (o `<código>` identifica a versão do site que está no pacote).

---

## Parte A — Criar o subdomínio

- [ ] cPanel → **Domínios** → **Criar um Novo Domínio**.
- [ ] Domínio: `homolog.ib-to.org`.
- [ ] **Desmarque** "Share document root (/home1/edua1187/public_html) with ib-to.org". Marcada, o subdomínio mostraria o site atual, e essa escolha é **permanente**.
- [ ] Em "Document Root", deixe o que o cPanel sugere: `homolog.ib-to.org`.
- [ ] Clique em **Enviar**.

**Ponto seguro:** subdomínio criado.

## Parte B — Ligar o HTTPS

O site força HTTPS; sem certificado, o navegador mostra erro.

- [ ] cPanel → **SSL/TLS Status**.
- [ ] Procure `homolog.ib-to.org`. Se não tiver cadeado verde, marque-o e clique em **Run AutoSSL**.
- [ ] Espere o cadeado ficar verde (pode levar alguns minutos). Enquanto isso, siga para a Parte C.

## Parte C — Enviar o site

- [ ] cPanel → **Gerenciador de Arquivos**.
- [ ] No canto superior direito, **Configurações** → marque **"Mostrar arquivos ocultos (dotfiles)"** → Salvar. Sem isso, o `.htaccess` não aparece.
- [ ] Abra a pasta **`homolog.ib-to.org`** (na raiz da conta, ao lado de `public_html`).
- [ ] **Carregar** → escolha o arquivo `ibto-homolog-<código>.zip` → espere a barra chegar a 100% → volte para a pasta.
- [ ] Clique com o botão direito no `.zip` → **Extract** → confirme a pasta `/home1/edua1187/homolog.ib-to.org` → **Extract Files**.
- [ ] Confira que os arquivos ficaram **direto na pasta** (não dentro de uma subpasta): `.htaccess`, `index.html`, `assets`, `images`, `contact.php`, `config.example.php`, `robots.txt`, `sitemap.xml`, `llms.txt`, `favicon.ico`.
- [ ] Apague o `.zip` da pasta.

No primeiro envio do formulário, o `contact.php` cria sozinho a pasta oculta `.ibto-contact-limits` na raiz da conta (fora das pastas públicas). Ela guarda o limite de 5 mensagens por hora de cada visitante, só com um código embaralhado do IP (nunca o IP em si). Não apague essa pasta.

**Não crie o `config.php` agora.** Ele guarda a chave da Resend, que ainda não existe. Sem ele, o formulário de contato mostra uma mensagem de erro — é esperado.

**Ponto seguro:** site enviado.

## Parte D — Proteger com senha

A homologação é só para o time.

- [ ] cPanel → **Directory Privacy** (Privacidade do Diretório).
- [ ] Entre na pasta **`homolog.ib-to.org`** e clique em **Editar** (ou no nome da pasta).
- [ ] Marque **"Password protect this directory"**, nome: `Homologação IBTO` → **Salvar**.
- [ ] Em "Create User", crie o usuário `equipe` com uma **senha forte** (use o gerador do cPanel) → **Salvar**.
- [ ] Passe a senha para a Aline e o Eduardo por um canal privado. Não coloque a senha em issue, commit ou grupo aberto.

> **Atenção a cada nova publicação:** o Directory Privacy grava a proteção dentro do `.htaccess`. Quando um pacote novo for extraído, o `.htaccess` do pacote substitui o antigo e **a senha deixa de ser pedida**. Depois de toda atualização, repita esta Parte D (basta marcar de novo a proteção; o usuário continua existindo) e confira numa janela anônima.

**Ponto seguro:** homologação protegida.

## Parte E — Teste humano

Use o Chrome ou o Edge. Para ver os detalhes técnicos, abra as ferramentas do navegador com **F12**.

### Acesso e segurança

- [ ] Numa **janela anônima**, abra `https://homolog.ib-to.org`: o navegador pede usuário e senha; com eles, o site abre.
- [ ] Abra `http://homolog.ib-to.org` (sem o "s"): o endereço vira `https://` sozinho.
- [ ] Abra `https://homolog.ib-to.org/config.php` e `https://homolog.ib-to.org/config.example.php`: os dois dão **"Forbidden" (403)**.

### Páginas

- [ ] Abra, digitando no endereço, `/areas-de-atuacao`, `/quem-somos`, `/contato`, `/rede-nacional` e `/cursos`. Em cada uma, aperte **F5**: a página recarrega normalmente, sem erro.
- [ ] Abra `/services`: vai para `/areas-de-atuacao`.
- [ ] Abra `/pagina-que-nao-existe`: aparece a página **"não encontrada"** do site. No F12 → aba **Rede (Network)**, recarregue: a primeira linha mostra **status 404**.
- [ ] Em `/cursos`: selos de status, modal e botões de pré-inscrição funcionando.
- [ ] Widget **VLibras** (mãozinha azul na lateral) abre e traduz.
- [ ] Formulário de contato: ao enviar, aparece uma **mensagem de erro** (esperado, falta a chave da Resend).
- [ ] Envie o formulário **6 vezes seguidas**: da 6ª em diante aparece "Você enviou muitas mensagens em pouco tempo…" (limite anti-robô funcionando).
- [ ] A página `/contato` **não mostra** o e-mail do IBTO escrito (é de propósito: ele fica só no servidor).

### Cabeçalhos (F12 → Rede → clique na primeira linha → Cabeçalhos / Headers → "Cabeçalhos de resposta")

- [ ] Aparecem `strict-transport-security`, `x-content-type-options: nosniff`, `x-frame-options: DENY`, `referrer-policy`, `permissions-policy` e **`x-robots-tag: noindex, nofollow`**.

### Console (F12 → Console)

- [ ] Procure mensagens com **"Report Only"** ou **"Content Security Policy"**. Elas não quebram nada agora, mas mostram o que precisa ser liberado antes de ativar a política de conteúdo. Copie todas e mande para o Claude (ou cole na issue #15).

### Celular

- [ ] Abra a homologação no celular e percorra as páginas.

## Parte F — Registrar o resultado

- [ ] Comente na issue #15 o que passou e o que falhou (com print quando falhar) e as mensagens do Console.
- [ ] Se algo falhar, a correção volta para o código, sai um pacote novo e repetimos as Partes C, D e E.

---

## Atualizar a homologação depois

1. O Claude gera um pacote novo a partir da `main` (ou da branch em teste).
2. Parte C (enviar e extrair por cima, substituindo os arquivos).
3. **Parte D de novo** (a proteção por senha se perde a cada `.htaccess` novo).
4. Parte E.

O deploy automático (issue própria no ROADMAP) vai trocar esse processo manual.

## Como gerar o pacote (time técnico)

Na pasta do projeto, com a branch certa e sem alterações pendentes, no PowerShell:

```powershell
.\scripts\package-hostgator.ps1
```

O script confere que não há alterações sem commit, roda o build (que já usa o `.env.production`, apontando o formulário para o `contact.php`), garante que o `.htaccess` foi junto e que **nenhum `config.php`** (segredo) entrou, e grava `..\deploy\ibto-homolog-<código>.zip`.

Não use o `Compress-Archive` do PowerShell para isso: no Windows PowerShell 5.1 ele grava as pastas com barra invertida, e na HostGator os arquivos de `assets/` viram nomes quebrados em vez de uma pasta.
