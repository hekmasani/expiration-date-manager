import { Stack, useLocalSearchParams } from 'expo-router';

import { ScreenScrollView } from '@/components/layout';
import { Text } from '@/components/ui/Text';
import { FoodIdForm } from '@/features/food-id/containers/food-id-form';
import { FoodContextProvider } from '@/features/food-id/provider';

export default function EditFoodScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const foodId = Number(id);

  return (
    <FoodContextProvider foodId={foodId}>
      <Stack.Screen options={{ title: 'Modifier un aliment' }} />
      <ScreenScrollView>
        <Text variant="display" className="mb-4">
          Modifier
        </Text>
        <FoodIdForm />
      </ScreenScrollView>
    </FoodContextProvider>
  );
}
