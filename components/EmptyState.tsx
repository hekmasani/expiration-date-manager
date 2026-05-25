import { View } from 'react-native';

import { Text } from './ui/Text';

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-2 px-8">
      <Text variant="title" className="text-center">
        {title}
      </Text>
      <Text tone="subtle" className="text-center">
        {message}
      </Text>
    </View>
  );
}
