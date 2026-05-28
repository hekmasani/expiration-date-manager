import { Stack } from 'expo-router';

import { Text } from '@/components/Themed';

export default function RecipeListScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Recettes' }} />
      <Text>Liste des recettes</Text>
    </>
  );
}
