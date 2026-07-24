import { useState, useEffect, useMemo } from "react";
import {
  AppShell,
  Title,
  TextInput,
  Button,
  Group,
  SimpleGrid,
  Select,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";

import MovieCard from "../components/MovieCard";
import {
  searchMovie,
  getMovies,
  addMovie,
  updateMovieStatus,
  deleteMovie,
} from "../services/api";
import { mapMovieFromOMDb, mapMovieFromDB } from "../utils/movieMapper";

function Home() {
  const [search, setSearch] = useState("");
  const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [genreFilter, setGenreFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    setLoading(true);
    const data = await getMovies();
    setMovies(data.map(mapMovieFromDB));
    setLoading(false);
  }

  async function handleSearch() {
    if (!search.trim()) return;

    const result = await searchMovie(search);

    if (!result || result.Response === "False") {
      alert("Filme não encontrado.");
      setMovie(null);
      return;
    }

    setMovie(mapMovieFromOMDb(result));
  }

  async function handleAddMovie() {
    if (!movie) return;

    const alreadyExists = movies.some((m) => m.id === movie.id);
    if (alreadyExists) {
      alert("Esse filme já está na sua coleção.");
      return;
    }

    const movieWithDate = {
      ...movie,
      addedAt: Date.now(),
    };

    const response = await addMovie(movieWithDate);

    if (response.error) {
      alert(response.error);
      return;
    }

    setMovies((prev) => [...prev, movieWithDate]);
  }

  async function handleStatusChange(id, newStatus) {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );

    await updateMovieStatus(id, newStatus);
  }

  async function handleDeleteMovie(id) {
    setMovies((prev) => prev.filter((m) => m.id !== id));
    await deleteMovie(id);
  }

  const genreOptions = useMemo(() => {
    const allGenres = new Set();

    movies.forEach((m) => {
      if (!m.genre) return;
      m.genre.split(",").forEach((g) => allGenres.add(g.trim()));
    });

    return ["Todos", ...Array.from(allGenres)];
  }, [movies]);

  const visibleMovies = useMemo(() => {
    let list = [...movies];

    if (genreFilter !== "Todos") {
      list = list.filter((m) =>
        m.genre
          ?.split(",")
          .map((g) => g.trim())
          .includes(genreFilter)
      );
    }

    if (sortBy === "year-asc") {
      list.sort((a, b) => Number(a.year) - Number(b.year));
    } else if (sortBy === "year-desc") {
      list.sort((a, b) => Number(b.year) - Number(a.year));
    } else if (sortBy === "recent") {
      list.sort((a, b) => b.addedAt - a.addedAt);
    } else if (sortBy === "oldest") {
      list.sort((a, b) => a.addedAt - b.addedAt);
    }

    return list;
  }, [movies, genreFilter, sortBy]);

  if (loading) {
    return (
      <AppShell padding="md">
        <Title>Carregando coleção...</Title>
      </AppShell>
    );
  }

  return (
    <AppShell padding="md">
      <Title mb="lg">🎬 MovieShelf</Title>

      <Group mb="lg">
        <TextInput
          placeholder="Pesquisar filme..."
          leftSection={<IconSearch size={18} />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ flex: 1 }}
        />

        <Button onClick={handleSearch}>
          Buscar
        </Button>

        <Button leftSection={<IconPlus size={18} />} onClick={handleAddMovie}>
          Adicionar Filme
        </Button>
      </Group>

      {movie && (
        <div style={{ marginBottom: "30px" }}>
          <h2>Resultado da busca</h2>

          <img
            src={movie.poster}
            alt={movie.title}
            width="200"
          />

          <h3>{movie.title}</h3>

          <p><strong>Ano:</strong> {movie.year}</p>

          <p><strong>Gênero:</strong> {movie.genre}</p>

          <p><strong>Sinopse:</strong> {movie.plot}</p>
        </div>
      )}

      <Title order={2} mb="md">
        Minha Coleção
      </Title>

      <Group mb="md">
        <Select
          label="Filtrar por gênero"
          data={genreOptions}
          value={genreFilter}
          onChange={setGenreFilter}
          allowDeselect={false}
        />

        <Select
          label="Ordenar"
          data={[
            { value: "recent", label: "Adicionados recentemente" },
            { value: "oldest", label: "Adicionados primeiro" },
            { value: "year-desc", label: "Ano (mais novo primeiro)" },
            { value: "year-asc", label: "Ano (mais antigo primeiro)" },
          ]}
          value={sortBy}
          onChange={setSortBy}
          allowDeselect={false}
        />
      </Group>

      <SimpleGrid cols={3}>
        {visibleMovies.map((m) => (
          <MovieCard
            key={m.id}
            movie={m}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteMovie}
          />
        ))}
      </SimpleGrid>
    </AppShell>
  );
}

export default Home;