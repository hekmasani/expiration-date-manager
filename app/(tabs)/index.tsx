import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { formatAlertCountdown, useAlertItems } from '@/features/alerts/alert-engine';

export default function DashboardScreen() {
  const router = useRouter();
  const { alerts, refetch } = useAlertItems();
  const visibleAlerts = alerts.slice(0, 3);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  return (
    <ScrollView
      className="flex-1 bg-slate-50 px-4 py-4"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <View className="mb-6">
        <Text variant="display">Tableau de bord</Text>
        <Text tone="subtle" className="mt-2">
          Gérez vos aliments, lots et dates de péremption.
        </Text>
      </View>

      <Card className="mb-4 gap-4">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text variant="title">Alertes</Text>
            <Text tone="subtle" className="mt-1">
              Lots proches de la péremption.
            </Text>
          </View>
        </View>

        {visibleAlerts.length === 0 ? (
          <Text tone="subtle">Aucune alerte active.</Text>
        ) : (
          <View className="gap-2">
            {visibleAlerts.map((alert) => (
              <View key={alert.id} className="rounded-2xl bg-slate-50 p-3">
                <Text variant="label">{alert.food.name}</Text>
                <Text tone={alert.daysUntilExpiration <= 1 ? 'danger' : 'subtle'}>
                  {formatAlertCountdown(alert.daysUntilExpiration)}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Button onPress={() => router.push('/alerts')}>Voir les alertes</Button>
      </Card>

      <Card className="mb-4 gap-4">
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text variant="title">Gestion des aliments</Text>
            <Text tone="subtle" className="mt-1">
              Consultez la liste, ajoutez un aliment ou gérez ses lots.
            </Text>
          </View>
        </View>

        <Button onPress={() => router.push('/foods')}>
          <Text variant="button" tone="inverse">
            Voir les aliments
          </Text>
        </Button>
      </Card>

      <Card className="gap-4">
        <View>
          <Text variant="title">Paramètres</Text>
          <Text tone="subtle" className="mt-1">
            Gérer les seuils globaux J-7, J-3, J-1.
          </Text>
        </View>
        <Button variant="secondary" onPress={() => router.push('/settings/global-alerts')}>
          Alertes globales
        </Button>
      </Card>
    </ScrollView>
  );
}
