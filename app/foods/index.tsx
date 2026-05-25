import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FoodCard } from '@/components/foods';
import { ScreenView } from '@/components/layout';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';
import { Text } from '@/components/ui/Text';
import { useFoods } from '@/hooks/useDatabase';

export default function FoodListScreen() {
  const router = useRouter();
  const { foods } = useFoods();

  return (
    <ScreenView>
      <View className="mb-4">
        <Text variant="display">Aliments</Text>
      </View>

      <FlatList
        data={foods}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <FoodCard food={item} onPress={() => router.push(`/foods/${item.id}`)} />
        )}
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
