import { View } from 'react-native';

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

export function FoodIdActiveInstances() {
  const { activeInstances, handleArchiveInstance, handleDeleteInstance } =
    useFoodIdContextProvider();

  return (
    <View className="mb-5 rounded-3xl border border-slate-200 bg-white p-5">
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
                <View className="flex-row gap-2">
                  <Button
                    className="flex-1"
                    variant="secondary"
                    onPress={() => handleArchiveInstance(instance.id, 'consumed')}
                  >
                    <Text variant="button">Consommé</Text>
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onPress={() => handleArchiveInstance(instance.id, 'discarded')}
                  >
                    <Text variant="button" tone="danger">
                      Jeté
                    </Text>
                  </Button>
                </View>
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
  );
}
