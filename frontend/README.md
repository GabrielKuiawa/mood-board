# Frontend

Frontend da plataforma Mood Board, construído com React, TypeScript e Vite.

A aplicação possui autenticação, cadastro, feed virtualizado com paginação
infinita, visualização dos detalhes de cada Pin e organização em pastas. Rotas
privadas validam a sessão pela API antes de liberar o conteúdo.

## Tecnologias

- React
- TypeScript
- Vite
- Vitest e Testing Library
- Oxlint
- Prettier
- Nginx no ambiente Docker

## Variáveis de ambiente

Crie o arquivo local:

```bash
cp .env.example .env
```

O frontend precisa somente do endereço público da API:

```env
VITE_API_URL=http://localhost:3000
```

Defina a URL sem `/` no final. No desenvolvimento ela aponta para a API local;
nos builds de deploy, o ambiente fornece o domínio público da API.

Variáveis prefixadas com `VITE_` são incorporadas ao JavaScript durante o build e não devem conter segredos.

## Desenvolvimento

Na pasta `frontend`:

```bash
npm ci
npm run dev
```

A aplicação estará em `http://localhost:5173`.

Comandos disponíveis:

| Comando                | Função                                     |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Inicia o servidor de desenvolvimento       |
| `npm run typecheck`    | Verifica o TypeScript                      |
| `npm run lint`         | Executa o Oxlint                           |
| `npm run format`       | Formata os arquivos do frontend            |
| `npm run format:check` | Verifica a formatação sem alterar arquivos |
| `npm test`             | Executa todos os testes uma vez            |
| `npm run test:watch`   | Executa os testes em modo interativo       |
| `npm run build`        | Gera o build em `dist/`                    |
| `npm run preview`      | Serve o build localmente para conferência  |

Os testes ficam centralizados em `src/tests/`, separados entre `unit/` e
`integration/`. Por estarem dentro de `src`, eles usam a mesma configuração do
TypeScript e os mesmos aliases da aplicação. A configuração compartilhada está
em `vitest.config.ts`.

## Estrutura do código

```text
src/
├── app/                  # Router e layouts globais
├── components/
│   ├── shared/           # Componentes reutilizáveis da aplicação
│   └── ui/               # Primitives visuais no padrão shadcn
├── features/
│   ├── auth/
│   │   ├── components/   # Partes das telas de autenticação
│   │   ├── hooks/        # Casos de uso de login, cadastro e logout
│   │   ├── pages/        # Páginas usadas diretamente pelo router
│   │   └── services/     # Operações de autenticação e sessão
│   ├── pins/
│   │   ├── components/   # Cards, listas e elementos de apresentação
│   │   ├── pages/        # Feed, criação e detalhes de um Pin
│   │   └── services/     # Operações disponíveis sobre Pins
│   ├── folders/          # Seleção, criação e persistência de pastas
│   └── navigation/
│       └── components/   # Header e sidebar da área autenticada
├── lib/                  # Infraestrutura compartilhada, HTTP e storage
└── tests/                # Fixtures, mocks e testes unitários/integração
```

A direção esperada das dependências é `app → features → components/lib`. Uma
feature não deve importar detalhes internos de outra feature. Código usado
diretamente pelo router fica em `pages/`; partes dessas páginas ficam em
`components/`.

## Docker

O `Dockerfile` desta pasta compila o React e serve os arquivos estáticos com Nginx. Ele é utilizado pelo `docker-compose.yml` da raiz.

Para iniciar frontend, backend e banco juntos:

```bash
npm run docker:up
```

O frontend em container fica disponível em `http://localhost:5173`.

## GitHub Pages

Depois de um push na `main`, o workflow de CD aguarda o CI terminar com sucesso e então:

1. Executa as validações do monorepo.
2. Configura o caminho público do Vite.
3. Compila a aplicação com a API de produção.
4. Publica `dist/` no GitHub Pages.

O endereço publicado é:

```text
https://mood-board.gabizin.me
```

Configuração do repositório:

```text
Settings > Pages > Source: GitHub Actions
Custom domain: mood-board.gabizin.me
```

Configuração DNS:

```text
Tipo:    CNAME
Host:    mood-board
Destino: GabrielKuiawa.github.io
```

O workflow define `VITE_API_URL=https://api.mood-board.gabizin.me` durante o build de produção. Não é necessário criar um `.env` de produção no repositório.

O `VITE_BASE_PATH` também é fornecido pelo workflow para que os assets funcionem tanto no endereço padrão do Pages quanto no domínio personalizado.
