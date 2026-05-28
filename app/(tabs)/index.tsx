import { Stack, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { ActionCard } from '@/components/ActionCard';
import { Text } from '@/components/ui/Text';

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-slate-50 px-4 py-4"
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <Stack.Screen options={{ title: 'Tableau de bord' }} />
      <View className="mb-6">
        <Text variant="display">Tableau de bord</Text>
        <Text tone="subtle" className="mt-2">
          Gérez vos aliments, lots et dates de péremption.
        </Text>
      </View>

      <ActionCard
        title="Alertes"
        description="Consultez les lots proches de la péremption sur l'écran dédié."
        buttonLabel="Voir les alertes"
        onPress={() => router.push('/alerts')}
      />

      <ActionCard
        title="Gestion des aliments"
        description="Consultez la liste, ajoutez un aliment ou gérez ses lots."
        buttonLabel="Voir les aliments"
        onPress={() => router.push('/foods')}
      />

      <ActionCard
        title="Historique"
        description="Consultez les lots consommés et jetés."
        buttonLabel="Voir l'historique"
        onPress={() => router.push('/history')}
      />

      <ActionCard
        title="Paramètres"
        description="Gérer les seuils globaux J-7, J-3, J-1."
        buttonLabel="Alertes globales"
        onPress={() => router.push('/settings/global-alerts')}
      />
    </ScrollView>
  );
}
