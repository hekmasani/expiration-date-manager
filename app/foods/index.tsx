import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { useGlobalContext } from '@/components/GlobalProvider';
import { FoodCard } from '@/components/foods';
import { ScreenView } from '@/components/layout';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { Text } from '@/components/ui/Text';
import { Food, FoodInstance, useFoodInstances, useFoods } from '@/hooks/useDatabase';

function getFoodSummary(foodId: number, instances: FoodInstance[]) {
  const activeInstances = instances.filter(
    (instance) => instance.food_id === foodId && instance.status === 'active'
  );

  return {
    activeLotCount: activeInstances.length,
    nearestExpiration: activeInstances[0]?.expiration_date,
  };
}

export default function FoodListScreen() {
  const router = useRouter();
  const { setIsLoading } = useGlobalContext();
  const { fetchFoods } = useFoods();
  const { fetchInstances } = useFoodInstances();
  const [foods, setFoods] = useState<Food[]>([]);
  const [instances, setInstances] = useState<FoodInstance[]>([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [foodsData, instancesData] = await Promise.all([fetchFoods(), fetchInstances()]);
      setFoods(foodsData);
      setInstances(instancesData);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFoods, fetchInstances, setIsLoading]);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  return (
    <ScreenView>
      <View className="mb-4">
        <Text variant="display">Aliments</Text>
      </View>

      <FlatList
        data={foods}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const summary = getFoodSummary(item.id, instances);

          return (
            <FoodCard
              food={item}
              activeLotCount={summary.activeLotCount}
              nearestExpiration={summary.nearestExpiration}
              onPress={() => router.push(`/foods/${item.id}`)}
            />
          );
        }}
        refreshing={false}
        onRefresh={loadData}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 96 }}
        ListEmptyComponent={
          <EmptyState
            title="Aucun aliment"
            message="Ajoutez votre premier aliment pour suivre ses lots et dates de péremption."
          />
        }
      />

      <FloatingActionButton onPress={() => router.push('/foods/new')} />
    </ScreenView>
  );
}
