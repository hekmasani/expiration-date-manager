import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';

export default function DashboardScreen() {
  const router = useRouter();

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

      <Card className="gap-4">
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
    </ScrollView>
  );
}
