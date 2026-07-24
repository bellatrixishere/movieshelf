# 🎬 MovieShelf

Aplicação web para pesquisar filmes, montar sua própria coleção e acompanhar o que você já assistiu, está assistindo ou quer assistir.

**🔗 App publicado:** https://eba72690.movie-shelf.pages.dev

**🔗 Repositório:** https://github.com/bellatrixishere/movieshelf

---

## Funcionalidades

- Pesquisa de filmes usando a API pública do OMDb
- Adicionar filmes encontrados à sua coleção pessoal
- Marcar cada filme com status: **Quero assistir**, **Assistindo** ou **Assistido**
- Filtrar a coleção por gênero
- Ordenar a coleção por ano de lançamento ou por data em que foi adicionado
- Remover filmes da coleção
- Dados persistidos em banco de dados real (a coleção não se perde ao recarregar a página)

---

## Arquitetura

```
React (frontend)
     │
     ▼
Cloudflare Worker (backend)
     │
     ├── Consulta a API OMDb
     │
     └── CRUD no Cloudflare D1 (banco de dados)
```

O frontend nunca acessa a API do OMDb diretamente. Todas as requisições passam pelo Worker, que é o único lugar onde a chave da API fica armazenada (como *secret*, nunca exposta no navegador).

> **Observação:** este projeto não possui sistema de autenticação — a coleção é pública e compartilhada entre qualquer pessoa que acesse o site ou o endpoint do Worker. Isso é adequado para um projeto de portfólio/treinamento, mas não para um app multi-usuário real.

---

## Stack

**Frontend**
- React + Vite
- React Router
- Mantine UI
- Tabler Icons

**Backend**
- Cloudflare Workers
- Cloudflare D1 (banco SQL serverless)

**API externa**
- [OMDb API](https://www.omdbapi.com/)

---

## Estrutura do projeto

Este é um repositório único (monorepo), contendo o frontend na raiz e o backend em uma subpasta:

```
movie-shelf/                       → raiz do repositório (frontend)
├── src/
│   ├── components/
│   │   └── MovieCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── CreateMovie.jsx
│   │   ├── MovieDetails.jsx
│   │   └── EditMovie.jsx
│   ├── services/
│   │   └── api.js               → chamadas ao Worker
│   └── utils/
│       └── movieMapper.js       → converte os formatos de dados (OMDb / banco / app)
│
└── movieshelf-worker/            → backend (Cloudflare Worker), dentro do mesmo repositório
    ├── src/
    │   └── index.js             → rotas: GET /search, GET/POST/PUT/DELETE /movies
    ├── schema.sql                → estrutura da tabela `movies`
    └── wrangler.jsonc            → configuração do Worker e do banco D1
```

---

## Rodando localmente

### Backend (Worker)

```bash
cd movieshelf-worker
npm install
npx wrangler dev
```

Crie um arquivo `.dev.vars` na raiz do worker (`movieshelf-worker/.dev.vars`) com sua chave da OMDb:
```
OMDB_API_KEY=sua_chave_aqui
```

### Frontend

Na raiz do repositório:

```bash
npm install
npm run dev
```

Por padrão, o `src/services/api.js` aponta para o Worker publicado. Para testar contra o Worker local, troque a constante `API_BASE_URL` para `http://localhost:8787`.

---

## Endpoints da API (Worker)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/search?title=` | Busca um filme na OMDb |
| GET | `/movies` | Lista todos os filmes da coleção |
| POST | `/movies` | Adiciona um filme à coleção |
| PUT | `/movies/:id` | Atualiza o status de um filme |
| DELETE | `/movies/:id` | Remove um filme da coleção |

---

## Deploy

- **Frontend:** Cloudflare Pages
- **Backend:** Cloudflare Workers
- **Banco de dados:** Cloudflare D1

```bash
# Worker
cd movieshelf-worker
npx wrangler deploy

# Frontend (a partir da raiz do repositório)
cd ..
npm run build
npx wrangler pages deploy dist
```
