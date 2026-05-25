import { Button } from './Button';
import { Text } from './Text';

export function FloatingActionButton({ onPress }: { onPress: () => void }) {
  return (
    <Button size="icon" onPress={onPress} className="absolute bottom-6 right-6 shadow-lg">
      <Text variant="title" tone="inverse">
        +
      </Text>
    </Button>
  );
}
