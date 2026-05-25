import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { FoodImage } from '@/components/foods';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

import { useFoodIdContextProvider } from '../provider';

function getExpirationColor(expirationDate: string) {
  const today = new Date();
  const expiration = new Date(`${expirationDate}T00:00:00`);
  const diffInDays = Math.ceil((expiration.getTime() - today.getTime()) / 86_400_000);

  if (diffInDays <= 2) return '#ef4444';
  if (diffInDays <= 7) return '#fb923c';
  return '#10b981';
}

export function FoodIdDetails() {
  const router = useRouter();
  const { food, activeInstances, handleDelete, handleDeleteInstance } = useFoodIdContextProvider();

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

      <View className="mb-5">
        <Text variant="title" className="mb-3">
          Lots actifs
        </Text>
        {activeInstances.length === 0 ? (
          <View className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
            <Text tone="subtle" className="text-center">
              Aucun lot actif pour cet aliment.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {activeInstances.map((instance) => (
              <View
                key={instance.id}
                className="gap-3 rounded-3xl border border-slate-200 bg-white p-4"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: getExpirationColor(instance.expiration_date) }}
                  />
                  <View className="flex-1">
                    <Text variant="subtitle">{instance.expiration_date}</Text>
                    <Text tone="subtle">Quantité : {instance.quantity}</Text>
                  </View>
                </View>
                <View className="gap-2">
                  <Button variant="secondary" onPress={() => {}}>
                    <Text variant="button">Modifier le lot</Text>
                  </Button>
                  <Button variant="destructive" onPress={() => handleDeleteInstance(instance.id)}>
                    <Text variant="button" tone="danger">
                      Supprimer le lot
                    </Text>
                  </Button>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="mb-5">
        <Text variant="title" className="mb-3">
          Alertes personnalisées
        </Text>
        <View className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
          <Text tone="subtle" className="text-center">
            Les alertes personnalisées seront configurables ici.
          </Text>
        </View>
      </View>
    </>
  );
}
