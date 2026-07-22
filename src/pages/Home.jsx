import { useState } from "react";
import {
  AppShell,
  Title,
  TextInput,
  Button,
  Group,
  SimpleGrid,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";

import MovieCard from "../components/MovieCard";
import movies from "../data/movies";
import { searchMovie } from "../services/omdb";

function Home() {
  const [search, setSearch] = useState("");
  const [movie, setMovie] = useState(null);

  async function handleSearch() {
    if (!search.trim()) return;

    const result = await searchMovie(search);

    if (result.Response === "False") {
      alert("Filme não encontrado.");
      setMovie(null);
      return;
    }

    setMovie(result);
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

        <Button leftSection={<IconPlus size={18} />}>
          Adicionar Filme
        </Button>
      </Group>

      {movie && (
        <div style={{ marginBottom: "30px" }}>
          <h2>Resultado da busca</h2>

          <img
            src={movie.Poster}
            alt={movie.Title}
            width="200"
          />

          <h3>{movie.Title}</h3>

          <p><strong>Ano:</strong> {movie.Year}</p>

          <p><strong>Gênero:</strong> {movie.Genre}</p>

          <p><strong>Sinopse:</strong> {movie.Plot}</p>
        </div>
      )}

      <Title order={2} mb="md">
        Minha Coleção
      </Title>

      <SimpleGrid cols={3}>
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </SimpleGrid>
    </AppShell>
  );
}

export default Home;