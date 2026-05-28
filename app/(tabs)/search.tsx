import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FoodCard } from '@/components/foods';
import { ScreenView } from '@/components/layout';
import { Input } from '@/components/ui/Input';
import { FoodInstance, useFoodInstances, useFoods } from '@/hooks/useDatabase';

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

function getFoodSummary(foodId: number, instances: FoodInstance[]) {
  const activeInstances = instances
    .filter((instance) => instance.food_id === foodId && instance.status === 'active')
    .sort((a, b) => a.expiration_date.localeCompare(b.expiration_date));

  return {
    activeLotCount: activeInstances.length,
    nearestExpiration: activeInstances[0]?.expiration_date,
  };
}

export default function SearchScreen() {
  const router = useRouter();
  const { foods, refetch } = useFoods();
  const { instances, refetch: refetchInstances } = useFoodInstances();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim().toLowerCase());

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      refetchInstances();
    }, [refetch, refetchInstances])
  );

  const results = useMemo(() => {
    if (!debouncedQuery) return foods;
    return foods.filter((food) => food.name.toLowerCase().includes(debouncedQuery));
  }, [debouncedQuery, foods]);

  return (
    <ScreenView>
      <View className="mb-4">
        <Input
          label="Recherche"
          value={query}
          onChangeText={setQuery}
          placeholder="Nom d'aliment"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={results}
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
          <EmptyState title="Aucun résultat" message="Essayez avec un autre nom d'aliment." />
        }
      />
    </ScreenView>
  );
}
