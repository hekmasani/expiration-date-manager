import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Switch, View } from 'react-native';

import NotFoundScreen from '@/app/+not-found';
import { ScreenScrollView } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field } from '@/components/ui/Field';
import { Text } from '@/components/ui/Text';
import { Food, FoodAlertSetting, useAlertSettings, useFoods } from '@/hooks/useDatabase';

export default function FoodAlertsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const foodId = Number(id);
  const { findFoodById } = useFoods();
  const {
    getFoodAlertSettings,
    addFoodAlertSetting,
    updateFoodAlertSetting,
    deleteFoodAlertSetting,
  } = useAlertSettings();
  const [food, setFood] = useState<Food | null>();
  const [settings, setSettings] = useState<FoodAlertSetting[]>([]);
  const [daysBefore, setDaysBefore] = useState('');

  useEffect(() => {
    async function load() {
      const data = await findFoodById(foodId);
      setFood(data);
      setSettings(await getFoodAlertSettings(foodId));
    }

    load();
  }, [findFoodById, foodId, getFoodAlertSettings]);

  const refetchSettings = async () => {
    setSettings(await getFoodAlertSettings(foodId));
  };

  const handleAdd = async () => {
    const value = Number(daysBefore);

    if (!Number.isInteger(value) || value < 0) {
      Alert.alert('Jour invalide', 'Utilise un nombre entier positif.');
      return;
    }

    if (settings.some((setting) => setting.days_before === value)) {
      Alert.alert('Déjà configuré', `J-${value} existe déjà pour cet aliment.`);
      return;
    }

    const now = new Date();
    await addFoodAlertSetting({
      food_id: foodId,
      days_before: value,
      is_active: true,
      created_at: now,
      updated_at: now,
    });
    setDaysBefore('');
    await refetchSettings();
  };

  const handleDelete = async (settingId: number) => {
    await deleteFoodAlertSetting(settingId);
    await refetchSettings();
  };

  if (food === undefined) return null;
  if (food === null) return <NotFoundScreen />;

  const sortedSettings = [...settings].sort((a, b) => b.days_before - a.days_before);

  return (
    <ScreenScrollView>
      <Stack.Screen options={{ title: "Alertes de l'aliment" }} />
      <View className="mb-4">
        <Text variant="display">Alertes</Text>
        <Text tone="subtle" className="mt-2">
          Configuration personnalisée pour {food.name}. Si un seuil est ajouté ici, il remplace les
          alertes globales pour cet aliment.
        </Text>
      </View>

      <Card className="mb-4 gap-3">
        <Text variant="subtitle">Ajouter un seuil personnalisé</Text>
        <Field
          label="Jours avant péremption"
          placeholder="Ex: 5"
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
              Aucune alerte personnalisée. Les alertes globales sont utilisées.
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
                    await updateFoodAlertSetting(setting.id, { is_active: isActive });
                    await refetchSettings();
                  }}
                />
              </View>
              <Button variant="destructive" onPress={() => handleDelete(setting.id)}>
                Supprimer
              </Button>
            </Card>
          ))
        )}
      </View>
    </ScreenScrollView>
  );
}
