# Mood Board

Plataforma de descoberta, compartilhamento e organização de referências visuais, inspirada em produtos como o Pinterest.

O projeto nasceu em uma disciplina de Programação Orientada a Objetos e continua evoluindo como laboratório de arquitetura, frontend, banco de dados, testes, containers e CI/CD.

> **Status:** a API, os testes, o ambiente Docker e os deploys estão
> funcionando. O frontend possui autenticação, cadastro, feed paginado e tela de
> detalhes das referências.

## Aplicação

```text
Frontend React
      ↓
API Node.js
      ↓
Banco MySQL
```

| Serviço  | Produção                                                       |
| -------- | -------------------------------------------------------------- |
| Frontend | [mood-board.gabizin.me](https://mood-board.gabizin.me)         |
| API      | [api.mood-board.gabizin.me](https://api.mood-board.gabizin.me) |

O domínio atual possui usuários, Pins e pastas. Cada usuário pode organizar um
mesmo Pin em uma ou mais pastas.

### Conta de demonstração

Para testar a aplicação publicada ou o ambiente local depois do seed, use:

| Campo | Valor                  |
| ----- | ---------------------- |
| Email | `ana.seed@example.com` |
| Senha | `MoodBoard123!`        |

A conta é pública e permite navegar pelo feed e pelos detalhes em modo somente
leitura. Operações de criação, alteração e remoção são bloqueadas no backend.

## Monorepo

```text
.
├── backend/                  # API Express, TypeORM e testes
├── frontend/                 # React, TypeScript e Vite
├── scripts/run-dev.mjs       # Executa frontend e backend juntos
├── Dockerfile                # Imagem de produção da API
├── docker-compose.yml        # Stack local completa
└── package.json              # Comandos de orquestração
```

Cada aplicação possui suas próprias dependências, variáveis e documentação:

- [Documentação do backend](backend/README.md)
- [Documentação do frontend](frontend/README.md)

## Executando localmente

Requisitos: Node.js 22, npm e Docker.

Crie os arquivos de ambiente:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Preencha as credenciais do banco e o `JWT_SECRET` em `backend/.env`. O frontend já utiliza `http://localhost:3000` como endereço padrão da API.

Instale as dependências:

```bash
npm --prefix backend ci
npm --prefix frontend ci
```

Inicie o MySQL e, depois, as duas aplicações:

```bash
npm run db:up
npm run dev
```

Acesse:

```text
Frontend: http://localhost:5173
API:      http://localhost:3000
```

## Executando tudo com Docker

Depois de configurar os mesmos arquivos `.env`:

```bash
npm run docker:up
```

Comandos úteis:

```bash
npm run docker:ps
npm run docker:logs
npm run docker:down
```

O último comando preserva o volume do MySQL. Executar `docker compose down -v` também remove os dados locais.

## Comandos do monorepo

| Comando                | Função                                         |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Executa frontend e backend juntos              |
| `npm run dev:backend`  | Executa somente a API                          |
| `npm run dev:frontend` | Executa somente o Vite                         |
| `npm run build`        | Compila os dois projetos                       |
| `npm run typecheck`    | Verifica o TypeScript dos dois projetos        |
| `npm run lint`         | Executa o lint dos dois projetos               |
| `npm run format`       | Formata backend e frontend                     |
| `npm run format:check` | Verifica a formatação dos dois projetos        |
| `npm run seed:dev`     | Popula o banco local com dados de demonstração |
| `npm run seed`         | Popula o banco usando o backend compilado      |
| `npm test`             | Executa a suíte do backend                     |
| `npm run docker:up`    | Sobe a stack completa em containers            |
| `npm run docker:down`  | Encerra a stack preservando o banco            |

## CI/CD

O workflow `CI` executa build, typecheck e testes em Pull Requests e pushes. Depois de um push na `main`, o workflow `CD` somente publica a API na DigitalOcean e o frontend no GitHub Pages quando o CI do mesmo commit termina com sucesso. Para executar migrations e seed antes de cada publicação, o app da API deve ter o job `PRE_DEPLOY` descrito na documentação do backend.

Os detalhes de cada publicação ficam nos READMEs das respectivas aplicações.
