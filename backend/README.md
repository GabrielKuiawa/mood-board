# Backend

API REST da plataforma Mood Board. O backend gerencia usuários, autenticação,
Pins, pastas e seus relacionamentos.

## Tecnologias

- Node.js e TypeScript
- Express
- TypeORM e MySQL
- DigitalOcean Spaces (API compatível com S3)
- JWT e bcryptjs
- Jest, ts-jest e Supertest
- Docker

## Arquitetura

```text
Requisição HTTP
      ↓
    Rota
      ↓
 Controller
      ↓
  Serviço
      ↓
Repositório
      ↓
TypeORM / MySQL
```

- `route`: associa URLs e métodos HTTP aos controllers.
- `controller`: recebe a requisição e constrói a resposta HTTP.
- `service`: contém casos de uso e regras de autorização.
- `repository`: isola a persistência.
- `models`: representa as entidades do domínio.
- `middlewares`: trata autenticação, validação e erros compartilhados.

O modelo atual possui os relacionamentos:

```text
Usuário 1 ──── * Pin
Usuário 1 ──── * Pasta
Pin * ──────── * Pasta
```

## Variáveis de ambiente

Crie o arquivo local:

```bash
cp .env.example .env
```

| Variável                   | Uso                                                   |
| -------------------------- | ----------------------------------------------------- |
| `PORT`                     | Porta HTTP da API                                     |
| `CORS_ORIGIN`              | Origens do frontend permitidas, separadas por vírgula |
| `DATABASE_URL`             | URL do banco gerenciado em produção                   |
| `DB_HOST`                  | Host do MySQL local                                   |
| `DB_PORT`                  | Porta do MySQL                                        |
| `DB_USERNAME`              | Usuário do banco                                      |
| `DB_PASSWORD`              | Senha do banco                                        |
| `DB_DATABASE`              | Nome do banco                                         |
| `DB_SSL`                   | Habilita SSL na conexão                               |
| `MYSQL_ROOT_PASSWORD`      | Senha root usada pelo Compose local                   |
| `JWT_SECRET`               | Segredo usado para assinar tokens                     |
| `SPACES_PREFIX`            | Ambiente usado como prefixo: `dev`, `test` ou `prod`  |
| `SPACES_REGION`            | Região do Space, por exemplo `nyc3`                   |
| `SPACES_ENDPOINT`          | Endpoint regional da API do Spaces                    |
| `SPACES_BUCKET`            | Nome do bucket                                        |
| `SPACES_ACCESS_KEY_ID`     | Identificador da chave de acesso                      |
| `SPACES_SECRET_ACCESS_KEY` | Segredo da chave de acesso                            |
| `SPACES_PUBLIC_URL`        | URL pública do CDN, sem barra no final                |
| `DB_TEST_PORT`             | Porta do MySQL isolado dos testes                     |
| `DB_TEST_DATABASE`         | Nome do banco de testes                               |

`DATABASE_URL`, quando preenchida, substitui as variáveis `DB_*` de conexão. Dentro do Docker Compose, o host do banco é sobrescrito para `mysql`; fora dos containers, o padrão é `localhost`.

Use `SPACES_PREFIX=dev` no ambiente local e `SPACES_PREFIX=prod` na App
Platform. O prefixo é obrigatório e gera automaticamente as estruturas
`dev/images`, `dev/users`, `prod/images` e `prod/users` no mesmo bucket.

## Desenvolvimento

Na pasta `backend`:

```bash
npm ci
npm run dev
```

A API estará em `http://localhost:3000`. Ela precisa de um MySQL acessível; pela raiz do monorepo, use `npm run db:up` para iniciar somente o banco local.

Comandos principais:

