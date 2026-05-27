import { useState } from 'react';
import { Alert, Switch, View } from 'react-native';

import { ScreenScrollView } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Text } from '@/components/ui/Text';
import { useAlertSettings } from '@/hooks/useDatabase';

export default function GlobalAlertsScreen() {
  const { globalSettings, addGlobalSetting, updateGlobalSetting, deleteGlobalSetting } =
    useAlertSettings();
  const [daysBefore, setDaysBefore] = useState('');

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

    const now = new Date();
    await addGlobalSetting({
      days_before: value,
      is_active: true,
      created_at: now,
      updated_at: now,
    });
    setDaysBefore('');
  };

  return (
    <ScreenScrollView>
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
                    await updateGlobalSetting(setting.id, { is_active: isActive });
                  }}
                />
              </View>
              <Button variant="destructive" onPress={() => deleteGlobalSetting(setting.id)}>
                Supprimer
              </Button>
            </Card>
          ))
        )}
      </View>
    </ScreenScrollView>
  );
}
