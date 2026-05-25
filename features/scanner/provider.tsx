import { BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { createContext, ReactNode, useContext, useRef } from 'react';
import { Alert } from 'react-native';

import { useGlobalLoading } from '@/components/GlobalProvider';
import { useFoodLookup } from '@/hooks/useDatabase';

type ScannerContextType = {
  handleBarcodeScanned: (result: BarcodeScanningResult) => void;
};

const ScannerContext = createContext<ScannerContextType | null>(null);

export function useScannerContextProvider() {
  const context = useContext(ScannerContext);

  if (context === null) {
    throw new Error('useScannerContextProvider must be used within a ScannerContext');
  }

  return context;
}

function normalizeBarcode(code: string) {
  return code.trim();
}

export function ScannerContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { setIsLoading } = useGlobalLoading();
  const { findFoodByBarcode } = useFoodLookup();
  const isHandlingScanRef = useRef(false);

  async function handleBarcode(rawCode: string, shouldPlayFeedback = false) {
    const code = normalizeBarcode(rawCode);

    if (!code || isHandlingScanRef.current) return;

    isHandlingScanRef.current = true;
    setIsLoading(true);

    try {
      const food = await findFoodByBarcode(code);

      if (food) {
        router.push(`/foods/${food.id}`);
      } else {
        router.push(`/foods/new?barcode=${encodeURIComponent(code)}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Impossible de vérifier ce code-barres pour l'instant.");
    } finally {
      isHandlingScanRef.current = false;
      setIsLoading(false);
    }
  }

  function handleBarcodeScanned(result: BarcodeScanningResult) {
    handleBarcode(result.data, true).catch(console.error);
  }

  return (
    <ScannerContext.Provider
      value={{
        handleBarcodeScanned,
      }}
    >
      {children}
    </ScannerContext.Provider>
  );
}
