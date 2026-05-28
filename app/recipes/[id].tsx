import { Stack } from 'expo-router';

import { Text } from '@/components/Themed';

export default function RecipeDetailScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Détail de la recette' }} />
      <Text>Détail de la recette</Text>
    </>
  );
}
