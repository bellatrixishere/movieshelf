const API_BASE_URL = "https://movieshelf-worker.gab-movieshelf.workers.dev";

export async function searchMovie(title) {
  const response = await fetch(`${API_BASE_URL}/search?title=${encodeURIComponent(title)}`);
  return response.json();
}

export async function getMovies() {
  const response = await fetch(`${API_BASE_URL}/movies`);
  return response.json();
}

export async function addMovie(movie) {
  const response = await fetch(`${API_BASE_URL}/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movie),
  });
  return response.json();
}

export async function updateMovieStatus(id, status) {
  const response = await fetch(`${API_BASE_URL}/movies/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return response.json();
}

export async function deleteMovie(id) {
  const response = await fetch(`${API_BASE_URL}/movies/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return response.json();
}