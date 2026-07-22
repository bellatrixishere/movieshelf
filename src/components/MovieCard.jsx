import { Card, Image, Text, Badge, Group } from "@mantine/core";

function MovieCard({ movie }) {
  return (
    <Card shadow="md" radius="md" withBorder>
      <Card.Section>
        <Image
          src={movie.poster}
          height={320}
          alt={movie.title}
        />
      </Card.Section>

      <Group justify="space-between" mt="md">
        <Text fw={700}>{movie.title}</Text>

        <Badge color="yellow">
          ⭐ {movie.rating}
        </Badge>
      </Group>

      <Text c="dimmed" size="sm">
        {movie.year}
      </Text>

      <Group mt="sm">
        <Badge color="blue">
          {movie.genre}
        </Badge>

        <Badge color="green">
          {movie.status}
        </Badge>
      </Group>
    </Card>
  );
}

export default MovieCard;