# Guia das primeiras tarefas

Para quem está chegando no projeto. São cinco entregas, das mais simples às que preparam o backend:

1. Fechar o teste da HostGator (limpeza e versão do PHP)
2. Preencher a Rede Nacional
3. Atualizar os dados dos cursos
4. Preparar a sua máquina para PHP e Laravel
5. Primeiro projeto de estudo em Laravel

**Stack decidida em 26/09/2026:** o site e o layout da plataforma continuam em **React + Vite + Bun**. O backend da plataforma de cursos será em **PHP com Laravel e MySQL**, no plano atual da HostGator. A seção [Laravel ou PHP simples?](#laravel-ou-php-simples) explica o porquê.

## Como usar este guia

- Faça **um passo por vez** e marque `[x]` quando terminar.
- Todo passo termina num **ponto seguro**: você pode parar ali e continuar outro dia.
- Testar e editar na sua máquina **não mexe no site publicado**. Nada vai ao ar sem Pull Request e merge.
- Travou? Cole aqui a mensagem que apareceu (ou o print) e peça ajuda ao Claude. Erro faz parte e quase sempre é informação útil.

## Antes de tudo (uma vez só)

- [ ] Confira que o Bun está instalado: abra o terminal e rode `bun --version`. Deve aparecer um número.
- [ ] A pasta do projeto é `C:\workspace\ibto\landpage`.
- [ ] Ordem das tarefas: **1 → 2 → 3 → 4 → 5**. A Tarefa 3 só começa depois que a branch `feature/cursos` for mesclada na `main`. As Tarefas 4 e 5 não dependem das outras e podem ser feitas em paralelo, no seu ritmo.
- [ ] **Antes das Tarefas 2 e 3**, peça ao Claude para finalizar a `feature/cursos` (commit, teste humano, Pull Request e merge). Hoje há mudanças dela ainda não salvas, e elas atrapalham quem troca de branch.

---

## Tarefa 1 — Fechar o teste da HostGator

> ✅ **Concluída em 26/09/2026:** limpeza feita, PHP da conta em **8.3** e banco **Percona Server (MySQL) 5.7.44**, ambos compatíveis com o Laravel 13.

**Resultado (26/09/2026):** o teste do Python deu 403 e a [tabela oficial de compatibilidades da HostGator](https://suporte.hostgator.com.br/hc/pt-br/articles/30811116692115-Quais-s%C3%A3o-as-compatibilidades-da-HostGator) confirmou que o plano compartilhado só tem Python 3.6 (sem atualizações de segurança desde 2021), sem Node e sem SSH. Decisão: backend em **PHP + Laravel + MySQL**. Falta só arrumar o que o teste deixou e conferir o PHP.

### Parte A — Limpeza

- [x] No **Application Manager**, remova a aplicação `teste-python` (botão de remover/desregistrar na coluna Ações).
- [x] Em **Domínios**, apague o subdomínio `teste-python.ib-to.org`.
- [x] No **Gerenciador de Arquivos**, apague as pastas `teste-python` e `teste-python.ib-to.org`.

### Parte B — Conferir o PHP

O Laravel 13 (versão atual) exige **PHP 8.3 ou mais novo**. A HostGator oferece 8.2, 8.3, 8.4 e 8.5.

- [x] No cPanel, abra **MultiPHP Manager** e anote a versão do PHP de `ib-to.org`.
- [x] **Não mude a versão do site principal agora.** A troca será feita só no subdomínio da plataforma, quando ele for criado, para não arriscar o site no ar.
- [x] No **phpMyAdmin**, veja no painel à direita a versão do servidor de banco ("Versão do servidor") e anote se é MySQL 5.7 ou 8.0.

### Registrar o resultado

- [x] Comente na issue: versão do PHP, versão do MySQL e "limpeza feita".
- [x] Peça ao Claude para registrar no ROADMAP. **Ponto seguro:** Tarefa 1 concluída.

Os arquivos de teste em `C:\workspace\ibto\teste-python-hostgator` e `C:\workspace\ibto\teste-node-hostgator` podem ser apagados da sua máquina; não serão mais usados.

---

## Receita de uma mudança no código (usada nas Tarefas 2 e 3)

Este é o mesmo fluxo do README ([Fluxo de trabalho](../README.md#fluxo-de-trabalho)), em comandos.

1. **Atualize a `main`:** `git checkout main` e depois `git pull origin main`.
2. **Crie a branch** (o nome vem da tarefa): `git checkout -b feature/nome-da-tarefa`.
3. **Faça a edição** no arquivo indicado.
4. **Veja funcionando:** rode `bun run dev` e abra `http://localhost:5173`. Para parar, use `Ctrl + C`.
5. **Teste:** rode `bun run build` e depois `bun run lint`. O build deve terminar sem erro. O lint mostra alguns avisos amarelos antigos (`only-export-components`, um por página); eles são conhecidos e podem ser ignorados. Se aparecer erro vermelho ou aviso novo, chame o Claude.
6. **Salve com commit**, em português, dizendo o quê e por quê: `git add shared/content.ts` e `git commit -m "feat(assunto): o que mudou"`.
7. **Teste humano:** a Aline (ou você com ela) confere a página no navegador. Se reprovar, volte ao passo 3.
8. **Só depois de aprovado**, envie: `git push -u origin feature/nome-da-tarefa` (sempre com o nome da branch, nunca só `git push`).
9. **Abra o Pull Request** pelo link que o GitHub mostra depois do push. Na descrição, escreva o que testou e `Closes #número-da-issue`.
10. **Depois do merge (limpeza):** `git checkout main`, `git pull origin main` e `git branch -d feature/nome-da-tarefa`.

**Dica de segurança:** `git status` mostra em que ponto você está e não muda nada. Use quando ficar em dúvida.

---

## Tarefa 2 — Preencher a Rede Nacional

**Por que:** a página `/rede-nacional` está pronta, mas vazia. Com os dados reais, ela passa a mostrar os representantes agrupados por estado.

**Texto da issue:**

> **Título:** Preencher a Rede Nacional com representantes, instrutores e monitores
>
> Cadastrar em `shared/content.ts` os dados reais recebidos do Eduardo. Critério de aceite: a página /rede-nacional mostra os cards agrupados por estado, com nome, função, cidade e telefone.

Branch: `feature/rede-nacional-dados`.

### Parte A — Pedir os dados ao Eduardo

- [ ] Envie uma mensagem como esta:

> Eduardo, para a página Rede Nacional do site preciso, de cada representante, instrutor ou monitor: nome completo, função (representante, instrutor ou monitor), cidade, estado, WhatsApp e, se tiver, foto. Todos autorizaram a publicação do nome e do telefone? Pode mandar em planilha.

- [ ] Só publique quem **autorizou**. Nome, telefone e foto de uma pessoa são dados dela.

### Parte B — Editar o arquivo

- [ ] Faça os passos 1 e 2 da Receita (branch `feature/rede-nacional-dados`).
- [ ] Abra `shared/content.ts` e procure `export const redeNacional`. Hoje ela tem `representantes: []`.
- [ ] Coloque cada pessoa dentro dos colchetes, neste formato (uma chave por pessoa, com vírgula no final):

```ts
representantes: [
  {
    name: 'Nome Completo',
    role: 'Instrutor',
    city: 'Recife',
    state: 'Pernambuco',
    phone: '(81) 99999-9999',
  },
  {
    name: 'Outro Nome',
    role: 'Monitor',
    city: 'Recife',
    state: 'Pernambuco',
    phone: '(81) 98888-8888',
    instrutorResponsavel: 'Nome do Instrutor',
  },
],
```

Regras rápidas:

- `state` é o que agrupa os cards. Escreva **sempre igual** (por exemplo, sempre `Pernambuco`, nunca `PE` em uma pessoa e `Pernambuco` em outra).
- `role` pode ser `Representante`, `Instrutor` ou `Monitor`.
- `instrutorResponsavel` só para monitores (opcional).
- Foto é opcional. Se tiver, peça ao Claude para preparar a imagem; não precisa fazer nesta tarefa.

- [ ] Faça os passos 4 a 6 da Receita. No passo 4, abra `http://localhost:5173/rede-nacional`.

**Resultado esperado:** os cards aparecem, agrupados por estado, com nome, função, cidade e telefone.

**Se der errado:** se a página ficar em branco ou o terminal mostrar erro vermelho, quase sempre falta uma vírgula, uma aspa ou uma chave. Volte ao arquivo, compare com o exemplo acima e, se não achar, cole o erro aqui. **Ponto seguro:** dados no arquivo e commit feito.

- [ ] Faça os passos 7 a 10 da Receita.

---

## Tarefa 3 — Atualizar os dados dos cursos

**Por que:** a página `/cursos` mostra o que sabemos hoje, e faltam confirmações do Eduardo.

**Só comece depois** que a `feature/cursos` estiver mesclada na `main`.

**Texto da issue:**

> **Título:** Atualizar dados dos treinamentos na página de Cursos
>
> Confirmar com o Eduardo os dados pendentes e atualizá-los em `shared/content.ts`. Critério de aceite: telefones corretos, dados do Bastão Tático e da Sobrevivência Urbana completos, e nenhum treinamento passado aparecendo.

Branch: `feature/cursos-dados-atualizados`.

### Parte A — Confirmar com o Eduardo

- [ ] **Telefones:** os cartazes do Recife mostram números diferentes entre si (`(81) 99162-3046` e `(81) 99809-8742` de um lado; `8191623046` e `81990098742` do outro). Qual é o correto?
- [ ] **Seminário Bastão Tático:** o preço (R$ 150), o local (sede da FIGAM, em Caxias do Sul) e o WhatsApp `(54) 99662-7066` valem para as próximas turmas? O curso é aberto ao público?
- [ ] **Curso Sobrevivência Urbana Nível 1:** qual a data, o local, o preço, a modalidade de acesso e o WhatsApp para inscrição?
- [ ] **Depois de 11 de outubro:** os três treinamentos do Recife devem sair da página ou ficar como encerrados?

### Parte B — Editar os dados dos cursos

- [ ] Faça os passos 1 e 2 da Receita (branch `feature/cursos-dados-atualizados`).
- [ ] Abra `shared/content.ts` e procure `export const cursos`. Cada curso é um bloco entre chaves dentro de `cursos: [ ... ]`.
- [ ] Para mudar um dado, troque o texto entre aspas. Os campos são:

| Campo | O que é | Exemplo |
| --- | --- | --- |
| `schedule` | Datas e horário | `'10 de outubro · 09h às 13h'` |
| `location` | Local | `'Recife'` |
| `instructor` | Instrutor | `'Trinca — Especialista em Artes Marciais'` |
| `workload` | Carga horária | `'50 horas'` |
| `price` | Preço | `'R$ 250'` |
| `access` | Modalidade | `'gratuito-filiados'`, `'pago-publico'` ou `'pago-filiados'` |
| `whatsapp` | Telefones de contato | `['(81) 99162-3046']` |

- [ ] Para **remover** um curso, apague o bloco inteiro, da `{` até a `}` com a vírgula que vem depois.
- [ ] Faça os passos 4 a 6 da Receita. No passo 4, abra `http://localhost:5173/cursos`, clique em cada curso alterado e confira o modal.

**Resultado esperado:** os dados novos aparecem na grade e no modal, e o botão de WhatsApp abre a conversa com o número certo.

**Ponto seguro:** dados no arquivo e commit feito. Depois, faça os passos 7 a 10 da Receita.

---

## Laravel ou PHP simples?

**Resposta curta: Laravel.** A segurança é prioridade no projeto, e é justamente nela que a diferença é maior.

| Critério | Laravel | PHP simples (sem framework) |
| --- | --- | --- |
| **Segurança** (prioridade) | Proteções ligadas por padrão: contra falsificação de formulário (CSRF), contra injeção de SQL (as consultas usam parâmetros separados), contra XSS (o que aparece na tela é escapado automaticamente), senhas guardadas com hash forte, sessão renovada no login, limite de tentativas, criptografia e controle de permissões. Correções de segurança publicadas pelo próprio time do Laravel (a versão 13 recebe correções até março de 2028) | Cada proteção precisa ser escrita e lembrada à mão, em todo formulário e toda consulta. Dá para ficar seguro, mas depende 100% da disciplina de quem escreve; esquecer uma vez basta para abrir uma falha. É o caminho de maior risco para um time que está começando |
| **Code clean e profissional** | Estrutura padrão de pastas e convenções (rotas, controllers, models, validação); qualquer dev Laravel entende o projeto no primeiro dia | Cada projeto inventa a própria organização; tende a virar arquivos grandes e misturados com o tempo |
| **Sustentável** (fácil de manter) | Versões anuais, com guia de atualização e mudanças pequenas entre elas; testes automatizados já vêm prontos para usar | Toda manutenção e atualização é por nossa conta |
| **Escalável e elástico** | Troca de cache, filas e armazenamento só mudando configuração; o mesmo código pode ir para um VPS ou nuvem se a plataforma crescer | Crescer exige reescrever partes |
| **Mercado e comunidade** | Framework PHP mais usado, documentação oficial completa, comunidade brasileira ativa, muitas vagas e muitos pacotes prontos (painel admin, pagamentos, e-mail) | Sem ecossistema próprio; cada problema é resolvido do zero |
| **Seu aprendizado** | Tem um kit inicial oficial em **React**, então o que você já estudou continua valendo | Aprende PHP puro, mas sem uma estrutura que guie |

**Sendo honesto sobre escala:** no plano compartilhado, o limite é a hospedagem, não o framework. Nenhum dos dois fica "elástico" num plano P. A vantagem do Laravel é que, se um dia a plataforma precisar de mais, o mesmo código muda de servidor sem ser reescrito.

**O preço do Laravel num plano sem SSH:** a publicação dá mais trabalho, porque as bibliotecas são instaladas na sua máquina e enviadas prontas. Como isso funciona está em [Como o Laravel vai rodar na HostGator](#como-o-laravel-vai-rodar-na-hostgator). É um custo que se paga uma vez, na configuração, enquanto a segurança do PHP simples teria de ser paga em todo código escrito.

---

## Tarefa 4 — Preparar a sua máquina para PHP e Laravel

**Por que:** para estudar e desenvolver o backend, a sua máquina precisa de PHP, Composer (o "bun" do PHP, que instala bibliotecas) e o instalador do Laravel. Nada disso mexe no site do IBTO.

**Texto da issue:**

> **Título:** Preparar ambiente local de PHP e Laravel
>
> Instalar Laravel Herd no Windows e conferir PHP 8.3+, Composer e o instalador do Laravel. Critério de aceite: os três comandos de verificação respondem com as versões esperadas.

Não há branch: é só instalação na sua máquina.

### Parte A — Instalar o Laravel Herd

O Herd é a ferramenta oficial do Laravel para Windows. A versão gratuita já traz PHP, Composer, o instalador do Laravel e o Node.

> **E o XAMPP que já está instalado?** A versão mais nova do XAMPP para Windows traz **PHP 8.2.12**, e o Laravel 13 exige **8.3 ou mais novo**, então o XAMPP não roda o Laravel atual. Com ele só daria para usar o Laravel 12, que já parou de receber correções de bugs (agosto de 2026) e só recebe correções de segurança até fevereiro de 2027. Por isso o PHP virá do Herd. O XAMPP pode continuar instalado; o que ele tem de útil para depois é o banco local (MariaDB, parente próximo do MySQL da HostGator) com o phpMyAdmin. Para estudar, o SQLite do Laravel basta.

- [ ] Baixe o instalador em `https://herd.laravel.com/windows` e instale.
- [ ] Abra o Herd pelo ícone perto do relógio e siga a configuração inicial.

### Parte B — Conferir

- [ ] Abra um **PowerShell novo** (os que já estavam abertos não enxergam a instalação) e rode, um por vez:

```powershell
php -v
composer -V
laravel --version
```

**Resultado esperado:** `php -v` mostra **8.3 ou maior**; os outros dois mostram um número de versão.

**Se der errado:**

- `php -v` mostra **8.2** ou mais antiga? Provavelmente é o PHP do **XAMPP** aparecendo antes do Herd. No Herd, abra as configurações de PHP e confira se ele está no PATH; se continuar, chame o Claude com o resultado de `where.exe php`.
- "comando não reconhecido"? Feche e abra o PowerShell de novo; se continuar, reinicie o computador.

**Ponto seguro:** ambiente pronto.

---

## Tarefa 5 — Primeiro projeto de estudo em Laravel

**Por que:** aprender com um projeto de treino, **fora** do repositório do IBTO, antes de escrever o backend de verdade. Errar aqui não quebra nada.

**Texto da issue:**

> **Título:** Estudo: primeiro projeto Laravel com o kit React
>
> Criar um projeto de estudo com o kit inicial React, cadastrar um usuário, criar uma tabela de cursos e listar os cursos numa página. Critério de aceite: projeto rodando localmente e anotações do que foi aprendido na issue.

### Parte A — Criar o projeto

- [ ] No PowerShell, entre na pasta do Herd e crie o projeto:

```powershell
cd ~\Herd
laravel new estudo-ibto
```

- [ ] O instalador faz perguntas. Escolha:
  - **Starter kit: React** (aproveita o React que você já conhece e já vem com login e cadastro prontos)
  - **Banco de dados: SQLite** (um arquivo só, sem instalar MySQL agora; para estudar é o suficiente)
  - Nas demais perguntas, aceite o padrão (Enter).
- [ ] Abra no navegador: `http://estudo-ibto.test` (o Herd publica sozinho os projetos dessa pasta). Se não abrir, rode dentro da pasta `estudo-ibto` o comando `composer run dev` e abra `http://localhost:8000`.

**Resultado esperado:** a página inicial do Laravel, com links de **Log in** e **Register**.

- [ ] Clique em **Register**, crie um usuário e entre. Você acabou de usar login, senha com hash e proteção CSRF sem escrever nenhuma linha. **Ponto seguro.**

### Parte B — Aprender a base, com a documentação oficial

Um tópico por vez, nesta ordem. Não precisa decorar; o objetivo é saber onde cada coisa fica.

A documentação completa (versão 13) está em `https://laravel.com/framework/docs`. Siga esta ordem:

#### Base

- [ ] **Estrutura de pastas:** `https://laravel.com/framework/docs/13.x/structure`
- [ ] **Configuração e o arquivo `.env`:** `https://laravel.com/framework/docs/13.x/configuration`
- [ ] **Rotas:** `https://laravel.com/framework/docs/13.x/routing`
- [ ] **Controllers:** `https://laravel.com/framework/docs/13.x/controllers`
- [ ] **Migrations** (criar tabelas por código): `https://laravel.com/framework/docs/13.x/migrations`
- [ ] **Eloquent** (ler e gravar no banco): `https://laravel.com/framework/docs/13.x/eloquent`
- [ ] **Validação** (conferir o que o usuário enviou): `https://laravel.com/framework/docs/13.x/validation`

#### Segurança (leia com atenção; é a prioridade do projeto)

- [ ] **Proteção CSRF:** `https://laravel.com/framework/docs/13.x/csrf`
- [ ] **Autenticação** (login): `https://laravel.com/framework/docs/13.x/authentication`
- [ ] **Autorização** (quem pode fazer o quê): `https://laravel.com/framework/docs/13.x/authorization`
- [ ] **Senhas com hash:** `https://laravel.com/framework/docs/13.x/hashing`
- [ ] **Limite de tentativas:** `https://laravel.com/framework/docs/13.x/rate-limiting`

#### Para depois (quando formos publicar)

- [ ] **Publicação:** `https://laravel.com/framework/docs/13.x/deployment`
- [ ] **Tarefas agendadas:** `https://laravel.com/framework/docs/13.x/scheduling`

A página `https://laravel.com/learn` reúne os cursos oficiais para iniciantes.

### Parte C — Exercício: tabela de cursos

Este exercício usa as regras reais da plataforma, então o que você aprender aqui vai direto para o projeto.

- [ ] Peça ao Claude: "me guie para criar no estudo-ibto um model `Curso` com migration, com os campos nome, descrição, valor (opcional) e visibilidade (publico ou restrito), e uma página que liste os cursos". Faça os comandos você mesmo, com o Claude explicando cada um.
- [ ] Anote na issue o que entendeu de cada parte (migration, model, rota, página).

**Ponto seguro:** Tarefa 5 concluída. O backend de verdade começa depois, numa issue própria do ROADMAP.

---

## Como o Laravel vai rodar na HostGator

Referência para quando a plataforma for publicada. **Não é tarefa agora**; cada item será testado na issue de homologação.

- **Subdomínio próprio** (ex.: `cursos-homolog.ib-to.org`), com **PHP 8.3 ou mais novo** definido no MultiPHP Manager só para ele.
- **Só a pasta `public/` do Laravel fica acessível pela internet.** Ao criar o subdomínio, o "Document Root" aponta para a pasta `public` do projeto (ex.: `plataforma/public`). Assim o arquivo `.env` (com senhas) e o código ficam fora do alcance do navegador. A documentação oficial do Laravel exige isso.
- **Sem SSH, as dependências vão prontas:** na sua máquina, `composer install --no-dev --optimize-autoloader` e `bun run build`; depois o projeto é compactado em `.zip`, enviado pelo Gerenciador de Arquivos e extraído.
- **Comandos do Laravel no servidor** (criar as tabelas, preparar o cache) rodam por **Cron Job**, que o plano suporta: agenda-se o comando uma vez e depois ele é removido. O caminho exato do PHP no servidor será confirmado na homologação.
- **Tarefas agendadas e filas** (ex.: tirar cursos vencidos do ar, enviar e-mails) também rodam por Cron Job, com fila guardada no próprio MySQL.
- **Configuração de produção obrigatória:** `APP_ENV=production` e `APP_DEBUG=false` (com o debug ligado, uma tela de erro mostra senhas e caminhos do servidor), HTTPS forçado e `.env` fora do Git.
- **Banco:** MySQL da HostGator. O nosso servidor tem **Percona Server 5.7.44**, que o Laravel 13 aceita (a documentação oficial pede MySQL 5.7 ou mais novo). O MySQL 5.7 saiu do suporte oficial em 2023, então o banco nunca deve ficar acessível de fora (manter o "Remote Database Access" desligado), e vale pedir à HostGator a mudança para um servidor com MySQL 8.0 quando possível.

---

## Depois das tarefas

Peça ao Claude para marcar o que foi concluído no [ROADMAP.md](../ROADMAP.md) e escolher a próxima issue da lista.
