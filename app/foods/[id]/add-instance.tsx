import { useLocalSearchParams } from 'expo-router';

import { ScreenScrollView } from '@/components/layout';
import { Text } from '@/components/ui/Text';
import { FoodInstanceForm } from '@/features/food-id/containers/food-instance-form';
import { FoodContextProvider } from '@/features/food-id/provider';

export default function AddFoodInstanceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const foodId = Number(id);

  return (
    <FoodContextProvider foodId={foodId}>
      <ScreenScrollView>
        <Text variant="display" className="mb-4">
          Ajouter un lot
        </Text>
        <FoodInstanceForm />
      </ScreenScrollView>
    </FoodContextProvider>
  );
}
