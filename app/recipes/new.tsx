import { Stack } from 'expo-router';

import { Text } from '@/components/Themed';

export default function NewRecipeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Nouvelle recette' }} />
      <Text>Nouvelle recette</Text>
    </>
  );
}
