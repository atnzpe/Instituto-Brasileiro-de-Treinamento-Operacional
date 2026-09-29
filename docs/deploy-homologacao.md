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
- [ ] Confira que os arquivos ficaram **direto na pasta** (não dentro de uma subpasta): `.htaccess`, `index.html`, `assets`, `images`, `mensagem.php`, `config.example.php`, `robots.txt`, `sitemap.xml`, `llms.txt`, `favicon.ico`.
- [ ] Apague o `.zip` da pasta.
- [ ] Se existir um `contact.php` (nome antigo do formulário), apague. O formulário agora é o `mensagem.php`: a proteção anti-robô da HostGator barra envios para `contact.php` com erro 409.

No primeiro envio do formulário, o `mensagem.php` cria sozinho a pasta oculta `.ibto-contact-limits` na raiz da conta (fora das pastas públicas). Ela guarda o limite de 5 mensagens por hora de cada visitante, só com um código embaralhado do IP (nunca o IP em si). Não apague essa pasta.

**O `config.php` é opcional.** O formulário envia pelo `mail()` do PHP da HostGator, de `comando.ibto@ib-to.org` para `comando.ibto@gmail.com`, sem chave nenhuma. Só crie o `config.php` (a partir do `config.example.php`) se precisar trocar esses endereços.

Para o e-mail chegar na **caixa de entrada** (e não no spam), faça uma vez no cPanel:

- [ ] **E-mail Accounts** → crie a caixa `comando.ibto@ib-to.org` (senha forte, guardada fora do repositório). Ela é o remetente do formulário.
- [ ] **Email Deliverability** → o domínio `ib-to.org` deve mostrar **SPF** e **DKIM** como "Valid". Se aparecer "Problems Exist", clique em **Repair**.

**Ponto seguro:** site enviado.

## Parte D — Proteger com senha

A homologação é só para o time. O `.htaccess` do pacote **já pede a senha** (só em `homolog.ib-to.org` e só depois de passar para HTTPS, para a senha nunca viajar sem criptografia). O cPanel só guarda o usuário e a senha. Esta parte é feita **uma vez**.

- [ ] cPanel → **Directory Privacy** (Privacidade do Diretório) → entre na pasta **`homolog.ib-to.org`**.
- [ ] Em "Create User", crie o usuário `equipe` com uma **senha forte** (use o gerador do cPanel) → **Salvar**. Se ele já existe, pule.
- [ ] **Não clique em Salvar** em "Password protect this directory", nem para marcar nem para desmarcar. Ao salvar ali, o cPanel **apaga as linhas de senha do nosso `.htaccess`** e cola o bloco dele no final, que pede a senha antes do HTTPS. Se isso acontecer, extraia o pacote de novo por cima (Parte C) ou rode o deploy automático: o `.htaccess` volta ao certo.
- [ ] Confira que o arquivo de senhas está onde o `.htaccess` procura: no Gerenciador de Arquivos, na raiz da conta, existe `.htpasswds/homolog.ib-to.org/passwd`. Se o caminho for outro, avise o Claude antes de seguir (o site daria "Internal Server Error").
- [ ] Passe a senha para a Aline e o Eduardo por um canal privado. Não coloque a senha em issue, commit ou grupo aberto.

**Confira** numa janela anônima:

- [ ] `http://homolog.ib-to.org` (sem "s"): vai direto para `https://` **sem** pedir senha antes.
- [ ] Já em `https://`, o navegador pede usuário e senha; com eles, o site abre.

**Ponto seguro:** homologação protegida.

## Parte E — Teste humano

Use o Chrome ou o Edge. Para ver os detalhes técnicos, abra as ferramentas do navegador com **F12**.

### Acesso e segurança

- [ ] Numa **janela anônima**, abra `https://homolog.ib-to.org`: o navegador pede usuário e senha; com eles, o site abre.
- [ ] Abra `http://homolog.ib-to.org` (sem o "s"): o endereço vira `https://` sozinho, **antes** de pedir a senha.
- [ ] Abra `https://homolog.ib-to.org/config.php` e `https://homolog.ib-to.org/config.example.php`: os dois dão **"Forbidden" (403)**.

### Páginas

- [ ] Abra, digitando no endereço, `/areas-de-atuacao`, `/quem-somos`, `/contato`, `/rede-nacional` e `/cursos`. Em cada uma, aperte **F5**: a página recarrega normalmente, sem erro.
- [ ] Abra `/services`: vai para `/areas-de-atuacao`.
- [ ] Abra `/pagina-que-nao-existe`: aparece a página **"não encontrada"** do site. No F12 → aba **Rede (Network)**, recarregue: a primeira linha mostra **status 404**.
- [ ] Em `/cursos`: selos de status, modal e botões de pré-inscrição funcionando.
- [ ] Widget **VLibras** (mãozinha azul na lateral) abre e traduz.
- [ ] Formulário de contato: ao enviar, aparece a confirmação de envio e a mensagem chega em `comando.ibto@gmail.com` na **caixa de entrada** (confira também o spam). O remetente é "IBTO — Ouvidoria", e **Responder** vai para o e-mail digitado no formulário. Se aparecer erro com `código: EMAIL_NAO_ENVIADO`, o servidor de e-mail recusou: veja cPanel → **Erros** e avise o Gleyson.
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

