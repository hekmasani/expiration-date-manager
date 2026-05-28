import { Stack } from 'expo-router';

import { Scanner } from '@/features/scanner/containers/scanner';
import { ScannerContextProvider } from '@/features/scanner/provider';

export default function ScannerScreen() {
  return (
    <ScannerContextProvider>
      <Stack.Screen options={{ title: 'Scanner' }} />
      <Scanner />
    </ScannerContextProvider>
  );
}
