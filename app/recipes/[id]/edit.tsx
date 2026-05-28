import { Stack } from 'expo-router';

import { Text } from '@/components/Themed';

export default function EditRecipeScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Modifier la recette' }} />
      <Text>Modifier la recette</Text>
    </>
  );
}
