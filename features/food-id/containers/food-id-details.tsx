import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { FoodImage } from '@/components/foods';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

import { useFoodIdContextProvider } from '../provider';

export function FoodIdDetails() {
  const router = useRouter();
  const { food, handleDelete } = useFoodIdContextProvider();

  return (
    <>
      <View className="mb-4 items-center gap-3 rounded-3xl border border-slate-200 bg-white p-5">
        <FoodImage uri={food.image_url} size={128} />
        <View className="items-center gap-1">
          <Text variant="display">{food.name}</Text>
          <Text tone="subtle">Code-barres : {food.barcode}</Text>
        </View>
      </View>

      <View className="mb-5 gap-2">
        <Button onPress={() => {}}>
          <Text variant="button" tone="inverse">
            Ajouter un lot
          </Text>
        </Button>
        <Button variant="secondary" onPress={() => router.push(`/foods/${food.id}/edit`)}>
          <Text variant="button">Modifier</Text>
        </Button>
        <Button variant="secondary" onPress={() => {}}>
          <Text variant="button">Alertes</Text>
        </Button>
        <Button variant="destructive" onPress={handleDelete}>
          <Text variant="button" tone="danger">
            Supprimer
          </Text>
        </Button>
      </View>

      <View className="mb-5">
        <Text variant="title" className="mb-3">
          Lots actifs
        </Text>
        <View className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
          <Text tone="subtle" className="text-center">
            Aucun lot actif pour cet aliment.
          </Text>
        </View>
      </View>
    </>
  );
}
