import { useLocalSearchParams } from 'expo-router';

import { ScreenScrollView } from '@/components/layout';
import { FoodIdDetails } from '@/features/food-id/containers/food-id-details';
import { FoodContextProvider } from '@/features/food-id/provider';

export default function FoodDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const foodId = Number(id);

  return (
    <FoodContextProvider foodId={foodId}>
      <ScreenScrollView>
        <FoodIdDetails />
      </ScreenScrollView>
    </FoodContextProvider>
  );
}
