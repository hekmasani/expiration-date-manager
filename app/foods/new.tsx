import { useLocalSearchParams } from 'expo-router';

import { ScreenScrollView } from '@/components/layout';
import { Text } from '@/components/ui/Text';
import { FoodNewForm } from '@/features/food-new/containers/food-new-form';
import { FoodNewContextProvider } from '@/features/food-new/provider';

export default function NewFoodScreen() {
  const params = useLocalSearchParams<{ barcode?: string }>();

  return (
    <FoodNewContextProvider initialBarcode={params.barcode ?? ''}>
      <ScreenScrollView>
        <Text variant="display" className="mb-4">
          Nouvel aliment
        </Text>
        <FoodNewForm />
      </ScreenScrollView>
    </FoodNewContextProvider>
  );
}