| Comando                    | Função                                    |
| -------------------------- | ----------------------------------------- |
| `npm run dev`              | Executa com recarregamento automático     |
| `npm run typecheck`        | Verifica o TypeScript                     |
| `npm run lint`             | Verifica problemas estáticos com Oxlint   |
| `npm run format`           | Formata o backend com Prettier            |
| `npm run format:check`     | Confere a formatação sem alterar arquivos |
| `npm run build`            | Gera o JavaScript em `build/`             |
| `npm start`                | Executa o build compilado                 |
| `npm run migration:run`    | Aplica migrations pendentes               |
| `npm run migration:revert` | Reverte a última migration                |
| `npm run seed:dev`         | Popula o banco usando o TypeScript local  |
| `npm run seed`             | Popula o banco usando o build compilado   |
| `npm run test:unit`        | Executa testes unitários                  |
| `npm run test:integration` | Executa testes de integração              |
| `npm run test:e2e`         | Executa testes HTTP ponta a ponta         |

## Endpoints

As rotas dos recursos utilizam o prefixo `/api`.

### Usuários

| Método   | Endpoint             | Descrição                     |
| -------- | -------------------- | ----------------------------- |
| `POST`   | `/api/user/login`    | Autentica e gera um JWT       |
| `GET`    | `/api/user`          | Lista usuários                |
| `POST`   | `/api/user`          | Cadastra um usuário           |
| `GET`    | `/api/user/:id`      | Busca um usuário              |
| `PUT`    | `/api/user/:id`      | Atualiza um usuário           |
| `DELETE` | `/api/user/:id`      | Exclui um usuário             |
| `GET`    | `/api/user/pins/:id` | Busca usuário e seus Pins     |
| `GET`    | `/api/user/me`       | Retorna o usuário autenticado |

O cadastro em `POST /api/user` recebe `multipart/form-data` com `name`,
`email`, `password` e o avatar no campo `image`. Em `PUT /api/user/:id`, os
campos de texto continuam obrigatórios, mas `image` é opcional; quando não for
enviado, o avatar atual é mantido. O arquivo segue os mesmos formatos e o limite
de 10 MB usados pelas imagens do board.

`DELETE /api/user/:id` remove do Spaces o avatar e todos os Pins gerenciados
pela aplicação antes de excluir o usuário e seus relacionamentos do MySQL.

### Pins

| Método   | Endpoint             | Descrição          |
| -------- | -------------------- | ------------------ |
| `GET`    | `/api/pin`           | Lista Pins         |
| `POST`   | `/api/pin`           | Publica um Pin     |
| `GET`    | `/api/pin/:id`       | Busca um Pin       |
| `PUT`    | `/api/pin/:id`       | Atualiza um Pin    |
| `DELETE` | `/api/pin/:id`       | Exclui um Pin      |
| `POST`   | `/api/pin/:id/likes` | Curte um Pin       |
| `DELETE` | `/api/pin/:id/likes` | Remove uma curtida |

Para publicar um Pin, envie `POST /api/pin` como
`multipart/form-data`, com os campos:

| Campo         | Tipo                       | Obrigatório |
| ------------- | -------------------------- | ----------- |
| `image`       | Arquivo JPEG, PNG ou WebP  | Sim         |
| `title`       | Texto                      | Sim         |
| `description` | Texto                      | Sim         |
| `folderIds`   | UUID repetível no FormData | Não         |

O arquivo pode ter até 10 MB. A API envia a imagem ao Spaces e grava a URL
pública retornada em `pathImage`.

`DELETE /api/pin/:id` remove primeiro o objeto do Spaces e depois exclui o
registro do MySQL. URLs externas usadas pelo seed não são enviadas ao Spaces
para exclusão.

### Pastas

| Método   | Endpoint                            | Descrição                  |
| -------- | ----------------------------------- | -------------------------- |
| `GET`    | `/api/folder/mine`                  | Lista as pastas do usuário |
| `POST`   | `/api/folder`                       | Cria uma pasta             |
| `GET`    | `/api/folder/:id`                   | Busca uma pasta            |
| `PUT`    | `/api/folder/:id`                   | Renomeia uma pasta         |
| `DELETE` | `/api/folder/:id`                   | Exclui uma pasta           |
| `POST`   | `/api/folder/:folderId/pins/:pinId` | Salva um Pin na pasta      |
| `DELETE` | `/api/folder/:folderId/pins/:pinId` | Remove um Pin da pasta     |

