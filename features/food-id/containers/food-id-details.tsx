import { View } from 'react-native';

import { FoodImage } from '@/components/foods';
import { Text } from '@/components/ui/Text';

import { useFoodIdContextProvider } from '../provider';

import { FoodIdActions } from './food-id-actions';
import { FoodIdActiveInstances } from './food-id-active-instances';

export function FoodIdDetails() {
  const { food } = useFoodIdContextProvider();

  return (
    <>
      <View className="mb-4 items-center gap-3 rounded-3xl border border-slate-200 bg-white p-5">
        <FoodImage uri={food.image_url} size={128} />
        <View className="items-center gap-1">
          <Text variant="display">{food.name}</Text>
          <Text tone="subtle">Code-barres : {food.barcode}</Text>
        </View>
      </View>

      <FoodIdActions />
      <FoodIdActiveInstances />
    </>
  );
}
