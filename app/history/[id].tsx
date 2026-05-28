import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { FoodImage } from '@/components/foods';
import { ScreenScrollView } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { FoodInstanceWithFood, useFoodInstances } from '@/hooks/useDatabase';

function getArchivedAt(instance: FoodInstanceWithFood) {
  return instance.status === 'consumed' ? instance.consumed_at : instance.discarded_at;
}

function formatDate(date: Date | null) {
  if (!date) return 'Date inconnue';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short' }).format(date);
}

function statusLabel(status: FoodInstanceWithFood['status']) {
  if (status === 'consumed') return 'Consommé';
  if (status === 'discarded') return 'Jeté';
  return 'Actif';
}

export default function HistoryDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getArchivedInstanceById } = useFoodInstances();
  const [instance, setInstance] = useState<FoodInstanceWithFood | null>();

  useFocusEffect(
    useCallback(() => {
      async function loadInstance() {
        const archived = await getArchivedInstanceById(Number(id));
        setInstance(archived);
      }

      loadInstance();
    }, [getArchivedInstanceById, id])
  );

  if (!instance) {
    return (
      <ScreenScrollView>
        <Card className="gap-3">
          <Text variant="subtitle">Lot introuvable</Text>
          <Text tone="subtle">Ce lot n’existe pas ou il est encore actif.</Text>
          <Button variant="secondary" onPress={() => router.back()}>
            Retour
          </Button>
        </Card>
      </ScreenScrollView>
    );
  }

  return (
    <ScreenScrollView>
      <Stack.Screen options={{ title: 'Détail du lot' }} />
      <Card className="mb-4 items-center gap-3">
        <FoodImage uri={instance.food.image_url} size={112} />
        <View className="items-center gap-1">
          <Text variant="display">{instance.food.name}</Text>
          <Text tone="subtle">Code-barres : {instance.food.barcode}</Text>
        </View>
      </Card>

      <Card className="mb-4 gap-3">
        <View className="flex-row items-center justify-between gap-3">
          <Text variant="title">Détail du lot archivé</Text>
          <Text variant="label" tone={instance.status === 'discarded' ? 'danger' : 'default'}>
            {statusLabel(instance.status)}
          </Text>
        </View>
        <Text>Date de péremption : {instance.expiration_date}</Text>
        <Text>Quantité : {instance.quantity}</Text>
        <Text>Archivé le : {formatDate(getArchivedAt(instance))}</Text>
        <Text tone="subtle">Créé le : {formatDate(instance.created_at)}</Text>
      </Card>

      <View className="gap-2">
        <Button onPress={() => router.push(`/foods/${instance.food.id}`)}>Voir l’aliment</Button>
        <Button variant="secondary" onPress={() => router.back()}>
          Retour
        </Button>
      </View>
    </ScreenScrollView>
  );
}
