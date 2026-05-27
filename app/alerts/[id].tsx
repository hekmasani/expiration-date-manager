import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { ScreenScrollView } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { formatAlertCountdown, useAlertItems } from '@/features/alerts/alert-engine';

export default function AlertDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { alerts } = useAlertItems();
  const alert = alerts.find((item) => item.instance.id === Number(id));

  if (!alert) {
    return (
      <ScreenScrollView>
        <Card className="gap-3">
          <Text variant="subtitle">Alerte introuvable</Text>
          <Text tone="subtle">{"Cette alerte n'est plus active ou le lot a été modifié."}</Text>
          <Button variant="secondary" onPress={() => router.back()}>
            Retour
          </Button>
        </Card>
      </ScreenScrollView>
    );
  }

  return (
    <ScreenScrollView>
      <View className="mb-4">
        <Text variant="display">Détail alerte</Text>
        <Text tone="subtle" className="mt-2">
          {alert.food.name}
        </Text>
      </View>

      <Card className="gap-3">
        <Text variant="subtitle">{formatAlertCountdown(alert.daysUntilExpiration)}</Text>
        <Text>Date de péremption : {alert.instance.expiration_date}</Text>
        <Text>Quantité : {alert.instance.quantity}</Text>
        <Text>Seuil déclenché : J-{alert.threshold}</Text>
        <Text tone="subtle">
          Source : {alert.isCustom ? 'alerte personnalisée' : 'alerte globale'}
        </Text>
        <Button onPress={() => router.push(`/foods/${alert.food.id}`)}>{"Voir l'aliment"}</Button>
      </Card>
    </ScreenScrollView>
  );
}
