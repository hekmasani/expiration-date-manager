import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Switch, View } from 'react-native';

import { useGlobalContext } from '@/components/GlobalProvider';
import { ScreenScrollView } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Text } from '@/components/ui/Text';
import { GlobalAlertSetting, useAlertSettings } from '@/hooks/useDatabase';

export default function GlobalAlertsScreen() {
  const { setIsLoading } = useGlobalContext();
  const { fetchGlobalSettings, addGlobalSetting, updateGlobalSetting, deleteGlobalSetting } =
    useAlertSettings();
  const [globalSettings, setGlobalSettings] = useState<GlobalAlertSetting[]>([]);
  const [daysBefore, setDaysBefore] = useState('');

  const loadSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchGlobalSettings();
      setGlobalSettings(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [fetchGlobalSettings, setIsLoading]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const sortedSettings = [...globalSettings].sort((a, b) => b.days_before - a.days_before);

  const handleAdd = async () => {
    const value = Number(daysBefore);

    if (!Number.isInteger(value) || value < 0) {
      Alert.alert('Jour invalide', 'Utilise un nombre entier positif.');
      return;
    }

    if (globalSettings.some((setting) => setting.days_before === value)) {
      Alert.alert('Déjà configuré', `J-${value} existe déjà.`);
      return;
    }

    try {
      const now = new Date();
      await addGlobalSetting({
        days_before: value,
        is_active: true,
        created_at: now,
        updated_at: now,
      });
      setDaysBefore('');
      await loadSettings();
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : "Impossible d'ajouter le seuil."
      );
    }
  };

  return (
    <ScreenScrollView>
      <Stack.Screen options={{ title: 'Alertes globales' }} />
      <View className="mb-4">
        <Text variant="display">Alertes globales</Text>
        <Text tone="subtle" className="mt-2">
          Seuils appliqués aux aliments sans configuration personnalisée.
        </Text>
      </View>

      <Card className="mb-4 gap-3">
        <Text variant="subtitle">Ajouter un seuil</Text>
        <Field
          label="Jours avant péremption"
          placeholder="Ex: 7"
          value={daysBefore}
          onChangeText={setDaysBefore}
          keyboardType="number-pad"
        />
        <Button onPress={handleAdd}>Ajouter</Button>
      </Card>

      <View className="gap-3">
        {sortedSettings.length === 0 ? (
          <Card>
            <Text tone="subtle" className="text-center">
              Aucun seuil global configuré.
            </Text>
          </Card>
        ) : (
          sortedSettings.map((setting) => (
            <Card key={setting.id} className="gap-3">
              <View className="flex-row items-center justify-between gap-3">
                <View>
                  <Text variant="subtitle">J-{setting.days_before}</Text>
                  <Text tone="subtle">{setting.is_active ? 'Actif' : 'Inactif'}</Text>
                </View>
                <Switch
                  value={setting.is_active}
                  onValueChange={async (isActive) => {
                    try {
                      await updateGlobalSetting(setting.id, { is_active: isActive });
                      await loadSettings();
                    } catch (error) {
                      console.error(error);
                      Alert.alert(
                        'Erreur',
                        error instanceof Error ? error.message : "Impossible de modifier le seuil."
                      );
                    }
                  }}
                />
              </View>
              <Button
                variant="destructive"
                onPress={async () => {
                  try {
                    await deleteGlobalSetting(setting.id);
                    await loadSettings();
                  } catch (error) {
                    console.error(error);
                    Alert.alert(
                      'Erreur',
                      error instanceof Error ? error.message : 'Impossible de supprimer le seuil.'
                    );
                  }
                }}
              >
                Supprimer
              </Button>
            </Card>
          ))
        )}
      </View>
    </ScreenScrollView>
  );
}
