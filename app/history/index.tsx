import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ScreenView } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { FoodInstanceWithFood, useFoodInstances } from '@/hooks/useDatabase';

function getArchivedAt(instance: FoodInstanceWithFood) {
  return instance.status === 'consumed' ? instance.consumed_at : instance.discarded_at;
}

function formatDate(date: Date | null) {
  if (!date) return 'Date inconnue';
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function statusLabel(status: FoodInstanceWithFood['status']) {
  if (status === 'consumed') return 'Consommé';
  if (status === 'discarded') return 'Jeté';
  return 'Actif';
}

type HistoryFilter = 'all' | 'consumed' | 'discarded';

const filters: { label: string; value: HistoryFilter }[] = [
  { label: 'Tout', value: 'all' },
  { label: 'Consommé', value: 'consumed' },
  { label: 'Jeté', value: 'discarded' },
];

export default function HistoryListScreen() {
  const router = useRouter();
  const { getArchivedInstances } = useFoodInstances();
  const [items, setItems] = useState<FoodInstanceWithFood[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<HistoryFilter>('all');

  const refetch = useCallback(async () => {
    const archived = await getArchivedInstances();
    setItems(archived);
  }, [getArchivedInstances]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const filteredItems = useMemo(() => {
    if (selectedFilter === 'all') return items;
    return items.filter((item) => item.status === selectedFilter);
  }, [items, selectedFilter]);

  return (
    <ScreenView>
      <Stack.Screen options={{ title: 'Historique' }} />
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        refreshing={false}
        onRefresh={refetch}
        ListHeaderComponent={
          <View className="mb-4 gap-4">
            <View>
              <Text variant="display">Historique</Text>
              <Text tone="subtle" className="mt-2">
                Lots consommés ou jetés, avec leurs dates d’archivage.
              </Text>
            </View>
            <View className="flex-row gap-2">
              {filters.map((filter) => {
                const isSelected = selectedFilter === filter.value;

                return (
                  <Button
                    key={filter.value}
                    className="flex-1"
                    variant={isSelected ? 'primary' : 'secondary'}
                    size="sm"
                    onPress={() => setSelectedFilter(filter.value)}
                  >
                    {filter.label}
                  </Button>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title={items.length === 0 ? 'Aucun lot archivé' : 'Aucun résultat'}
            message={
              items.length === 0
                ? 'Marquez un lot comme consommé ou jeté pour alimenter l’historique.'
                : 'Aucun lot ne correspond au filtre sélectionné.'
            }
          />
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/history/${item.id}`)}>
            <Card className="mb-3 gap-2">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text variant="subtitle">{item.food.name}</Text>
                  <Text tone="subtle">Lot du {item.expiration_date}</Text>
                </View>
                <Text variant="label" tone={item.status === 'discarded' ? 'danger' : 'default'}>
                  {statusLabel(item.status)}
                </Text>
              </View>
              <Text tone="subtle">Archivé le {formatDate(getArchivedAt(item))}</Text>
              <Text tone="subtle">Quantité : {item.quantity}</Text>
            </Card>
          </Pressable>
        )}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
      />
    </ScreenView>
  );
}
