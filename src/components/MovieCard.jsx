import { Card, Image, Text, Badge, Group, Select, ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

const STATUS_OPTIONS = ["Quero assistir", "Assistindo", "Assistido"];

function MovieCard({ movie, onStatusChange, onDelete }) {
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
      </Group>

      <Group mt="sm" justify="space-between">
        <Select
          data={STATUS_OPTIONS}
          value={movie.status}
          onChange={(value) => onStatusChange(movie.id, value)}
          allowDeselect={false}
          style={{ flex: 1 }}
        />

        <ActionIcon color="red" variant="light" onClick={() => onDelete(movie.id)}>
          <IconTrash size={18} />
        </ActionIcon>
      </Group>
    </Card>
  );
}

export default MovieCard;