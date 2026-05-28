import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

import { useFoodIdContextProvider } from '../provider';

export function FoodIdActions() {
  const router = useRouter();
  const { food, handleDelete } = useFoodIdContextProvider();

  return (
    <View className="mb-5 rounded-3xl border border-slate-200 bg-white p-5">
      <View className="gap-2">
        <Button onPress={() => router.push(`/foods/${food.id}/add-instance`)}>
          <Text variant="button" tone="inverse">
            Ajouter un lot
          </Text>
        </Button>
        <Button variant="secondary" onPress={() => router.push(`/foods/${food.id}/edit`)}>
          <Text variant="button">Modifier</Text>
        </Button>
        <Button variant="secondary" onPress={() => router.push(`/foods/${food.id}/alerts`)}>
          <Text variant="button">Configurer les alertes</Text>
        </Button>
        <Button variant="destructive" onPress={handleDelete}>
          <Text variant="button" tone="danger">
            Supprimer
          </Text>
        </Button>
      </View>
    </View>
  );
}
