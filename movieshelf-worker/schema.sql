CREATE TABLE IF NOT EXISTS movies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  year TEXT,
  genre TEXT,
  poster TEXT,
  plot TEXT,
  rating TEXT,
  status TEXT NOT NULL DEFAULT 'Quero assistir',
  added_at INTEGER NOT NULL
);