`GET /` apresenta a API e seus principais endpoints.

## Autenticação e autorização

Cadastro e login são públicos. A leitura de Pins e todas as operações com
pastas são protegidas. Rotas protegidas recebem o token no cabeçalho:

```http
Authorization: Bearer <token>
```

Usuários comuns gerenciam apenas o próprio perfil e seus recursos. A listagem completa de usuários é restrita a administradores. Contas criadas pela rota pública sempre recebem o papel `user`.

## Banco e migrations

O TypeORM não sincroniza o schema automaticamente. Mudanças estruturais ficam versionadas em `src/migration/`.

```bash
npm run migration:run
npm run migration:revert
```

Não edite uma migration que já foi aplicada. Crie uma nova migration para cada alteração posterior do schema.

### Dados de demonstração

O seeder cria 12 usuários, 120 pastas e 500 Pins para desenvolvimento ou
demonstração. Antes de gravar os registros, ele baixa as imagens-fonte e envia
os 12 avatares e as 500 imagens dos Pins ao Spaces, sob os diretórios
`seed/users` e `seed/pins`. Ele executa as migrations pendentes e substitui
somente as contas com e-mails reservados pelo próprio seed, portanto pode ser
executado novamente sem duplicar dados. Depois de uma execução bem-sucedida, os
objetos pertencentes à execução anterior são removidos do storage.

A conta pública `ana.seed@example.com` sempre recebe a senha `MoodBoard123!` e
um token de somente leitura. Defina em `SEED_USER_PASSWORD` uma senha privada de
pelo menos 8 caracteres para os outros 11 usuários. Execute o seed local com
o TypeScript:

```bash
npm run seed:dev
```

Em uma imagem de produção já compilada:

```bash
npm run seed
```

O seeder não roda durante a inicialização normal do container. Em produção, ele deve ser configurado como um job `PRE_DEPLOY` da DigitalOcean App Platform para executar antes de cada publicação:

```text
Source:      GitHub / GabrielKuiawa/mood-board / main
Dockerfile:  Dockerfile
Run command: npm run seed
Trigger:     Before every deploy
```

O job precisa receber `DATABASE_URL` e `SEED_USER_PASSWORD`. Como a configuração atual do backend valida todas as variáveis ao carregar o DataSource, compartilhe também `PORT`, `CORS_ORIGIN`, `JWT_SECRET` e as variáveis `SPACES_*` com o job. Marque `DATABASE_URL`, `SEED_USER_PASSWORD`, `JWT_SECRET` e `SPACES_SECRET_ACCESS_KEY` como secrets.

Depois que esse recurso for salvo no app `mood-board`, o workflow de CD existente preserva o job remoto e cada deploy executa migrations e seed antes de publicar a nova versão. Se o seed falhar, a publicação não deve prosseguir. A senha dos outros 11 usuários é definida em `SEED_USER_PASSWORD` e não é registrada nos logs.

## Testes

Os testes de integração e E2E utilizam um MySQL temporário definido em `docker-compose.test.yml`. O banco usa `tmpfs` e é removido ao final.

```bash
npm run test:db:up
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:db:down
```

As suítes que compartilham banco são executadas sequencialmente com `--runInBand`.

## Docker e produção

O `Dockerfile` usado pela API fica na raiz do monorepo porque a DigitalOcean constrói o repositório a partir desse contexto. A imagem utiliza build multi-stage e executa a aplicação com o usuário `node`.

Em produção:

- API: `https://api.mood-board.gabizin.me`
- Hospedagem: DigitalOcean App Platform
- Banco: Managed MySQL fornecido por `DATABASE_URL`
- Segredo necessário no GitHub: `DIGITALOCEAN_ACCESS_TOKEN`

O deploy ocorre pelo workflow `.github/workflows/cd.yml` depois que o CI do mesmo commit passa em um push para a `main`.
