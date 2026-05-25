import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FoodCard } from '@/components/foods';
import { ScreenView } from '@/components/layout';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { Text } from '@/components/ui/Text';
import { FoodInstance, useFoodInstances, useFoods } from '@/hooks/useDatabase';

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
  const { foods, refetch } = useFoods();
  const { instances, refetch: refetchInstances } = useFoodInstances();

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      refetchInstances();
    }, [refetch, refetchInstances])
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
        onRefresh={() => {
          refetch();
          refetchInstances();
        }}
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