Com o deploy automático configurado (abaixo), não há passo manual: cada merge na `main` publica sozinho. Para testar uma branch antes do merge: GitHub → aba **Actions** → **Deploy homologação** → **Run workflow** → escolha a branch → **Run workflow**. Depois, Parte E.

Sem o deploy automático (plano B): o Claude gera o pacote, você faz a Parte C e depois a Parte E. A senha continua valendo sozinha; não precisa refazer a Parte D.

## Deploy automático (configurar uma vez)

O GitHub Actions gera o site e envia para `homolog.ib-to.org` por **FTPS** (FTP criptografado). A conta de FTP enxerga **só** a pasta da homologação, então nem por erro ela mexe no site atual em `public_html`. A produção não é publicada por aqui.

### 1. Conta de FTP só da homologação (cPanel)

- [ ] cPanel → **Contas FTP** (FTP Accounts) → **Adicionar conta FTP**.
- [ ] Login: `deploy-homolog` (domínio `ib-to.org`).
- [ ] Senha: use o **gerador** do cPanel (senha forte). Guarde para o passo 2; não mande por chat, issue ou WhatsApp.
- [ ] **Diretório: `homolog.ib-to.org`**. Confira antes de salvar: o cPanel às vezes sugere `public_html/deploy-homolog`, e aí o deploy iria para o lugar errado.
- [ ] Cota: ilimitada → **Criar conta FTP**.
- [ ] Na lista, na linha da conta nova, clique em **Configurar cliente FTP** e anote o **usuário completo** (`deploy-homolog@homolog.ib-to.org`: o cPanel usa o domínio da pasta escolhida). O servidor FTP **não** é o `ftp.ib-to.org` que o cPanel sugere: o certificado da HostGator só vale para o nome do servidor, que no nosso plano é **`br1098.hostgator.com.br`** (aparece no cPanel em "Informações gerais" → "Nome do servidor").

### 2. Guardar o acesso no GitHub (sem aparecer no código)

- [ ] No repositório: **Settings** → **Environments** → **New environment** → nome `homologacao` → **Configure environment**.
- [ ] Em **Environment secrets** → **Add environment secret**, crie os três:

| Nome | Valor |
|---|---|
| `FTP_SERVER` | `br1098.hostgator.com.br` |
| `FTP_USERNAME` | o usuário completo (`deploy-homolog@homolog.ib-to.org`: o cPanel usa o domínio da pasta escolhida) |
| `FTP_PASSWORD` | a senha da conta FTP |

Depois de salvo, nem você nem ninguém consegue ler o valor de volta no GitHub, só trocar.

### 3. Primeiro deploy

- [ ] GitHub → **Actions** → **Deploy homologação** → **Run workflow** → branch em teste → **Run workflow**. O botão só aparece quando o `deploy.yml` já está na `main`; o primeiro deploy (#15) usou, por isso, um gatilho temporário de push na própria branch.
- [ ] Os dois passos ficam verdes. O último confere sozinho que `https://` pede a senha e que `http://` vai para `https://`.
- [ ] Se o passo "Enviar por FTPS" falhar com erro de **certificado**, mande a mensagem para o Claude: o endereço do servidor FTP precisa ser o que o certificado da HostGator cobre.
- [ ] Faça a Parte E.

O deploy nunca envia nem apaga o `config.php` do servidor. Ele guarda na pasta um arquivo `.ftp-deploy-sync-state.json` (a lista do que já foi enviado, para mandar só o que mudou), bloqueado para a internet pelo `.htaccess`.

## Como gerar o pacote (time técnico)

Na pasta do projeto, com a branch certa e sem alterações pendentes, no PowerShell:

```powershell
.\scripts\package-hostgator.ps1
```

O script confere que não há alterações sem commit, roda o build (que já usa o `.env.production`, apontando o formulário para o `mensagem.php`), garante que o `.htaccess` foi junto e que **nenhum `config.php`** (segredo) entrou, e grava `..\deploy\ibto-homolog-<código>.zip`.

Não use o `Compress-Archive` do PowerShell para isso: no Windows PowerShell 5.1 ele grava as pastas com barra invertida, e na HostGator os arquivos de `assets/` viram nomes quebrados em vez de uma pasta.
