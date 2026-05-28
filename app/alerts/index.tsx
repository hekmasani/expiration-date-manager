import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ScreenView } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { formatAlertCountdown, useAlertItems } from '@/features/alerts/alert-engine';

export default function AlertListScreen() {
  const router = useRouter();
  const { alerts, refetch } = useAlertItems();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <ScreenView>
      <Stack.Screen options={{ title: 'Alertes' }} />
      <View className="mb-4">
        <Text variant="display">Alertes</Text>
        <Text tone="subtle" className="mt-2">
          Lots proches de la péremption, triés par urgence.
        </Text>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        refreshing={false}
        onRefresh={refetch}
        ListEmptyComponent={
          <EmptyState
            title="Aucune alerte"
            message="Configurez des seuils globaux ou personnalisés pour afficher les lots à surveiller."
          />
        }
        renderItem={({ item }) => (
          <Card
            className="mb-3 gap-2"
            onTouchEnd={() => router.push(`/alerts/${item.instance.id}`)}
          >
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1">
                <Text variant="subtitle">{item.food.name}</Text>
                <Text tone="subtle">Lot du {item.instance.expiration_date}</Text>
              </View>
              <Text variant="label" tone={item.daysUntilExpiration <= 1 ? 'danger' : 'muted'}>
                J-{item.threshold}
              </Text>
            </View>
            <Text tone={item.daysUntilExpiration <= 1 ? 'danger' : 'default'}>
              {formatAlertCountdown(item.daysUntilExpiration)}
            </Text>
            <Text variant="caption" tone="subtle">
              {item.isCustom ? 'Alerte personnalisée' : 'Alerte globale'}
            </Text>
          </Card>
        )}
      />
    </ScreenView>
  );
}
