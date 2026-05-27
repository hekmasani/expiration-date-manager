import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ScreenScrollView } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScreenScrollView>
      <View className="mb-4">
        <Text variant="display">Paramètres</Text>
      </View>

      <Card className="gap-3">
        <Text variant="subtitle">Alertes</Text>
        <Text tone="subtle">Configurer les seuils globaux de péremption.</Text>
        <Button onPress={() => router.push('/settings/global-alerts')}>Alertes globales</Button>
      </Card>
    </ScreenScrollView>
  );
}
