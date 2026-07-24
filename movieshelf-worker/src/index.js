const OMDB_BASE_URL = "https://www.omdbapi.com/";

function withCORS(response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  return new Response(response.body, {
    status: response.status,
    headers,
  });
}

function jsonResponse(data, status = 200) {
  return withCORS(
    new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );
}

async function handleSearch(request, env) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title");

  if (!title) {
    return jsonResponse({ error: "Parâmetro 'title' é obrigatório" }, 400);
  }

  const omdbUrl = `${OMDB_BASE_URL}?t=${encodeURIComponent(title)}&apikey=${env.OMDB_API_KEY}`;
  const omdbResponse = await fetch(omdbUrl);
  const data = await omdbResponse.json();

  return jsonResponse(data);
}

async function handleGetMovies(request, env) {
  const { results } = await env.movieshelf_db
    .prepare("SELECT * FROM movies ORDER BY added_at DESC")
    .all();

  return jsonResponse(results);
}

async function handleCreateMovie(request, env) {
  const body = await request.json();
  const { id, title, year, genre, poster, plot, rating, status, addedAt } = body;

  if (!id || !title) {
    return jsonResponse({ error: "Campos 'id' e 'title' são obrigatórios" }, 400);
  }

  const finalStatus = status || "Quero assistir";
  const finalAddedAt = addedAt || Date.now();

  try {
    await env.movieshelf_db
      .prepare(
        `INSERT INTO movies (id, title, year, genre, poster, plot, rating, status, added_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        title,
        year || null,
        genre || null,
        poster || null,
        plot || null,
        rating || null,
        finalStatus,
        finalAddedAt
      )
      .run();
  } catch (error) {
    return jsonResponse({ error: "Esse filme já está na coleção" }, 409);
  }

  return jsonResponse({ success: true }, 201);
}

async function handleUpdateMovie(request, env, id) {
  const body = await request.json();
  const { status } = body;

  if (!status) {
    return jsonResponse({ error: "Campo 'status' é obrigatório" }, 400);
  }

  await env.movieshelf_db
    .prepare("UPDATE movies SET status = ? WHERE id = ?")
    .bind(status, id)
    .run();

  return jsonResponse({ success: true });
}

async function handleDeleteMovie(request, env, id) {
  await env.movieshelf_db
    .prepare("DELETE FROM movies WHERE id = ?")
    .bind(id)
    .run();

  return jsonResponse({ success: true });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (request.method === "OPTIONS") {
      return withCORS(new Response(null, { status: 204 }));
    }

    if (url.pathname === "/search" && request.method === "GET") {
      return handleSearch(request, env);
    }

    if (pathParts[0] === "movies") {
      if (pathParts.length === 1) {
        if (request.method === "GET") {
          return handleGetMovies(request, env);
        }
        if (request.method === "POST") {
          return handleCreateMovie(request, env);
        }
      }

      if (pathParts.length === 2) {
        const id = decodeURIComponent(pathParts[1]);

        if (request.method === "PUT") {
          return handleUpdateMovie(request, env, id);
        }
        if (request.method === "DELETE") {
          return handleDeleteMovie(request, env, id);
        }
      }
    }

    return jsonResponse({ error: "Rota não encontrada" }, 404);
  },
};