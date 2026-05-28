import { View } from 'react-native';

import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Text } from './ui/Text';

export interface ActionCardProps {
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
}

export function ActionCard({ title, description, buttonLabel, onPress }: ActionCardProps) {
  return (
    <Card className="mb-4 gap-4">
      <View>
        <Text variant="title">{title}</Text>
        <Text tone="subtle" className="mt-1">
          {description}
        </Text>
      </View>
      <Button variant="primary" onPress={onPress}>
        {buttonLabel}
      </Button>
    </Card>
  );
}
