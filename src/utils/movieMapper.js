export function mapMovieFromOMDb(omdbMovie) {
  return {
    id: omdbMovie.imdbID,
    title: omdbMovie.Title,
    year: omdbMovie.Year,
    genre: omdbMovie.Genre,
    poster: omdbMovie.Poster,
    plot: omdbMovie.Plot,
    rating: omdbMovie.imdbRating,
    status: "Quero assistir",
  };
}

export function mapMovieFromDB(dbMovie) {
  return {
    id: dbMovie.id,
    title: dbMovie.title,
    year: dbMovie.year,
    genre: dbMovie.genre,
    poster: dbMovie.poster,
    plot: dbMovie.plot,
    rating: dbMovie.rating,
    status: dbMovie.status,
    addedAt: dbMovie.added_at,
  };
}